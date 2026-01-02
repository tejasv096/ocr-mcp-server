#!/usr/bin/env python3
"""
OCR MCP Server - Python Implementation
Extracts text from PDF, Word documents, and images using pytesseract
"""

import sys
import json
import asyncio
import logging
from pathlib import Path
from typing import Any, Dict

# OCR and document processing
import pytesseract
from PIL import Image
import PyPDF2
from pdf2image import convert_from_path
from docx import Document

# MCP SDK
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

# Configure logging
logging.basicConfig(level=logging.INFO, stream=sys.stderr)
logger = logging.getLogger("ocr-server")

# Configure pytesseract path - try common locations
import os
tesseract_paths = [
    r'C:\Program Files\Tesseract-OCR\tesseract.exe',
    r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
    r'/usr/bin/tesseract',
    r'/usr/local/bin/tesseract',
]
for path in tesseract_paths:
    if os.path.exists(path):
        pytesseract.pytesseract.tesseract_cmd = path
        logger.info(f"Found Tesseract at: {path}")
        break

class OCRServer:
    def __init__(self):
        self.server = Server("ocr-server")
        self.setup_handlers()
    
    def setup_handlers(self):
        @self.server.list_tools()
        async def list_tools() -> list[types.Tool]:
            return [
                types.Tool(
                    name="extract_text",
                    description="Extract text from PDF, Word documents (docx), or images using OCR",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "file_path": {
                                "type": "string",
                                "description": "Path to the file to extract text from"
                            },
                            "file_type": {
                                "type": "string",
                                "enum": ["pdf", "docx", "image"],
                                "description": "Type of file: pdf, docx, or image"
                            }
                        },
                        "required": ["file_path", "file_type"]
                    }
                )
            ]
        
        @self.server.call_tool()
        async def call_tool(name: str, arguments: Dict[str, Any]) -> list[types.TextContent]:
            if name != "extract_text":
                raise ValueError(f"Unknown tool: {name}")
            
            file_path = arguments.get("file_path")
            file_type = arguments.get("file_type")
            
            if not file_path or not file_type:
                raise ValueError("file_path and file_type are required")
            
            try:
                extracted_text = await self.extract_text(file_path, file_type)
                return [types.TextContent(
                    type="text",
                    text=extracted_text or "No text could be extracted from the file."
                )]
            except Exception as e:
                logger.error(f"Error extracting text: {e}")
                return [types.TextContent(
                    type="text",
                    text=f"Error extracting text: {str(e)}"
                )]
    
    async def extract_text(self, file_path: str, file_type: str) -> str:
        """Extract text based on file type"""
        path = Path(file_path)
        
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if file_type == "pdf":
            return await self.extract_from_pdf(path)
        elif file_type == "docx":
            return await self.extract_from_word(path)
        elif file_type == "image":
            return await self.extract_from_image(path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    async def extract_from_pdf(self, file_path: Path) -> str:
        """Extract text from PDF using PyPDF2 and OCR fallback"""
        logger.info(f"Extracting text from PDF: {file_path}")
        
        try:
            # Try text extraction first
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                
                # If we got text, return it
                if text.strip():
                    logger.info(f"Extracted {len(text)} characters from PDF")
                    return text.strip()
        except Exception as e:
            logger.warning(f"Text extraction failed: {e}, trying OCR")
        
        # Fallback to OCR for scanned PDFs
        try:
            logger.info("Converting PDF to images for OCR")
            images = convert_from_path(str(file_path), dpi=300)
            text = ""
            for i, image in enumerate(images):
                logger.info(f"OCR on page {i+1}/{len(images)}")
                page_text = pytesseract.image_to_string(image)
                text += page_text + "\n"
            
            logger.info(f"OCR extracted {len(text)} characters")
            return text.strip()
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
    
    async def extract_from_word(self, file_path: Path) -> str:
        """Extract text from Word document"""
        logger.info(f"Extracting text from Word: {file_path}")
        
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            logger.info(f"Extracted {len(text)} characters from Word")
            return text.strip()
        except Exception as e:
            raise Exception(f"Failed to extract text from Word document: {str(e)}")
    
    async def extract_from_image(self, file_path: Path) -> str:
        """Extract text from image using pytesseract"""
        logger.info(f"Extracting text from image: {file_path}")

        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            logger.info(f"OCR extracted {len(text)} characters")
            return text.strip()
        except pytesseract.TesseractNotFoundError:
            raise Exception("Tesseract OCR is not installed. Please install Tesseract-OCR from https://github.com/tesseract-ocr/tesseract")
        except Exception as e:
            raise Exception(f"Failed to perform OCR on image: {str(e)}")
    
    async def run(self):
        """Run the MCP server"""
        async with stdio_server() as (read_stream, write_stream):
            logger.info("OCR MCP Server running on stdio")
            await self.server.run(
                read_stream,
                write_stream,
                self.server.create_initialization_options()
            )

async def main():
    server = OCRServer()
    await server.run()

if __name__ == "__main__":
    asyncio.run(main())

