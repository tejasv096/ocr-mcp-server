# Quick Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git (for version control)

## Installation Steps

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 3. Test the Application

1. Open your browser to `http://localhost:3000`
2. Upload a test file (PDF, Word doc, or image)
3. Click "Extract Text"
4. View the extracted text

## Project Structure

```
ocr-mcp-server/
├── mcp-server/              # Standalone MCP server
│   └── index.js            # MCP server implementation
├── pages/                   # Next.js pages
│   ├── api/
│   │   └── ocr.ts          # OCR API endpoint
│   ├── _app.tsx            # App wrapper
│   └── index.tsx           # Main UI page
├── styles/
│   └── globals.css         # Global styles
├── public/                  # Static assets
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind CSS config
├── next.config.js          # Next.js config
├── vercel.json             # Vercel deployment config
└── README.md               # Documentation
```

## Using the MCP Server

The standalone MCP server can be integrated with AI tools that support the Model Context Protocol.

### Running the MCP Server

```bash
node mcp-server/index.js
```

### MCP Server Tool

The server provides an `extract_text` tool with the following schema:

**Input:**
```json
{
  "file_path": "/path/to/file.pdf",
  "file_type": "pdf"  // or "docx" or "image"
}
```

**Output:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Extracted text content..."
    }
  ]
}
```

## Development Commands

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Testing Different File Types

### PDF Files
- Upload any PDF document
- Text-based PDFs work best
- Scanned PDFs may require OCR (use image format instead)

### Word Documents
- Supports .docx and .doc formats
- Extracts plain text (formatting is removed)

### Images
- Supports: JPG, PNG, GIF, BMP, TIFF, WebP
- Uses Tesseract.js for OCR
- Best results with high-contrast, clear text
- Processing time: 10-30 seconds depending on image size

## Configuration

### File Size Limit

Default: 10MB (configured in `pages/api/ocr.ts`)

To change:
```typescript
const form = formidable({
  maxFileSize: 20 * 1024 * 1024, // 20MB
});
```

### OCR Language

Default: English

To add more languages, modify `pages/api/ocr.ts`:
```typescript
await Tesseract.recognize(filePath, 'eng+fra', { // English + French
  logger: () => {},
});
```

## Troubleshooting

### Port Already in Use

If port 3000 is busy, Next.js will automatically try port 3001, 3002, etc.
You can also manually specify a port:
```bash
npm run dev -- -p 3001
```

### Module Type Issues

The project uses CommonJS (not ES modules) to ensure compatibility with Next.js.
If you see "module is not defined" errors, ensure `package.json` does NOT have `"type": "module"`.

### Build Errors

Clear cache and rebuild:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### OCR Not Working

1. Check file format is supported
2. Ensure image quality is good
3. Check console for errors
4. Try a smaller file first

## Next Steps

1. ✅ Development server is running
2. 📝 Test with sample files
3. 🎨 Customize the UI (optional)
4. 🚀 Deploy to Vercel (see DEPLOYMENT.md)

## Support

For issues or questions:
- Check the README.md for detailed documentation
- Review DEPLOYMENT.md for deployment help
- Check Vercel logs for production issues

