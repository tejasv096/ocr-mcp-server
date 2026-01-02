# 🆓 FREE Deployment Guide - Render.com

## ✅ 100% Free Solution

Deploy your OCR server to **Render.com** (FREE tier) and share `https://ocr-mcp-server.vercel.app` with anyone!

**Cost**: $0/month (completely free!)

---

## 🚀 Step-by-Step Deployment

### Step 1: Sign Up for Render.com

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 2: Create New Web Service

1. Click "New +" → "Web Service"
2. Click "Connect a repository"
3. Find and select: `tejasv096/ocr-mcp-server`
4. Click "Connect"

### Step 3: Configure Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `ocr-mcp-server` (or any name you like)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Environment**: `Docker`
- **Docker Command**: Leave empty (uses Dockerfile CMD)

**Instance Type:**
- Select: **Free** (0.1 CPU, 512 MB RAM)

**Advanced Settings:**
- **Auto-Deploy**: Yes (enabled by default)
- **Health Check Path**: `/health`

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Render will:
   - Clone your repository
   - Build Docker image
   - Deploy container
   - Assign a public URL

### Step 5: Get Your URL

After deployment completes:
1. Copy your Render URL (e.g., `https://ocr-mcp-server.onrender.com`)
2. Test it: `https://ocr-mcp-server.onrender.com/health`
3. Should return: `{"status": "healthy", "tesseract": "available"}`

### Step 6: Update Vercel Environment Variable

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select project: `ocr-mcp-server`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://ocr-mcp-server.onrender.com` (your Render URL)
   - **Environment**: Production, Preview, Development
5. Click "Save"

### Step 7: Redeploy Vercel

1. Go to **Deployments** tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

### Step 8: Test Your App

1. Visit: `https://ocr-mcp-server.vercel.app`
2. Upload test files:
   - ✅ PDF file
   - ✅ Word document
   - ✅ Image (PNG/JPG)
3. Verify text extraction works

**Done!** Share `https://ocr-mcp-server.vercel.app` with anyone! 🎉

---

## ⚠️ Free Tier Limitations

### Render.com Free Tier:
- **Sleeps after 15 minutes** of inactivity
- **First request takes 30-60 seconds** to wake up (cold start)
- **750 hours/month** of runtime (enough for moderate use)
- **512 MB RAM** (sufficient for OCR)
- **0.1 CPU** (slower but works)

### How to Handle Cold Starts:

**Option 1: Accept the delay**
- First user waits 30-60 seconds
- Subsequent users get instant response
- Good for personal/demo projects

**Option 2: Keep-alive service (Free)**
- Use a free cron service to ping your app every 14 minutes
- Keeps it awake during active hours
- Services: cron-job.org, UptimeRobot (free tier)

**Option 3: Upgrade to paid ($7/month)**
- Always on, no cold starts
- Faster CPU and more RAM
- Only if you need 24/7 availability

---

## 🔧 Troubleshooting

### Build Failed

**Check Render logs:**
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for errors in build process

**Common issues:**
- Dockerfile syntax error → Check Dockerfile
- Out of memory → Reduce dependencies
- Timeout → Build takes too long (upgrade to paid)

### Health Check Failing

**Fix:**
1. Go to Settings → Health Check Path
2. Set to: `/health`
3. Save and redeploy

### CORS Errors

**Already fixed in code!** `server_api.py` has CORS enabled:
```python
CORS(app, resources={r"/*": {"origins": "*"}})
```

### Slow Response

**Expected on free tier:**
- Cold start: 30-60 seconds (first request)
- Warm: 1-5 seconds (subsequent requests)
- OCR processing: 2-10 seconds (depending on file size)

---

## 📊 Expected Performance

| Scenario | Response Time |
|----------|--------------|
| **Cold start** (first request) | 30-60 seconds |
| **Warm** (active) | 1-5 seconds |
| **PDF extraction** | 2-5 seconds |
| **Image OCR** | 5-10 seconds |
| **Word document** | 1-3 seconds |

---

## 💡 Tips for Free Tier

1. **Add loading message**: "First request may take up to 60 seconds..."
2. **Use keep-alive**: Ping every 14 minutes during active hours
3. **Monitor usage**: Render dashboard shows hours used
4. **Optimize images**: Smaller files = faster processing
5. **Cache results**: Store extracted text to avoid re-processing

---

## 🎯 Summary

| Item | Status |
|------|--------|
| **Cost** | ✅ $0/month (FREE) |
| **Deployment** | ✅ 5-10 minutes |
| **Public URL** | ✅ `https://your-app.onrender.com` |
| **Vercel integration** | ✅ Environment variable |
| **Share with others** | ✅ `https://ocr-mcp-server.vercel.app` |
| **Limitations** | ⚠️ Cold starts (30-60s) |

---

## 🚀 Next Steps

1. ✅ Deploy to Render.com (FREE)
2. ✅ Update Vercel environment variable
3. ✅ Test the app
4. ✅ Share with others!

**Your OCR app will be 100% free and publicly accessible!** 🎉

