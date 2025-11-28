# ⚠️ IMPORTANT: Configuration for Existing Langfuse

Since you're using Docker Compose with an **existing Langfuse instance** running on your host machine, your `backend/.env` file should use:

```env
# Langfuse Configuration (Existing Instance on Host)
LANGFUSE_PUBLIC_KEY=pk-lf-your-public-key-here
LANGFUSE_SECRET_KEY=sk-lf-your-secret-key-here
LANGFUSE_HOST=http://localhost:3000
```

## Why `localhost:3000`?

When the backend runs in Docker, the `docker-compose.yml` automatically overrides `LANGFUSE_HOST` to use `host.docker.internal:3000`, which allows the container to access your host machine's Langfuse instance.

So you can keep `localhost:3000` in your `.env` file, and it will work both:
- ✅ When running backend manually (outside Docker)
- ✅ When running backend in Docker (via docker-compose)

## Quick Setup Steps

1. **Get API Keys from Langfuse**:
   - Open http://localhost:3001
   - Login → Settings → API Keys → Create new keys
   - Copy both keys

2. **Update `backend/.env`**:
   ```env
   GROQ_API_KEY=your_groq_api_key
   LANGFUSE_PUBLIC_KEY=pk-lf-xxxxxxxx
   LANGFUSE_SECRET_KEY=sk-lf-xxxxxxxx
   LANGFUSE_HOST=http://localhost:3000
   ```

3. **Start services**:
   ```bash
   docker-compose up --build
   ```

4. **Verify**:
   - Backend should show: `[OK] Langfuse initialized successfully`
   - Upload an image at http://localhost:3000
   - Check traces at http://localhost:3001

## Troubleshooting

If backend can't connect to Langfuse:

1. **Verify Langfuse is running**:
   ```bash
   curl http://localhost:3000/api/public/health
   ```
   Should return: `{"status":"OK"}`

2. **Check backend logs**:
   ```bash
   docker-compose logs backend | findstr Langfuse
   ```

3. **Verify API keys** are correct in `backend/.env`

---

**Note**: The docker-compose.yml has been updated to work with your existing Langfuse instance. It no longer includes PostgreSQL or Langfuse services.
