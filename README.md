# OCR MCP Server (Docker + Python)

A Docker-based OCR server with Flask API and Next.js web interface for extracting text from PDFs, images, and Word documents.

## Features

- ✅ **PDF Text Extraction**: PyPDF2 with OCR fallback for scanned PDFs
- ✅ **Image OCR**: Tesseract OCR 5.5 for images (PNG, JPG, etc.)
- ✅ **Word Documents**: python-docx for .docx files
- ✅ **Web Interface**: Next.js frontend for easy file upload
- ✅ **MCP Server**: Python server for AI assistant integration
- ✅ **Docker**: Fully containerized with all dependencies

## Tech Stack

- **Backend**: Python 3.11 + Flask
- **OCR Engine**: Tesseract OCR 5.5 + pytesseract
- **PDF Processing**: PyPDF2 + pdf2image + Poppler
- **Image Processing**: Pillow
- **Word Processing**: python-docx
- **Frontend**: Next.js 14 + TypeScript
- **Deployment**: Docker (Backend), Vercel (Frontend)

## Quick Start

### 1. Start Docker Container

```bash
# Start the OCR API server
docker-compose up -d

# Check if running
docker-compose ps
```

The Docker container includes:
- Python 3.11
- Tesseract OCR 5.5
- All Python dependencies
- Flask API server on port 8000

### 2. Start Frontend (Optional)

```bash
# Install Node.js dependencies
npm install

# Start Next.js dev server
npm run dev
```

Frontend will run on http://localhost:3000

### 3. Test the API

```bash
# Run all tests
python test-docker-api.py
```

## Usage

### Docker Commands

```bash
# Start container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down

# Rebuild after changes
docker-compose up --build -d
```

### API Endpoints

**Health Check:**
```bash
curl http://localhost:8000/health
```

**OCR Extraction:**
```bash
curl -X POST http://localhost:8000/api/ocr \
  -F "file=@sample_documents/test.pdf"
```

### MCP Server (Local)

For AI assistant integration:

```bash
python server.py
```

## MCP Tool

The server provides one tool:

### `extract_text`

Extract text from PDF, Word documents, or images.

**Parameters:**
- `file_path` (string): Path to the file to extract text from
- `file_type` (string): Type of file - "pdf", "docx", or "image"

**Example:**
```json
{
  "file_path": "/path/to/document.pdf",
  "file_type": "pdf"
}
```

## Supported File Types

- **PDF**: .pdf (text-based and scanned with OCR fallback)
- **Word**: .docx
- **Images**: .jpg, .jpeg, .png, .gif, .bmp, .tiff (requires Tesseract)

## Test Results (Docker)

All tests passing with Docker container:

| File Type | Status | Characters | Method |
|-----------|--------|-----------|--------|
| PDF (invoice_sample 2.pdf) | ✅ **PASS** | 289 chars | PyPDF2 |
| PDF (purchase_order_sample 2.pdf) | ✅ **PASS** | 280 chars | PyPDF2 |
| Word (test_document.docx) | ✅ **PASS** | 1153 chars | python-docx |
| Image (test_ocr_image.png) | ✅ **PASS** | 222 chars | Tesseract OCR |

**Success Rate: 100% (4/4)** 🎉

## Deployment

### Deploy to Render.com - 🆓 FREE (Recommended)

1. Sign up at https://render.com
2. New → Web Service → Connect GitHub
3. Select repository: `tejasv096/ocr-mcp-server`
4. Settings:
   - Environment: Docker
   - Instance Type: **Free**
   - Health Check Path: `/health`
5. Deploy and get public URL (e.g., `https://ocr-mcp-server.onrender.com`)
6. Update Vercel environment variable:
   - `NEXT_PUBLIC_API_URL=https://ocr-mcp-server.onrender.com`

**Cost**: $0/month (100% FREE!)

**Limitations**: Sleeps after 15 min (30-60s cold start on first request)

**Detailed guide**: See [RENDER-DEPLOYMENT.md](RENDER-DEPLOYMENT.md)

### Deploy to Railway.app (Faster, $5/month)

1. Sign up at https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Dockerfile
5. Get public URL (e.g., `https://your-app.railway.app`)
6. Update Vercel environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-app.railway.app`

**Cost**: ~$5/month (no cold starts, always on)
4. Render auto-detects Dockerfile
5. Get public URL

**Cost**: Free tier available

## Environment Variables

Create `.env.local` for frontend:

```bash
# Local Docker
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production (Railway/Render)
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

Add to Vercel dashboard for production deployment.

## Project Structure

```
ocr-mcp-server/
├── Dockerfile                 # Docker image definition
├── docker-compose.yml         # Docker orchestration
├── server_api.py              # Flask API server (Docker)
├── server.py                  # MCP server (local use)
├── test-docker-api.py         # Docker API tests
├── test_ocr.py                # Local MCP tests
├── requirements.txt           # Python dependencies
├── pages/                     # Next.js pages
│   └── index.tsx              # Web interface
├── sample_documents/          # Test files
│   ├── invoice_sample 2.pdf
│   ├── purchase_order_sample 2.pdf
│   ├── test_document.docx
│   └── test_ocr_image.png
├── .env.local.example         # Environment template
├── .dockerignore              # Docker exclusions
└── README.md
```

## Dependencies

**Python (Docker):**
- `pytesseract==0.3.13` - Tesseract OCR wrapper
- `Pillow>=11.0.0` - Image processing
- `PyPDF2==3.0.1` - PDF text extraction
- `pdf2image==1.17.0` - PDF to image conversion
- `python-docx==1.1.2` - Word document processing
- `flask==3.0.0` - Web API framework
- `flask-cors==4.0.0` - CORS support
- `mcp==1.1.2` - Model Context Protocol SDK

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS

## Supported File Types

- **PDF**: .pdf (text-based and scanned with OCR)
- **Word**: .docx
- **Images**: .jpg, .jpeg, .png, .gif, .bmp, .tiff

## License

MIT

