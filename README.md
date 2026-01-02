# OCR MCP Server (Python)

A Model Context Protocol (MCP) server that provides OCR (Optical Character Recognition) capabilities for extracting text from PDF files, Word documents, and images using Python.

## Features

- **PDF Text Extraction**: Extract text from PDF documents using PyPDF2 with OCR fallback for scanned PDFs
- **Word Document Processing**: Extract text from .docx files using python-docx
- **Image OCR**: Extract text from images using pytesseract (requires Tesseract installation)
- **MCP Server**: Standalone Python server compatible with AI tools supporting the Model Context Protocol

## Tech Stack

- **Python 3.14+**
- **OCR Engine**: pytesseract + Pillow
- **PDF Processing**: PyPDF2 + pdf2image
- **Word Processing**: python-docx
- **MCP SDK**: mcp

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Tesseract OCR (Optional - for image OCR)

**Windows:**
- Download from: https://github.com/UB-Mannheim/tesseract/wiki
- Install to `C:\Program Files\Tesseract-OCR\`
- Add to PATH or the script will auto-detect it

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

**macOS:**
```bash
brew install tesseract
```

## Usage

### Running the MCP Server

```bash
python server.py
```

The server will run on stdio and can be integrated with AI tools that support the Model Context Protocol.

### Testing

Run the test script to verify all functionality:

```bash
python test_ocr.py
```

This will test PDF, Word, and Image extraction with the sample files in `sample_documents/`.

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

## Test Results

Tested with sample files:

| File Type | Status | Method |
|-----------|--------|--------|
| PDF (invoice_sample 2.pdf) | ✅ PASS | Text extraction (291 chars) |
| PDF (purchase_order_sample 2.pdf) | ✅ PASS | Text extraction (282 chars) |
| Word (test_document.docx) | ✅ PASS | python-docx (1153 chars) |
| Image (test_ocr_image.png) | ⚠️ Requires Tesseract | pytesseract |

## Configuration

The server automatically detects Tesseract installation in common locations:
- Windows: `C:\Program Files\Tesseract-OCR\tesseract.exe`
- Windows (x86): `C:\Program Files (x86)\Tesseract-OCR\tesseract.exe`
- Linux: `/usr/bin/tesseract`
- macOS: `/usr/local/bin/tesseract`

## Error Handling

- **PDF Extraction**: Falls back to OCR if text extraction fails
- **Image OCR**: Provides clear error message if Tesseract is not installed
- **Word Documents**: Handles .docx format (not legacy .doc)

## Development

### Project Structure

```
ocr-mcp-server/
├── server.py              # Main MCP server
├── test_ocr.py           # Test script
├── requirements.txt      # Python dependencies
├── sample_documents/     # Test files
│   ├── invoice_sample 2.pdf
│   ├── purchase_order_sample 2.pdf
│   ├── test_document.docx
│   └── test_ocr_image.png
└── README.md
```

### Dependencies

- `pytesseract==0.3.13` - Python wrapper for Tesseract OCR
- `Pillow>=11.0.0` - Image processing
- `PyPDF2==3.0.1` - PDF text extraction
- `pdf2image==1.17.0` - Convert PDF to images for OCR
- `python-docx==1.1.2` - Word document processing
- `mcp==1.1.2` - Model Context Protocol SDK

## License

MIT

## Author

OCR MCP Server - Python Implementation

