# Langfuse Integration Test Guide

## Current Status ✅
- **Langfuse Dashboard**: http://localhost:3000 (Running)
- **Backend API**: http://localhost:8080 (Running with Langfuse keys configured)
- **Frontend**: http://localhost:3001 (Running)

## Environment Variables Confirmed ✅
```
LANGFUSE_PUBLIC_KEY=pk-lf-bf116d16-1e8a-406f-8af4-329ab7471005
LANGFUSE_SECRET_KEY=sk-lf-c448df54-5b71-49bf-b655-b136756c17b1
LANGFUSE_BASE_URL=http://localhost:3000
LANGFUSE_OTLP_ENDPOINT=http://localhost:3000/api/public/otlp/v1/traces
```

## How to Test and See Traces in Langfuse

### Step 1: Prepare a Test Image
Create a simple image with text (PNG or JPG format). You can:
- Use any screenshot
- Create a simple image with text in Paint
- Use an existing invoice/form image

**Important**: Do NOT use PDF files - there's a missing dependency issue with PDFBox in the Docker container.

### Step 2: Upload Through Frontend
1. Open http://localhost:3001 in your browser
2. Click "Browse Files" or drag-and-drop your image
3. Wait for processing to complete

### Step 3: Check Backend Logs
Run this command to see if traces are being sent:
```powershell
docker-compose logs backend --tail 50
```

Look for:
- "✔ OCR Extracted:" - confirms OCR worked
- "LLM RAW OUTPUT -->" - confirms LLM call succeeded
- Any OpenTelemetry export messages

### Step 4: Check Langfuse Dashboard
1. Open http://localhost:3000
2. Navigate to "Tracing" section
3. You should see traces with:
   - Span name: `agent.run`
   - Child spans: `ocr.extract`, `llm.structuring`
   - LLM input/output data
   - Token usage statistics

## Why Dashboard Might Be Empty

1. **No Documents Processed Yet**: Traces only appear after successfully processing a document
2. **PDF Upload Failed**: PDFBox dependency missing - use images instead
3. **Wrong Project**: Make sure you're viewing the correct project in Langfuse
4. **Time Filter**: Check the time range filter in Langfuse dashboard

## Quick Test Command
```powershell
# Create a simple text file (will fail OCR but test the flow)
echo "TEST INVOICE" > test.txt

# Upload it
curl.exe -X POST -F "file=@test.txt" http://localhost:8080/v1/uploads

# Get the runId from response, then check status
curl.exe http://localhost:8080/v1/runs/{runId}
```

## Expected Trace Structure
```
agent.run (root span)
├── ocr.extract (OCR processing)
└── llm.structuring (LLM call with input/output/tokens)
```

## Troubleshooting
- If no traces appear, check backend logs for errors
- Ensure you're signed into the correct Langfuse project
- Refresh the Langfuse dashboard page
- Check that the time range includes recent activity
