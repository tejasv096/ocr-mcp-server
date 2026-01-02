@echo off
echo Adding GitHub remote...
git remote add origin https://github.com/tejasv096/ocr-mcp-server.git

echo Renaming branch to main...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo Done! Check https://github.com/tejasv096/ocr-mcp-server
pause

