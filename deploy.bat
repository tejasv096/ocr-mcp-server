@echo off
echo Deploying Python OCR to Vercel...
git add .
git commit -m "Add Python API for Vercel - Fix PDF and image OCR issues"
git push
echo.
echo Deployment pushed to GitHub!
echo Check Vercel dashboard for deployment status.
pause

