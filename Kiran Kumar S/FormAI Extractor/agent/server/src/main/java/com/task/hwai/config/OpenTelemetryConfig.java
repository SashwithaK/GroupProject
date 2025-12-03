package com.task.hwai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.common.AttributeKey;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Configuration
public class OpenTelemetryConfig {
    @Bean
    public OpenTelemetry openTelemetry() {
        try {
            System.out.println("🔧 Initializing OpenTelemetry for Langfuse...");

            String endpoint = System.getenv().getOrDefault(
                    "LANGFUSE_OTLP_ENDPOINT", "http://host.docker.internal:3000/api/public/otlp");
            String publicKey = System.getenv("LANGFUSE_PUBLIC_KEY");
            String secretKey = System.getenv("LANGFUSE_SECRET_KEY");

            System.out.println("📡 OTLP Endpoint: " + endpoint);
            System.out.println("🔑 Public Key: "
                    + (publicKey != null ? publicKey.substring(0, Math.min(10, publicKey.length())) + "..." : "null"));

            if (publicKey == null || secretKey == null) {
                System.out.println(
                        "⚠️ Langfuse keys (LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY) not found. Tracing disabled.");
                return GlobalOpenTelemetry.get();
            }

            String auth = "Basic " + Base64.getEncoder()
                    .encodeToString((publicKey + ":" + secretKey).getBytes(StandardCharsets.UTF_8));

            OtlpHttpSpanExporter exporter = OtlpHttpSpanExporter.builder()
                    .setEndpoint(endpoint)
                    .addHeader("Authorization", auth)
                    .build();

            Resource resource = Resource.getDefault().toBuilder()
                    .put(AttributeKey.stringKey("service.name"), "handwrite-ai")
                    .build();

            SdkTracerProvider provider = SdkTracerProvider.builder()
                    .addSpanProcessor(BatchSpanProcessor.builder(exporter).build())
                    .setResource(resource)
                    .build();

            OpenTelemetrySdk sdk = OpenTelemetrySdk.builder()
                    .setTracerProvider(provider)
                    .build();

            GlobalOpenTelemetry.set(sdk);
            System.out.println("✅ OpenTelemetry initialized successfully! Traces will be sent to Langfuse.");
            return sdk;
        } catch (Throwable t) {
            System.err.println("❌ OpenTelemetry initialization failed, falling back to noop: " + t.getMessage());
            t.printStackTrace();
            return GlobalOpenTelemetry.get();
        }
    }

    @Bean
    public Tracer tracer(OpenTelemetry otel) {
        return otel.getTracer("com.example.hwai");
    }
}