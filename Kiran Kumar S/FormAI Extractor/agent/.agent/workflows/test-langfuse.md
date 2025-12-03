---
description: Test Langfuse Integration End-to-End
---

# Test Langfuse Integration

This workflow tests the complete Langfuse integration to ensure traces appear in the dashboard.

## Prerequisites
- Docker containers running (`docker-compose up -d`)
- Langfuse dashboard accessible at http://localhost:3000
- Signed into Langfuse with a project created

## Steps

### 1. Verify Services Are Running
```powershell
docker-compose ps
```
Ensure `agent-backend-1` and `agent-frontend-1` are "Up".

### 2. Check Langfuse Environment Variables
```powershell
docker-compose exec backend env | findstr LANGFUSE
```
Confirm all 4 variables are set (PUBLIC_KEY, SECRET_KEY, BASE_URL, OTLP_ENDPOINT).

### 3. Prepare Test Image
- Find or create a simple PNG/JPG image with text
- **Do NOT use PDF** (dependency issue)
- Save it as `test_image.png` in the project root

### 4. Upload via Frontend
- Open http://localhost:3001 in browser
- Upload the test image
- Wait for processing

### 5. Monitor Backend Logs
```powershell
docker-compose logs backend -f
```
Watch for:
- "✔ OCR Extracted:"
- "LLM RAW OUTPUT -->"
- Any errors

### 6. Check Langfuse Dashboard
- Open http://localhost:3000
- Go to "Tracing" section
- Look for new traces with spans:
  - `agent.run`
  - `ocr.extract`
  - `llm.structuring`

### 7. Verify Trace Data
Click on a trace to see:
- Input data (OCR text)
- Output data (structured JSON)
- Token usage
- Timing information

## Expected Result
✅ Traces appear in Langfuse dashboard with complete LLM generation data including prompts, outputs, and token counts.

## Troubleshooting
- **No traces**: Check backend logs for OpenTelemetry export errors
- **Empty dashboard**: Verify correct project selected in Langfuse
- **Processing fails**: Use image files, not PDFs
