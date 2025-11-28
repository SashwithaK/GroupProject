# 🔧 Connecting Backend to Your Existing Langfuse Instance

Since you already have Langfuse running on `localhost:3001`, follow these steps to connect your AI Handwritten Text Extractor backend to it.

## Step 1: Get Langfuse API Keys

1. **Open Langfuse UI**: http://localhost:3001
2. **Login** to your existing account
3. **Navigate to Settings**:
   - Click on your profile/settings icon
   - Go to **API Keys** section
4. **Create New API Keys** (if you don't have them):
   - Click **"Create new API keys"**
   - Give it a name: `AI-Handwriting-Extractor`
   - Click **Create**
5. **Copy the Keys**:
   - **Public Key** (starts with `pk-lf-...`)
   - **Secret Key** (starts with `sk-lf-...`)
   
   ⚠️ **Important**: Save the secret key now - you won't be able to see it again!

## Step 2: Configure Backend Environment

Edit your `backend/.env` file and add/update these lines:

```env
# Langfuse Configuration (Local Instance)
LANGFUSE_PUBLIC_KEY=pk-lf-your-public-key-here
LANGFUSE_SECRET_KEY=sk-lf-your-secret-key-here
LANGFUSE_HOST=http://localhost:3000
```

**Note**: The `LANGFUSE_HOST` should be `http://localhost:3000` (not 3001). Port 3001 is for the UI, but the API runs on port 3000.

### Complete Example `.env` File

```env
# REQUIRED: Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# REQUIRED: Langfuse Configuration
LANGFUSE_PUBLIC_KEY=pk-lf-1234567890abcdef
LANGFUSE_SECRET_KEY=sk-lf-0987654321fedcba
LANGFUSE_HOST=http://localhost:3000

# Optional: HuggingFace Configuration
HF_TOKEN=your_huggingface_token

# Optional: Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llava:latest
OLLAMA_TIMEOUT_SECONDS=120
OLLAMA_TEMPERATURE=0.1
OLLAMA_NUM_PREDICT=2048

# Optional: Image Processing Settings
ENABLE_IMAGE_PREPROCESSING=true
USE_CONSENSUS_MODE=true
```

## Step 3: Restart Backend

If your backend is running, restart it to pick up the new configuration:

### If running with Docker:
```bash
docker-compose restart backend
```

### If running manually:
```bash
# Stop the current backend (Ctrl+C)
# Then restart it
cd backend
python main.py
```

## Step 4: Verify Connection

1. **Start the backend** (if not already running)
2. **Check backend logs** for Langfuse initialization:
   ```
   [OK] Langfuse initialized successfully
   ```
3. **Upload an image** through the frontend (http://localhost:5000 or http://localhost:3000)
4. **Check Langfuse Dashboard** (http://localhost:3001):
   - Go to **Traces** tab
   - You should see a new trace for `handwriting_extraction_hf`

## Troubleshooting

### Backend shows "Langfuse initialization failed"

**Check 1: Verify API Keys**
- Ensure keys are correctly copied (no extra spaces)
- Public key starts with `pk-lf-`
- Secret key starts with `sk-lf-`

**Check 2: Verify Langfuse Host**
- Should be `http://localhost:3000` (API port)
- NOT `http://localhost:3001` (UI port)

**Check 3: Test Langfuse API**
```bash
# Test if Langfuse API is accessible
curl http://localhost:3000/api/public/health
```

Should return: `{"status":"OK"}`

### No traces appearing in Langfuse

**Check 1: Backend logs**
```bash
# If using Docker
docker-compose logs backend | grep -i langfuse

# If running manually
# Check console output for Langfuse messages
```

**Check 2: Verify backend is using Langfuse**
- Look for `[OK] Langfuse initialized successfully` in logs
- If you see `[WARNING] Langfuse credentials not found`, check your `.env` file

**Check 3: Upload a test image**
- Go to frontend
- Upload any handwritten image
- Check backend logs for trace creation
- Refresh Langfuse dashboard

### Connection refused errors

If you see connection errors, your Langfuse instance might be running in a different configuration:

**Option A: Langfuse running in Docker**
- If Langfuse is in Docker, use: `LANGFUSE_HOST=http://langfuse-server:3000`
- This assumes Langfuse container is named `langfuse-server`

**Option B: Langfuse running standalone**
- Use: `LANGFUSE_HOST=http://localhost:3000`
- Ensure Langfuse is actually running on port 3000 (API) and 3001 (UI)

## How to Check Your Langfuse Setup

Run this command to see what ports Langfuse is using:

```bash
# Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Or check Docker containers
docker ps | findstr langfuse
```

## Expected Behavior

Once configured correctly:

1. ✅ Backend starts with: `[OK] Langfuse initialized successfully`
2. ✅ Each image upload creates a trace in Langfuse
3. ✅ Traces show timing, input/output, and any errors
4. ✅ You can see performance metrics in Langfuse dashboard

## Need More Help?

- Check the main [README.md](README.md) for full documentation
- View backend logs for detailed error messages
- Ensure Langfuse is accessible at http://localhost:3001
- Verify API endpoint at http://localhost:3000/api/public/health

---

**Happy Tracing! 📊**
