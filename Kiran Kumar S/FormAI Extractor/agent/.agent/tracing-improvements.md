# Improved Tracing for Langfuse

## Summary
Updated `AgentService.java` to include input and output attributes in the `agent.run` and `ocr.extract` spans. This ensures that Langfuse traces now show detailed information about the file being processed and the results at each step.

## Changes Made

### `AgentService.java`

1.  **`agent.run` Span**:
    -   **Input**: Added `input` attribute set to the file path (`path.toString()`).
    -   **Output**: Added `output` attribute set to the JSON representation of the `ExtractionResult` (or fallback result).

2.  **`ocr.extract` Span**:
    -   **Input**: Added `input` attribute set to the file path (`path.toString()`).
    -   **Output**: Added `output` attribute set to the JSON representation of the extracted OCR pages (`om.writeValueAsString(pages)`).

## Benefits

-   **Full Observability**: You can now see exactly what file was processed and what the raw OCR output was, directly in the Langfuse dashboard.
-   **Debugging**: Easier to diagnose issues by inspecting the intermediate OCR results and the final agent output.
-   **Completeness**: All major spans (`agent.run`, `ocr.extract`, `llm.structuring`) now have input/output data.
