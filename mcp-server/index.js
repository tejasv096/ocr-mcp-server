#!/usr/bin/env node
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs/promises');
const path = require('path');

class OCRServer {
  constructor() {
    this.server = new Server(
      {
        name: 'ocr-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'extract_text',
          description: 'Extract text from PDF, Word documents (docx), or images (jpg, png, etc.) using OCR',
          inputSchema: {
            type: 'object',
            properties: {
              file_path: {
                type: 'string',
                description: 'Path to the file to extract text from',
              },
              file_type: {
                type: 'string',
                enum: ['pdf', 'docx', 'image'],
                description: 'Type of file: pdf, docx, or image',
              },
            },
            required: ['file_path', 'file_type'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'extract_text') {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }

      const { file_path, file_type } = request.params.arguments;

      try {
        let extractedText = '';

        switch (file_type) {
          case 'pdf':
            extractedText = await this.extractFromPDF(file_path);
            break;
          case 'docx':
            extractedText = await this.extractFromWord(file_path);
            break;
          case 'image':
            extractedText = await this.extractFromImage(file_path);
            break;
          default:
            throw new Error(`Unsupported file type: ${file_type}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: extractedText || 'No text could be extracted from the file.',
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error extracting text: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async extractFromPDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  async extractFromWord(filePath) {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  async extractFromImage(filePath) {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
    return text;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OCR MCP server running on stdio');
  }
}

const server = new OCRServer();
server.run().catch(console.error);

