@echo off
echo Adding all changes...
git add .

echo Committing...
git commit -m "Add TypeScript type definitions for build"

echo Pushing to GitHub...
git push

echo Done! Vercel will automatically redeploy.
pause

