# Deployment Guide

## ✅ Current Status

- **Docker Container**: Running locally on port 8000
- **All Tests**: 100% passing (PDF, Word, Images)
- **Frontend**: Configured to use Docker API
- **Repository**: Clean and ready for deployment

---

## 🚀 Deploy Backend (Docker)

### Option 1: Render.com - 🆓 FREE (Recommended)

**Cost**: $0/month - Completely FREE!

1. **Sign up**: https://render.com
2. **New** → "Web Service"
3. **Connect GitHub**: Select `tejasv096/ocr-mcp-server`
4. **Settings**:
   - Name: `ocr-mcp-server`
   - Environment: Docker
   - Instance Type: **Free**
   - Health Check Path: `/health`
5. **Deploy**: Click "Create Web Service"
6. **Get URL**: Copy your app URL (e.g., `https://ocr-mcp-server.onrender.com`)

**Limitations**:
- Sleeps after 15 min inactivity (30-60s cold start)
- 512 MB RAM, 0.1 CPU (slower but works)
- Perfect for sharing and demos!

**See detailed guide**: [RENDER-DEPLOYMENT.md](RENDER-DEPLOYMENT.md)

### Option 2: Railway.app - $5/month (Faster, Always On)

1. **Sign up**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select**: `tejasv096/ocr-mcp-server`
4. **Auto-detect**: Railway finds Dockerfile automatically
5. **Deploy**: Click deploy
6. **Get URL**: Copy your app URL (e.g., `https://ocr-mcp-server-production.up.railway.app`)

**Benefits**: No cold starts, faster, always on

---

## 🌐 Deploy Frontend (Vercel)

### Update Environment Variable

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project: `ocr-mcp-server`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Railway/Render URL (e.g., `https://ocr-mcp-server-production.up.railway.app`)
   - **Environment**: Production, Preview, Development
5. **Save**
6. **Redeploy**: Go to Deployments → Click "..." → Redeploy

### Verify Deployment

1. Visit your Vercel URL: `https://ocr-mcp-server.vercel.app`
2. Upload a test PDF or image
3. Verify text extraction works

---

## 🧪 Testing

### Test Local Docker

```bash
# Check container status
docker-compose ps

# Run tests
python test-docker-api.py

# Test health endpoint
curl http://localhost:8000/health

# Test OCR
curl -X POST http://localhost:8000/api/ocr \
  -F "file=@sample_documents/test_ocr_image.png"
```

### Test Production

```bash
# Test health
curl https://your-app.railway.app/health

# Test OCR
curl -X POST https://your-app.railway.app/api/ocr \
  -F "file=@sample_documents/test.pdf"
```

---

## 📊 Expected Results

After deployment, you should see:

**Backend (Railway/Render)**:
- Health endpoint: `{"status": "healthy", "tesseract": "available"}`
- OCR endpoint: Returns extracted text from uploaded files

**Frontend (Vercel)**:
- File upload working
- Progress indicator showing
- Extracted text displayed
- All file types working (PDF, Word, Images)

---

## 🔧 Troubleshooting

### Frontend shows "Failed to fetch"

**Cause**: CORS or wrong API URL

**Fix**:
1. Check `NEXT_PUBLIC_API_URL` in Vercel settings
2. Ensure URL doesn't have trailing slash
3. Redeploy frontend after changing env var

### Backend shows "Unhealthy"

**Cause**: Container not starting properly

**Fix**:
1. Check Railway/Render logs
2. Verify Dockerfile builds successfully
3. Check port 8000 is exposed

### Images not working

**Cause**: Tesseract not installed

**Fix**:
- Docker should have Tesseract pre-installed
- Check logs: `docker-compose logs -f`
- Verify health endpoint shows `"tesseract": "available"`

---

## 💰 Cost Estimate

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| **Render.com** | Free | **$0** | Sleeps after 15min, 512MB RAM |
| **Render.com** | Starter | $7/month | Always on, faster |
| **Railway.app** | Hobby | $5/month | 500 hours, fast, reliable |
| **Vercel** | Hobby | **Free** | Frontend hosting |

**Recommended for FREE**: Render.com (Free) + Vercel (Free) = **$0/month total** 🎉

**Recommended for Production**: Railway.app ($5/month) + Vercel (Free) = **$5/month total**

---

## 📝 Summary

1. ✅ **Clean up complete** - Removed all Vercel API files
2. ✅ **Frontend updated** - Now uses Docker API only
3. ✅ **Docker tested** - All 4 file types passing
4. ✅ **Ready to deploy** - Push to Railway/Render
5. ✅ **Environment setup** - Add URL to Vercel

**Next Action**: Deploy Docker container to Railway.app and update Vercel environment variable.

