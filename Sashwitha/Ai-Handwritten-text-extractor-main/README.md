# 🖊️ Handwriting Extraction AI

A full-stack web application for extracting text from handwritten images using AI vision technology.

## 🎯 Features

- **AI-Powered OCR**: Uses local vision models served by Ollama (default: `llava`)
- **Edge-Friendly Setup**: Run multimodal inference without external API keys
- **Local Langfuse Observability**: Complete tracing and analytics running locally with Docker
- **Dynamic JSON Output**: Extracts structured data without predefined schemas
- **No Hallucinations**: Only extracts what's actually visible in the image
- **React Frontend**: Beautiful, user-friendly interface with drag-and-drop upload
- **FastAPI Backend**: High-performance async API

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Ollama** - Local multimodal inference server (default model: `llava`)
- **Langfuse** - AI observability and tracing
- **Python 3.11** - Programming language

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling

## 📋 Prerequisites

- **Docker & Docker Compose** (RECOMMENDED) - For running everything locally
- **OR** Manual setup:
  - Python 3.11+
  - Node.js 20+
- **Groq API Key** (REQUIRED) - Get one free at https://console.groq.com/keys
- [Ollama](https://ollama.com/) installed and running (optional, for local models)
- Vision model pulled locally (optional, recommended: `ollama pull bakllava`)

## 🚀 Quick Start

### Option A: Docker Compose (Recommended)

The easiest way to run the entire stack including **local Langfuse** for observability.

#### 1. Clone and Configure

```bash
# Navigate to project directory
cd Ai-Handwritten-text-extractor-main

# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env and add your Groq API key
# GROQ_API_KEY=your_actual_groq_api_key_here
```

#### 2. Start All Services

```bash
# Start all services (PostgreSQL, Langfuse, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

#### 3. Configure Langfuse (First Time Only)

1. Open **Langfuse UI** at http://localhost:3001
2. Create a local account (stored in PostgreSQL)
3. Go to **Settings** → **API Keys**
4. Click **Create new API keys**
5. Copy the **Public Key** and **Secret Key**
6. Update `backend/.env`:
   ```env
   LANGFUSE_PUBLIC_KEY=pk-lf-xxxxxxxx
   LANGFUSE_SECRET_KEY=sk-lf-xxxxxxxx
   LANGFUSE_HOST=http://langfuse-server:3000
   ```
7. Restart backend:
   ```bash
   docker-compose restart backend
   ```

#### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Langfuse Dashboard**: http://localhost:3001

#### 5. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

---

### Option B: Manual Setup (Without Docker)

### 1. Install & Prepare Ollama

```bash
# Install Ollama from https://ollama.com/download
ollama serve            # starts the local daemon (runs automatically on most systems)
ollama pull llava       # download the multimodal model used by this app
```

Keep the Ollama service running while you use the app.

### 2. Set Environment Variables

**⚠️ IMPORTANT: Groq API Key is REQUIRED**

Create a `.env` file in the `backend/` directory with your Groq API key:

1. Get your Groq API key from: https://console.groq.com/keys
2. Create `backend/.env` file with the following content:

```env
# REQUIRED: Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Optional: Ollama Configuration (if using local models)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=bakllava:latest

# Optional: Local Langfuse Configuration (for observability)
# After starting docker-compose, get these from http://localhost:3001
LANGFUSE_PUBLIC_KEY=pk-lf-your-langfuse-public-key
LANGFUSE_SECRET_KEY=sk-lf-your-langfuse-secret-key
LANGFUSE_HOST=http://langfuse-server:3000

# Optional: HuggingFace Configuration
HF_TOKEN=your_huggingface_token

# Optional: Ollama Settings
OLLAMA_TIMEOUT_SECONDS=120
OLLAMA_TEMPERATURE=0.1
OLLAMA_NUM_PREDICT=2048

# Optional: Image Processing Settings
ENABLE_IMAGE_PREPROCESSING=true
USE_CONSENSUS_MODE=true
```

**Note**: Replace `your_groq_api_key_here` with your actual Groq API key from https://console.groq.com/keys

### 2. Install Dependencies

#### Backend
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Run the Application

#### Start Backend (Terminal 1)
```bash
cd backend
python main.py
```
The backend will run on http://localhost:8000

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5000

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📖 How to Use

1. **Upload Image**: Click "Browse Files" or drag and drop a handwritten image
2. **Supported Formats**: JPG, PNG (PDF support coming soon)
3. **Extract**: Click "Extract Text" button
4. **View Results**: See beautifully formatted JSON output
5. **Copy JSON**: Click the copy button to copy extracted data

## 🔑 API Endpoints

### POST /upload
Upload a handwritten image for text extraction.

**Request**:
- Content-Type: `multipart/form-data`
- Body: File upload

**Response**:
```json
{
  "success": true,
  "filename": "example.jpg",
  "extracted_data": {
    "field1": "value1",
    "field2": "value2"
  },
  "message": "Handwriting extracted successfully"
}
```

### GET /health
Check API health status.

**Response**:
```json
{
  "status": "healthy",
  "agent_initialized": true,
  "ollama_host": "http://localhost:11434",
  "ollama_model": "llava",
  "langfuse_configured": true
}
```

### GET /
API information and available endpoints.

## 🎨 Project Structure

```
.
├── backend/
│   ├── main.py           # FastAPI application
│   ├── agent.py          # Ollama-powered agent with Langfuse tracing
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── vite.config.js    # Vite configuration
│   └── package.json      # Node dependencies
├── uploads/              # Temporary file storage
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🧠 How It Works

1. **Upload**: User uploads a handwritten image through the React frontend
2. **Backend Receives**: FastAPI receives the file and validates format/size
3. **AI Processing**: Ollama serves the multimodal model (default `llava`)
4. **Text Extraction**: AI reads handwriting and structures data as JSON
5. **Langfuse Tracing**: All operations are traced for observability
6. **Return Results**: Structured JSON is sent back to frontend
7. **Display**: React displays formatted JSON results

## 🔒 Security Features

- File type validation (JPG, PNG only)
- File size limits (10MB max)
- Temporary file cleanup
- Environment variable protection
- CORS configuration

## 🐛 Error Handling

The application handles:
- Unreadable handwriting (marked as null or "unreadable")
- Invalid file formats
- File size violations
- Ollama service not running / model missing
- Network failures
- Langfuse connection issues (graceful degradation)

## 📊 Local Langfuse Integration

**Langfuse** is an open-source observability platform for LLM applications. This project runs Langfuse **locally** using Docker Compose.

### Features
- Complete trace of AI operations
- Performance metrics and analytics
- Cost tracking
- Error monitoring
- Beautiful analytics dashboard
- **100% local** - all data stays on your machine

### Accessing Langfuse

1. **Start services**: `docker-compose up -d`
2. **Open dashboard**: http://localhost:3001
3. **View traces**: Upload an image through the frontend, then check Langfuse for traces

### Langfuse Dashboard Features

- **Traces**: See every API call with timing and token usage
- **Sessions**: Group related operations together
- **Users**: Track usage by user (if implemented)
- **Scores**: Evaluate model performance
- **Datasets**: Create test datasets for evaluation

### Troubleshooting Langfuse

**Langfuse UI not loading:**
```bash
# Check if services are running
docker-compose ps

# View Langfuse logs
docker-compose logs langfuse-server

# Restart Langfuse
docker-compose restart langfuse-server
```

**Backend not connecting to Langfuse:**
- Verify `LANGFUSE_HOST=http://langfuse-server:3000` in `backend/.env`
- Ensure API keys are correctly set
- Check backend logs: `docker-compose logs backend`

## 🔧 Configuration

### Backend Port
Default: 8000
Change in `backend/main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=YOUR_PORT)
```

### Frontend Port
Default: 5000
Change in `frontend/vite.config.js`:
```javascript
server: {
  port: YOUR_PORT
}
```

### Accuracy Optimization Settings

The following environment variables can be set to improve extraction accuracy:

```env
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434          # Ollama server URL
OLLAMA_MODEL=llava                          # Vision model to use (llava, llava:34b, bakllava, etc.)
OLLAMA_TIMEOUT_SECONDS=120                  # Request timeout (default: 120)
OLLAMA_TEMPERATURE=0.1                       # Lower = more deterministic (default: 0.1)
OLLAMA_NUM_PREDICT=2048                      # Max tokens in response (default: 2048)

# Accuracy Features
ENABLE_IMAGE_PREPROCESSING=true             # Enhance images before processing (default: true)
USE_CONSENSUS_MODE=true                      # Run twice and merge for better accuracy (default: true)
```

**Accuracy Tips:**
1. **Use a larger model**: `ollama pull llava:34b` for better accuracy (requires more VRAM)
2. **Enable consensus mode**: Runs extraction twice and merges results (slower but more accurate)
3. **Image preprocessing**: Automatically enhances contrast, sharpness, and resizes small images
4. **Lower temperature**: Set `OLLAMA_TEMPERATURE=0.1` for more deterministic output
5. **Higher resolution images**: Upload images at least 512px on the longest side for best results

## 🎯 Key Principles

1. **No Hallucinations**: Only extracts visible information
2. **Dynamic Schema**: Adapts to any handwritten form
3. **Generalizable**: Works with any handwriting style
4. **Observable**: Full tracing with Langfuse
5. **User-Friendly**: Simple, beautiful interface

## 🚨 Common Issues

### "Groq API key not configured" error
- **Solution**: Create a `backend/.env` file with your Groq API key
- Get your API key from: https://console.groq.com/keys
- Add this line to `backend/.env`: `GROQ_API_KEY=your_actual_api_key_here`
- Restart the backend server after adding the key

### Agent not initialized
- Verify the Ollama daemon is running (`ollama serve`) if using local models
- Pull the configured model (default `ollama pull bakllava`)
- Restart the backend server after Ollama is ready

### CORS errors
- Ensure backend is running on port 8000
- Check CORS configuration in `main.py`

### Langfuse errors
- Ensure Langfuse services are running: `docker-compose ps`
- Verify API keys are set in `backend/.env`
- Check Langfuse is healthy: `docker-compose logs langfuse-server`
- Langfuse is optional - the app works without it

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using Ollama (llava), Langfuse, and FastAPI**
