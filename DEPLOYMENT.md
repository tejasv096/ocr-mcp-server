# Deployment Guide

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect Next.js and configure settings
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? Press enter or provide a name
   - Directory? Press enter (current directory)
   - Override settings? **N**

5. For production deployment:
```bash
vercel --prod
```

## Environment Variables

No environment variables are required for basic functionality. The application works out of the box.

## Important Notes

### File Size Limits

- **Free Plan**: 10MB file upload limit (configured in code)
- **Vercel Function Timeout**: 60 seconds (configured in vercel.json)
- For larger files or longer processing times, upgrade to Vercel Pro

### Supported File Types

- **PDF**: .pdf
- **Word**: .docx, .doc
- **Images**: .jpg, .jpeg, .png, .gif, .bmp, .tiff, .webp

### Performance Optimization

1. **Image OCR** can take 10-30 seconds depending on image size and complexity
2. **PDF Processing** is usually fast (1-5 seconds)
3. **Word Documents** process quickly (1-3 seconds)

### Troubleshooting Deployment

#### Build Errors

If you encounter build errors:

1. Clear cache and rebuild:
```bash
rm -rf .next node_modules
npm install
npm run build
```

2. Check Node.js version (should be 18+):
```bash
node --version
```

#### Canvas Module Error

The `next.config.js` already handles canvas externalization. If you still see errors, ensure the config is properly set.

#### Function Timeout

If processing large files times out:
1. Reduce file size limit in `pages/api/ocr.ts`
2. Upgrade to Vercel Pro for longer timeouts
3. Consider implementing client-side compression

## Post-Deployment

After deployment, Vercel will provide:
- **Production URL**: Your live application URL
- **Deployment Dashboard**: Monitor performance and logs
- **Automatic HTTPS**: SSL certificate included

### Testing Your Deployment

1. Visit your deployment URL
2. Upload a test file (start with a small PDF or image)
3. Verify text extraction works correctly
4. Check Vercel logs for any errors

## Custom Domain

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Wait for DNS propagation (can take up to 48 hours)

## Monitoring

Monitor your application:
- **Vercel Dashboard**: Real-time logs and analytics
- **Function Logs**: Check API route execution
- **Error Tracking**: Review failed requests

## Scaling

The application automatically scales with Vercel's serverless infrastructure:
- Each request runs in an isolated function
- Automatic scaling based on traffic
- No server management required

## Cost Considerations

**Vercel Free Tier includes:**
- 100GB bandwidth per month
- Unlimited deployments
- 10 second function timeout
- Automatic SSL

**Upgrade to Pro if you need:**
- Longer function timeouts (up to 300s)
- More bandwidth
- Team collaboration features
- Advanced analytics

