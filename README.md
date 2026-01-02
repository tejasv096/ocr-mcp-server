# OCR MCP Server

A Model Context Protocol (MCP) server with OCR capabilities that extracts text from PDF, Word documents, and images. Includes a professional web interface built with Next.js and deployable on Vercel.

## Features

- 📄 **PDF Text Extraction** - Extract text from PDF documents
- 📝 **Word Document Processing** - Support for .docx and .doc files
- 🖼️ **Image OCR** - Extract text from images (JPG, PNG, GIF, BMP, TIFF)
- 🌐 **Web Interface** - Clean, professional UI for file uploads
- 🚀 **Vercel Ready** - Optimized for serverless deployment
- 🔧 **MCP Compatible** - Standalone MCP server for integration with AI tools

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **OCR Engine**: Tesseract.js
- **PDF Processing**: pdf-parse
- **Word Processing**: mammoth
- **MCP SDK**: @modelcontextprotocol/sdk

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ocr-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Web Interface

1. Navigate to the homepage
2. Click "Upload a file" or drag and drop a file
3. Supported formats: PDF, DOCX, DOC, JPG, PNG, GIF, BMP, TIFF
4. Click "Extract Text" to process the file
5. View and copy the extracted text

### MCP Server

The standalone MCP server can be used with AI tools that support the Model Context Protocol:

```bash
node mcp-server/index.js
```

The server provides an `extract_text` tool that accepts:
- `file_path`: Path to the file
- `file_type`: Type of file (pdf, docx, or image)

## Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Configuration

The project includes `vercel.json` with optimized settings:
- API routes have a 60-second timeout for processing large files
- Next.js build configuration is pre-configured

## API Endpoints

### POST /api/ocr

Upload a file and extract text.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: File upload with key "file"

**Response:**
```json
{
  "text": "Extracted text content..."
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## File Size Limits

- Maximum file size: 10MB
- Vercel serverless function timeout: 60 seconds

## Development

### Project Structure

```
ocr-mcp-server/
├── mcp-server/          # Standalone MCP server
│   └── index.js
├── pages/               # Next.js pages
│   ├── api/
│   │   └── ocr.ts      # OCR API endpoint
│   ├── _app.tsx
│   └── index.tsx       # Main UI
├── styles/
│   └── globals.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── vercel.json
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### Canvas Module Error

If you encounter canvas-related errors, the `next.config.js` already includes the fix to externalize the canvas module on the server side.

### Large File Processing

For files larger than 10MB, you may need to:
1. Increase the `maxFileSize` in `pages/api/ocr.ts`
2. Adjust Vercel function timeout limits (requires paid plan)

### OCR Accuracy

For better OCR accuracy:
- Use high-resolution images
- Ensure good contrast and lighting
- Use clear, readable fonts
- Avoid skewed or rotated text

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

