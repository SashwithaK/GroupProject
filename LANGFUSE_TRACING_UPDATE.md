# Enhanced Langfuse Tracing - Update Summary

## ✅ What Was Fixed

I've enhanced the Langfuse integration to capture **detailed input and output** for every extraction request. Here's what changed:

### Changes Made

1. **Enhanced Input Capture**:
   - Now captures the full extraction prompt
   - Includes image path and metadata
   - Shows model name and parameters

2. **Added Generation Tracking**:
   - Creates a "generation" span for each API call
   - Tracks model parameters (temperature, max_tokens)
   - Records detailed input/output for the generation

3. **Improved Output Capture**:
   - Captures the complete extracted data
   - Shows all fields and values
   - Includes error information if extraction fails

4. **Added Flush Mechanism**:
   - Explicitly flushes data to Langfuse after each request
   - Ensures traces appear immediately in the dashboard
   - Adds confirmation logs when traces are sent

### Backend Logs Confirmation

When you upload an image, you should now see these messages in the backend logs:

```
✓ LangFuse tracing enabled
✓ LangFuse trace created: [trace-id]
✓ LangFuse trace updated and flushed
```

## 📊 What You'll See in Langfuse

### Trace Overview
- **Name**: `extract_image_[task-id]` or `extract_pdf_[task-id]`
- **Input**: 
  ```json
  {
    "image_path": "/app/uploads/[task-id].jpg",
    "prompt": "[Full extraction prompt]",
    "model": "Qwen/Qwen2.5-VL-7B-Instruct"
  }
  ```
- **Output**:
  ```json
  {
    "fields": [
      {"label": "Name", "value": "John Doe"},
      {"label": "Date", "value": "2023-10-27"},
      ...
    ]
  }
  ```

### Generation Details
Within each trace, you'll find a "huggingface_extraction" generation with:
- **Model**: Qwen/Qwen2.5-VL-7B-Instruct
- **Input**: Full prompt + image info
- **Output**: Extracted fields
- **Metadata**: temperature (0.1), max_tokens (1000)

## 🧪 Testing

I ran a test that successfully:
1. ✅ Created a test form image
2. ✅ Uploaded it to the backend
3. ✅ Extracted all fields correctly (Name, Email, Phone, Date)
4. ✅ Created a Langfuse trace (ID: 57789609-1872-4efe-81be-33d7e5a32ab3)
5. ✅ Flushed the trace to Langfuse

### Backend Log Output
```
✓ LangFuse tracing enabled
✓ LangFuse trace created: 57789609-1872-4efe-81be-33d7e5a32ab3
✓ LangFuse trace updated and flushed
```

## 🔍 How to View Traces

1. **Open Langfuse Dashboard**: http://localhost:3001
2. **Login**: admin@example.com / password123
3. **Select Project**: HandwrittenNotes
4. **Click "Traces"** in the sidebar
5. **View Latest Trace**: Click on any trace to see details

### What to Look For

In the trace details page, you should see:

1. **Input Section** (top):
   - Image path
   - Full extraction prompt
   - Model name

2. **Output Section** (middle):
   - All extracted fields with labels and values

3. **Metadata** (bottom):
   - Task ID
   - Extraction type
   - Page number (for PDFs)

4. **TRACE Timeline** (expandable):
   - "huggingface_extraction" generation
   - Click to expand and see generation-specific input/output

## 📝 Important Notes

### Why Traces Might Not Appear Immediately

1. **Network Latency**: Traces are sent asynchronously to Langfuse
2. **Flush Timing**: The `flush()` call ensures data is sent, but there may be a slight delay
3. **Browser Refresh**: Try refreshing the Langfuse dashboard if traces don't appear

### Troubleshooting

If traces still don't appear:

1. **Check Backend Logs**:
   ```bash
   docker logs handwritten_backend --tail 50
   ```
   Look for "✓ LangFuse trace created" messages

2. **Verify API Keys**:
   - Public Key: `pk-lf-b6432cb8-4f16-4989-ab53-8b654c6b41d8`
   - Secret Key: `sk-lf-5e47e73d-8211-46b3-812b-fa1f162fb46d`

3. **Check Langfuse Connection**:
   - Ensure Langfuse server is running: `docker ps | grep langfuse`
   - Verify the backend can reach Langfuse: `docker logs handwritten_backend | grep LangFuse`

4. **Upload a New Image**:
   - Go to http://localhost:3000
   - Upload any handwritten form or image
   - Check the backend logs for trace creation
   - Refresh Langfuse dashboard

## 🎯 Next Steps

1. **Test the Integration**:
   - Upload a new image at http://localhost:3000
   - Check backend logs for trace confirmation
   - View the trace in Langfuse dashboard

2. **Verify Input/Output**:
   - Click on a trace in Langfuse
   - Expand the "Input" section to see the prompt
   - Check the "Output" section for extracted fields
   - Expand the "TRACE" section to see generation details

3. **Monitor Performance**:
   - Use Langfuse to track extraction accuracy
   - Monitor processing times
   - Identify any errors or issues

## 📂 Files Modified

- `backend/langchain_integration.py`: Enhanced tracing with detailed input/output capture
- `backend/.env`: Updated with new Langfuse API keys
- `INTEGRATION_SUMMARY.md`: Updated documentation with new keys

## ✅ Summary

The Langfuse integration is now fully functional with:
- ✅ Detailed input capture (prompt + image metadata)
- ✅ Complete output capture (all extracted fields)
- ✅ Generation tracking with model parameters
- ✅ Automatic flushing to ensure traces appear
- ✅ Comprehensive error logging

All traces from new uploads will now appear in the Langfuse dashboard with full input and output information!
