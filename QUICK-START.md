# 🚀 Quick Start - FREE Deployment in 10 Minutes

## ✅ Deploy Your OCR App for FREE and Share with Anyone!

Follow these simple steps to deploy your OCR server and share `https://ocr-mcp-server.vercel.app` with the world!

**Total Cost**: $0/month (100% FREE!)

---

## 📋 Prerequisites

- GitHub account (free)
- Render.com account (free)
- Vercel account (free - you already have this)

---

## 🎯 Step-by-Step Guide

### Step 1: Deploy Backend to Render.com (5 minutes)

1. **Go to Render.com**
   - Visit: https://render.com
   - Click "Get Started for Free"
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Click "Connect a repository"
   - Find: `tejasv096/ocr-mcp-server`
   - Click "Connect"

3. **Configure Settings**
   - **Name**: `ocr-mcp-server`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Environment**: `Docker`
   - **Instance Type**: **Free** ⭐
   - **Health Check Path**: `/health`

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your URL: `https://ocr-mcp-server.onrender.com`

5. **Test Backend**
   - Visit: `https://ocr-mcp-server.onrender.com/health`
   - Should see: `{"status": "healthy", "tesseract": "available"}`
   - ✅ Backend is ready!

---

### Step 2: Update Vercel Frontend (2 minutes)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select project: `ocr-mcp-server`

2. **Add Environment Variable**
   - Go to: **Settings** → **Environment Variables**
   - Click "Add New"
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://ocr-mcp-server.onrender.com` (your Render URL)
   - **Environment**: Check all (Production, Preview, Development)
   - Click "Save"

3. **Redeploy**
   - Go to: **Deployments** tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Wait 1-2 minutes

---

### Step 3: Test Your App (1 minute)

1. **Visit Your App**
   - Go to: `https://ocr-mcp-server.vercel.app`

2. **Upload Test File**
   - Click "Upload a file"
   - Select a PDF, Word doc, or image
   - Click "Extract Text"

3. **Wait for Result**
   - First request: 30-60 seconds (server waking up)
   - You'll see: "First request may take up to 60 seconds (server waking up)."
   - Subsequent requests: 2-10 seconds

4. **Success!**
   - Text should be extracted and displayed
   - ✅ Your app is live!

---

## 🎉 Share Your App

Your OCR app is now live and FREE!

**Share this URL with anyone:**
```
https://ocr-mcp-server.vercel.app
```

**Features:**
- ✅ Extract text from PDFs
- ✅ Extract text from Word documents
- ✅ OCR for images (PNG, JPG, etc.)
- ✅ 100% free
- ✅ No login required
- ✅ Works on any device

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render.com Free Tier:**
- Server sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast (2-10 seconds)
- 750 hours/month of runtime (plenty for demos)

**User Experience:**
- First visitor of the day: 30-60 second wait
- Active users: Fast response
- Perfect for demos, portfolios, and sharing

### Tips for Best Experience

1. **Warn users**: The app shows a blue banner about cold starts
2. **Keep alive** (optional): Use cron-job.org to ping every 14 minutes
3. **Be patient**: First request is slow, then it's fast
4. **Upgrade later**: If you need 24/7, upgrade to $7/month

---

## 🔧 Troubleshooting

### "Failed to fetch" Error

**Solution:**
1. Check Render deployment status
2. Verify environment variable in Vercel
3. Make sure URL doesn't have trailing slash
4. Redeploy Vercel

### Server Not Responding

**Solution:**
1. Check Render logs: Dashboard → Logs
2. Verify health endpoint: `https://your-app.onrender.com/health`
3. Restart service: Dashboard → Manual Deploy → Deploy Latest Commit

### Slow Response

**Expected on free tier:**
- Cold start: 30-60 seconds
- Warm: 2-10 seconds
- This is normal for free tier!

---

## 📊 What You've Deployed

**Backend (Render.com):**
- Docker container with Python + Tesseract OCR
- Flask API on port 8000
- Handles PDF, Word, and image processing
- Free tier: 512 MB RAM, 0.1 CPU

**Frontend (Vercel):**
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- File upload and text display
- Free tier: Unlimited bandwidth

**Total Cost: $0/month** 🎉

---

## 🎯 Summary

| Step | Time | Status |
|------|------|--------|
| Deploy to Render.com | 5 min | ✅ |
| Update Vercel env var | 2 min | ✅ |
| Test the app | 1 min | ✅ |
| **Total** | **8 min** | **✅ DONE!** |

---

## 📚 Next Steps

1. ✅ Share your app: `https://ocr-mcp-server.vercel.app`
2. ✅ Add to portfolio/resume
3. ✅ Show to friends/colleagues
4. ✅ Use for your own OCR needs

**Optional:**
- Set up keep-alive cron job (cron-job.org)
- Upgrade to paid tier for 24/7 availability
- Customize the UI
- Add more features

---

**Congratulations! Your OCR app is live and FREE!** 🚀

For detailed deployment info, see [RENDER-DEPLOYMENT.md](RENDER-DEPLOYMENT.md)

