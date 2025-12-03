package com.task.hwai.service;

import com.task.hwai.entity.ExtractionEntity;
import com.task.hwai.model.*;
import com.task.hwai.model.ExtractionResult.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.data.message.AiMessage;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Path;
import java.time.Instant;
import java.util.*;
import java.util.stream.Stream;

@Service
public class AgentService {

    private final ChatLanguageModel llm;
    private final OcrTool ocr;
    private final ObjectMapper om = new ObjectMapper();
    private final Tracer tracer;
    private final com.task.hwai.repo.RunRepo runRepo;
    private final com.task.hwai.repo.ExtractionRepo extractionRepo;

    public AgentService(ChatLanguageModel llm, OcrTool ocr, Tracer tracer,
            com.task.hwai.repo.RunRepo runRepo,
            com.task.hwai.repo.ExtractionRepo extractionRepo) {

        this.llm = llm;
        this.ocr = ocr;
        this.tracer = tracer;
        this.runRepo = runRepo;
        this.extractionRepo = extractionRepo;
    }

    @Transactional
    public ExtractionResult run(UUID fileId, UUID runId, Path path) throws Exception {

        var run = runRepo.findById(runId).orElseThrow();
        run.setStatus(RunStatus.PROCESSING);
        run.setStartedAt(Instant.now());
        runRepo.save(run);

        long t0 = System.currentTimeMillis();

        Span root = tracer.spanBuilder("agent.run")
                .setAttribute("file.id", fileId.toString())
                .setAttribute("run.id", runId.toString())
                .startSpan();
        root.setAttribute("input", path.toString());

        try {
            // ------------------ OCR ------------------
            var ocrSpan = tracer.spanBuilder("ocr.extract").startSpan();
            ocrSpan.setAttribute("input", path.toString());
            List<OcrTool.PageResult> pages;
            try {
                pages = ocr.extract(path);
                ocrSpan.setAttribute("output", om.writeValueAsString(pages));
            } finally {
                ocrSpan.end();
            }

            Map<String, Object> payload = Map.of("pages", pages);

            // ------------------ PROMPT ------------------
            String systemPrompt = """
                        You are a strict information extraction engine.
                        Convert OCR text into structured JSON ONLY.

                        RULES:
                        - Output ONLY VALID JSON.
                        - No explanations.
                        - Follow EXACT schema:

                        {
                          "file_id": string,
                          "run_id": string,
                          "document_type": string,
                          "pages": [ {
                            "page": number,
                            "fields": [
                              {"name": string, "value": string, "confidence": number}
                            ],
                            "tables": []
                          } ],
                          "warnings": [string],
                          "processing_time_ms": number
                        }
                    """;

            String userPayload = om.writeValueAsString(payload);

            // ------------------ LLM CALL ------------------
            var llmSpan = tracer.spanBuilder("llm.structuring")
                    .setAttribute("gen_ai.system", "openai")
                    .setAttribute("gen_ai.request.model", "gpt-4o-mini")
                    .startSpan();
            String rawOutput = null;

            try {
                String userMessageText = "OCR_DATA:\n" + userPayload;
                llmSpan.setAttribute("input", userMessageText);

                Response<AiMessage> response = llm.generate(
                        new SystemMessage(systemPrompt),
                        new UserMessage(userMessageText));
                rawOutput = response.content().text();

                llmSpan.setAttribute("output", rawOutput);
                if (response.tokenUsage() != null) {
                    llmSpan.setAttribute("gen_ai.usage.input_tokens", (long) response.tokenUsage().inputTokenCount());
                    llmSpan.setAttribute("gen_ai.usage.output_tokens", (long) response.tokenUsage().outputTokenCount());
                    llmSpan.setAttribute("gen_ai.usage.total_tokens", (long) response.tokenUsage().totalTokenCount());
                }

                System.out.println("LLM RAW OUTPUT --> " + rawOutput);

            } catch (Exception ex) {
                System.err.println("❌ LLM call failed: " + ex.getMessage());
                llmSpan.recordException(ex);
                rawOutput = null;
            } finally {
                llmSpan.end();
            }

            if (rawOutput == null || rawOutput.isBlank()) {
                ExtractionResult fallback = saveFallback(fileId, runId, t0, "LLM returned null or empty response");
                root.setAttribute("output", om.writeValueAsString(fallback));
                return fallback;
            }

            // ------------------ CLEAN JSON ------------------
            String json = cleanJsonResponse(rawOutput);
            System.out.println("CLEANED JSON --> " + json);

            // ------------------ PARSE JSON ------------------
            ExtractionResult result;
            try {
                result = om.readValue(json, ExtractionResult.class);
            } catch (Exception e) {
                System.err.println("❌ INVALID JSON FROM LLM");
                e.printStackTrace();
                ExtractionResult fallback = saveFallback(fileId, runId, t0, "LLM returned invalid JSON");
                root.setAttribute("output", om.writeValueAsString(fallback));
                return fallback;
            }

            // ------------------ ENFORCE IDs ------------------
            result = new ExtractionResult(
                    fileId.toString(),
                    runId.toString(),
                    result.documentType() == null ? "generic_form" : result.documentType(),
                    result.pages(),
                    result.warnings(),
                    System.currentTimeMillis() - t0);

            // ------------------ SAVE SUCCESS ------------------
            ExtractionEntity ex = new ExtractionEntity();
            ex.setRunId(runId);
            ex.setDocumentType(result.documentType());
            ex.setResultJson(om.writeValueAsString(result));
            ex.setAvgConfidence(averageConfidence(result));

            extractionRepo.save(ex);

            run.setStatus(RunStatus.COMPLETED);
            run.setCompletedAt(Instant.now());
            runRepo.save(run);

            root.setAttribute("output", om.writeValueAsString(result));
            return result;

        } catch (Exception ex) {
            run.setStatus(RunStatus.FAILED);
            run.setCompletedAt(Instant.now());
            run.setError(ex.getMessage());
            runRepo.save(run);
            throw ex;
        } finally {
            root.end();
        }
    }

