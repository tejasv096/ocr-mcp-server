@echo off
echo Building and starting OCR Docker container...
echo.

docker-compose up --build -d

echo.
echo Docker container started!
echo.
echo API available at: http://localhost:8000
echo Health check: http://localhost:8000/health
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
pause

