# Docker + Vercel Setup Guide

## Architecture

```
┌─────────────────┐         ┌──────────────────────┐
│  Vercel         │         │  Docker Container    │
│  (Frontend)     │────────▶│  (OCR API Server)    │
│  Next.js        │  HTTP   │  Flask + Tesseract   │
└─────────────────┘         └──────────────────────┘
```

**Frontend (Vercel)**: Next.js web interface  
**Backend (Docker)**: Python Flask API with Tesseract OCR

---

## Quick Start

### 1. Start Docker Container

```bash
# Windows
docker-start.bat

# Linux/Mac
docker-compose up --build -d
```

### 2. Test Docker API

```bash
python test-docker-api.py
```

### 3. Run Frontend Locally

```bash
# Create .env.local file
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit: http://localhost:3000

---

## Docker Container

### What's Inside

- **Python 3.11**
- **Tesseract OCR** (with English language pack)
- **Poppler** (for PDF to image conversion)
- **Flask API** (server_api.py)
- **All Python dependencies**

### Endpoints

- `GET /health` - Health check
- `POST /api/ocr` - OCR extraction (accepts file upload)

### Commands

```bash
# Start container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down

# Rebuild
docker-compose up --build -d

# Test API
curl http://localhost:8000/health
```

---

## Deployment

### Option 1: Deploy Docker to Cloud

**Recommended platforms:**
- **Railway.app** (easiest, free tier)
- **Render.com** (free tier available)
- **DigitalOcean App Platform**
- **AWS ECS / Fargate**
- **Google Cloud Run**

#### Railway.app Deployment (Recommended)

1. Go to https://railway.app
2. Sign up / Login
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Dockerfile
6. Click "Deploy"
7. Get your public URL (e.g., `https://your-app.railway.app`)

#### Render.com Deployment

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select "Docker" as environment
5. Click "Create Web Service"
6. Get your public URL

### Option 2: Deploy Frontend to Vercel

1. Update `.env.local` with your Docker server URL:
   ```
   NEXT_PUBLIC_API_URL=https://your-docker-server.railway.app
   ```

2. Deploy to Vercel:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel

   # Add environment variable in Vercel dashboard
   # NEXT_PUBLIC_API_URL = https://your-docker-server.railway.app
   ```

---

## Testing

### Test Docker API Locally

```bash
python test-docker-api.py
```

Expected output:
```
======================================================================
TESTING DOCKER OCR API
======================================================================

Testing health endpoint...
Status: 200
Response: {'status': 'healthy', 'tesseract': 'available'}

Testing OCR with: invoice_sample 2.pdf
Status: 200
Success! Extracted 291 characters
Preview: Invoice   Invoice Number: INV-2025-321...

Testing OCR with: test_ocr_image.png
Status: 200
Success! Extracted 226 characters
Preview: This is a test image...
```

### Test with curl

```bash
# Health check
curl http://localhost:8000/health

# OCR test
curl -X POST -F "file=@sample_documents/invoice_sample 2.pdf" \
  http://localhost:8000/api/ocr
```

---

## File Structure

```
ocr-mcp-server/
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker compose config
├── server_api.py          # Flask API server
├── requirements.txt       # Python dependencies
├── docker-start.bat       # Start Docker (Windows)
├── docker-stop.bat        # Stop Docker (Windows)
├── test-docker-api.py     # Test script
├── .dockerignore          # Docker ignore file
├── .env.local.example     # Environment variables example
├── pages/                 # Next.js frontend
│   └── index.tsx         # Main page (updated for Docker API)
└── sample_documents/      # Test files
```

---

## Environment Variables

### Frontend (.env.local)

```bash
# For local development with Docker
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production with deployed Docker
NEXT_PUBLIC_API_URL=https://your-docker-server.railway.app
```

### Docker Container

```bash
PORT=8000  # API port (default: 8000)
```

---

## Troubleshooting

### Docker container won't start

```bash
# Check Docker is running
docker --version

# View logs
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose up --build
```

### API returns 500 error

```bash
# Check container logs
docker-compose logs -f

# Test health endpoint
curl http://localhost:8000/health
```

### Frontend can't connect to API

1. Check NEXT_PUBLIC_API_URL in .env.local
2. Make sure Docker container is running
3. Test API directly: `curl http://localhost:8000/health`
4. Check CORS is enabled in server_api.py

---

## Production Checklist

- [ ] Docker container deployed to cloud (Railway/Render)
- [ ] Docker API URL is public and accessible
- [ ] Frontend deployed to Vercel
- [ ] NEXT_PUBLIC_API_URL set in Vercel environment variables
- [ ] Test all file types (PDF, Word, Images)
- [ ] Monitor Docker container logs
- [ ] Set up health check monitoring

---

## Cost Estimate

**Free Tier:**
- Railway.app: 500 hours/month free
- Render.com: 750 hours/month free
- Vercel: Unlimited for personal projects

**Paid (if needed):**
- Railway.app: ~$5-10/month
- Render.com: ~$7/month
- DigitalOcean: ~$5/month

---

## Next Steps

1. ✅ Test Docker locally
2. ✅ Deploy Docker to Railway/Render
3. ✅ Update frontend with Docker URL
4. ✅ Deploy frontend to Vercel
5. ✅ Test production deployment

