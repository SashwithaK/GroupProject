# 🚀 Quick Start Guide - Local Langfuse Setup

This guide will help you get the AI Handwritten Text Extractor running with **local Langfuse observability** in under 5 minutes.

## Prerequisites

- Docker and Docker Compose installed
- Groq API key from https://console.groq.com/keys

## Step-by-Step Setup

### 1. Configure Environment

```bash
# Navigate to project directory
cd Ai-Handwritten-text-extractor-main

# Copy environment template
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your Groq API key:
```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 2. Start All Services

```bash
# Start PostgreSQL, Langfuse, Backend, and Frontend
docker-compose up -d

# Wait for services to be ready (about 30-60 seconds)
docker-compose ps
```

You should see all services as "Up" and "healthy".

### 3. Configure Langfuse (First Time Only)

1. **Open Langfuse UI**: http://localhost:3001
2. **Create Account**:
   - Click "Sign Up"
   - Enter email and password (stored locally)
   - Complete registration

3. **Generate API Keys**:
   - Go to **Settings** → **API Keys**
   - Click **Create new API keys**
   - Give it a name (e.g., "Backend")
   - Copy both keys:
     - Public Key (starts with `pk-lf-`)
     - Secret Key (starts with `sk-lf-`)

4. **Update Backend Configuration**:
   
   Edit `backend/.env` and update:
   ```env
   LANGFUSE_PUBLIC_KEY=pk-lf-xxxxxxxx
   LANGFUSE_SECRET_KEY=sk-lf-xxxxxxxx
   LANGFUSE_HOST=http://langfuse-server:3000
   ```

5. **Restart Backend**:
   ```bash
   docker-compose restart backend
   ```

### 4. Test the Application

1. **Open Frontend**: http://localhost:3000
2. **Upload Image**: Drag and drop a handwritten image
3. **Extract Text**: Click "Extract Text"
4. **View Trace**: Go to Langfuse UI (http://localhost:3001) and see the trace!

## Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application UI |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Interactive API documentation |
| Langfuse Dashboard | http://localhost:3001 | Observability and traces |

## Common Commands

```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f langfuse-server

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v
```

## Troubleshooting

### Services won't start
```bash
# Check what's running
docker-compose ps

# View detailed logs
docker-compose logs
```

### Langfuse UI not accessible
```bash
# Check if Langfuse is healthy
docker-compose ps langfuse-server

# View Langfuse logs
docker-compose logs langfuse-server

# Restart Langfuse
docker-compose restart langfuse-server
```

### Backend can't connect to Langfuse
- Ensure `LANGFUSE_HOST=http://langfuse-server:3000` (not localhost)
- Verify API keys are correct
- Check backend logs: `docker-compose logs backend`

## What's Next?

- Explore the Langfuse dashboard to see traces, performance metrics, and analytics
- Try uploading different handwritten images
- Check the "Sessions" tab in Langfuse to group related operations
- Use the "Datasets" feature to create test cases

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- View service logs: `docker-compose logs -f`
- Ensure all services are healthy: `docker-compose ps`

---

**Built with ❤️ using Ollama, Langfuse (Local), and FastAPI**
