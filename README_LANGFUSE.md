# LangFuse Integration Guide

This project now includes a local LangFuse integration running via Docker.

## Services Overview

Your Docker setup now includes:
- **Backend** (Port 9000): Your FastAPI service with LangChain integration
- **Frontend** (Port 3000): Your React application
- **LangFuse Server** (Port 3001): LangFuse UI and API for tracing
- **LangFuse DB**: PostgreSQL database for LangFuse

## Quick Start

### 1. Start All Services

```bash
docker-compose up -d
```

This will start all services in the background.

### 2. Configure LangFuse

1. Open your browser and go to [http://localhost:3001](http://localhost:3001).
2. Create a new account (since this is a local instance, you can use any email/password).
3. Create a new **Project**.
4. Go to **Settings** → **API Keys**.
5. Create a new pair of API keys (Public Key and Secret Key).

### 3. Connect Backend to LangFuse

1. Open `backend/.env` file.
2. Add or update the following lines with the keys you just generated:

```env
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
```

> **Note:** `LANGFUSE_HOST` is already configured in `docker-compose.yml` to point to the internal docker network (`http://langfuse-server:3000`). You don't need to add this to your `.env` file.

### 4. Restart Backend

After updating the `.env` file, restart the backend service to pick up the changes:

```bash
docker-compose restart backend
```

## Verify Integration

1. Upload a document via the frontend ([http://localhost:3000](http://localhost:3000)).
2. Check the LangFuse dashboard ([http://localhost:3001](http://localhost:3001)) to see the new trace appearing under your project.

## Development Mode

If you want to run the frontend in development mode with hot-reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Troubleshooting

### Port Conflicts

If you get port conflict errors:
- Make sure no other services are using ports 3000, 3001, or 9000
- Stop any standalone LangFuse instances running in other directories

### Check Service Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f langfuse-server
```

### Stop All Services

```bash
docker-compose down
```
