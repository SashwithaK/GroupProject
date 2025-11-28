# 🛠️ Troubleshooting Upload Errors

If you are seeing **400 Bad Request** or **500 Internal Server Error** when uploading images, here is how to fix it.

## 1. Fix for "500 Internal Server Error"

This error usually happens because the backend was trying to use HuggingFace (which requires a token) instead of your local Ollama.

**✅ I have fixed this for you!**
I updated the code to automatically use **Ollama** if you haven't provided a HuggingFace token.

**What you need to do:**
Ensure Ollama is running on your machine and has the vision model:

1. **Check if Ollama is running**:
   Open a terminal and run:
   ```bash
   ollama list
   ```
   If it gives an error, start Ollama app.

2. **Pull the vision model**:
   The app uses `llava` by default. Run this command to download it:
   ```bash
   ollama pull llava
   ```
   *Note: This might take a few minutes (approx 4GB).*

## 2. Fix for "400 Bad Request"

This error means the file was rejected. Common reasons:

- **Wrong File Type**: Only `.jpg`, `.jpeg`, or `.png` are allowed. PDF is not supported yet.
- **File Too Large**: Max size is 10MB.
- **Corrupted Image**: The image file might be corrupted.

## 3. Verify Configuration

Your backend is now configured to connect to:
- **Langfuse**: `http://localhost:3000` (via `host.docker.internal`)
- **Ollama**: `http://localhost:11434` (via `host.docker.internal`)

You can verify the backend is ready by checking the logs:
```bash
docker-compose logs backend | findstr "Ollama"
```
It should say: `[OK] Ollama configured...`

## Summary of Fixes Applied

1. **Restored Ollama Support**: Added missing code to `agent.py` to allow using local Ollama models.
2. **Fixed Docker Networking**: Updated `docker-compose.yml` to allow backend to reach your local Ollama.
3. **Automatic Fallback**: The app now intelligently switches to Ollama if HuggingFace is not configured.

**Try uploading an image again!**
