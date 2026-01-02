@echo off
echo Adding changes...
git add .

echo Committing fix...
git commit -m "Fix vercel.json configuration"

echo Pushing to GitHub...
git push

echo Done! Your changes are pushed to GitHub.
echo Vercel will automatically redeploy.
pause