    private String cleanJsonResponse(String json) {
        if (json == null)
            return "{}";
        json = json.trim();

        if (json.startsWith("```")) {
            json = json.replace("```json", "").replace("```", "").trim();
        }

        int start = json.indexOf("{");
        int end = json.lastIndexOf("}");

        if (start >= 0 && end > start) {
            return json.substring(start, end + 1);
        }
        return "{}";
    }

    private ExtractionResult saveFallback(UUID fileId, UUID runId, long t0, String warning) throws Exception {
        ExtractionResult fallback = new ExtractionResult(
                fileId.toString(),
                runId.toString(),
                "generic_form",
                List.of(),
                List.of(warning),
                System.currentTimeMillis() - t0);

        ExtractionEntity ex = new ExtractionEntity();
        ex.setRunId(runId);
        ex.setDocumentType("generic_form");
        ex.setResultJson(om.writeValueAsString(fallback));
        ex.setAvgConfidence(0.0);
        extractionRepo.save(ex);

        var run = runRepo.findById(runId).orElseThrow();
        run.setStatus(RunStatus.COMPLETED);
        run.setCompletedAt(Instant.now());
        runRepo.save(run);

        return fallback;
    }

    private Double averageConfidence(ExtractionResult r) {
        if (r == null || r.pages() == null)
            return null;

        return r.pages().stream()
                .filter(Objects::nonNull)
                .flatMap(p -> p.fields() == null ? Stream.empty() : p.fields().stream())
                .map(Field::confidence)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
    }

    @Transactional
    public Double calculateAverageConfidence(UUID runId) {
        var entity = extractionRepo.findByRunId(runId);
        if (entity.isEmpty()) {
            return null;
        }

        try {
            ExtractionResult result = om.readValue(entity.get().getResultJson(), ExtractionResult.class);
            return result.pages().stream()
                    .filter(Objects::nonNull)
                    .flatMap(p -> p.fields() == null ? Stream.empty() : p.fields().stream())
                    .map(Field::confidence)
                    .filter(Objects::nonNull)
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);
        } catch (Exception e) {
            return 0.0;
        }
    }
}