@echo off
echo Adding changes...
git add .

echo Committing fixes...
git commit -m "Fix OCR issues: PDF parsing, Word doc errors, and image timeout handling"

echo Pushing to GitHub...
git push

echo.
echo ========================================
echo Fixes deployed to GitHub!
echo Vercel will automatically redeploy.
echo ========================================
echo.
echo Changes:
echo - Fixed PDF bad XRef entry errors
echo - Fixed Word doc JSON parsing errors  
echo - Fixed image OCR timeout issues
echo - Added better error messages
echo - Added progress indicators
echo ========================================
pause

