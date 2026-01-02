import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import Tesseract from 'tesseract.js';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  text?: string;
  error?: string;
};

const parseForm = async (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const extractFromPDF = async (filePath: string): Promise<string> => {
  const dataBuffer = await fs.readFile(filePath);

  // Try multiple parsing strategies
  const strategies = [
    { name: 'default', options: {} },
    { name: 'max0', options: { max: 0 } },
    { name: 'pagerender', options: {
      pagerender: async (pageData: any) => {
        const textContent = await pageData.getTextContent();
        return textContent.items.map((item: any) => item.str).join(' ');
      }
    }},
  ];

  let lastError: any = null;

  for (const strategy of strategies) {
    try {
      const data = await pdfParse(dataBuffer, strategy.options);
      if (data.text && data.text.trim().length > 0) {
        return data.text;
      }
    } catch (error: any) {
      lastError = error;
      console.log(`PDF parsing failed with ${strategy.name}:`, error.message);
    }
  }

  // If all strategies fail, provide helpful error
  throw new Error('Unable to extract text from this PDF. It may be scanned, image-based, or have structural issues. Try: 1) Converting to image and using OCR, 2) Re-saving the PDF, or 3) Using a different PDF.');
};

const extractFromWord = async (filePath: string): Promise<string> => {
  try {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text content found in the document');
    }

    return result.value;
  } catch (error: any) {
    // Handle .doc (old format) vs .docx issues
    if (error.message && error.message.includes('not a valid')) {
      throw new Error('Unable to read this Word document. Please ensure it is a valid .docx file (not .doc). Try saving it as .docx in Word.');
    }
    throw new Error(`Failed to extract text from Word document: ${error.message}`);
  }
};

const extractFromImage = async (filePath: string): Promise<string> => {
  try {
    console.log('Starting OCR for image:', filePath);

    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: (m) => {
        // Log progress for debugging
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    console.log('OCR completed, text length:', text.length);

    if (!text || text.trim().length === 0) {
      return 'No text could be detected in the image. Please ensure the image contains clear, readable text.';
    }

    return text;
  } catch (error: any) {
    console.error('OCR Error:', error);
    throw new Error(`Failed to perform OCR on image: ${error.message}`);
  }
};

const getFileType = (filename: string): string => {
  const ext = filename.toLowerCase().split('.').pop() || '';
  
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'].includes(ext)) return 'image';
  
  return 'unknown';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files } = await parseForm(req);
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = file.filepath;
    const fileName = file.originalFilename || '';
    const fileType = getFileType(fileName);

    if (fileType === 'unknown') {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    let extractedText = '';

    try {
      switch (fileType) {
        case 'pdf':
          extractedText = await extractFromPDF(filePath);
          break;
        case 'docx':
          extractedText = await extractFromWord(filePath);
          break;
        case 'image':
          extractedText = await extractFromImage(filePath);
          break;
      }

      // Clean up the uploaded file
      await fs.unlink(filePath);

      if (!extractedText.trim()) {
        return res.status(200).json({ text: 'No text could be extracted from the file.' });
      }

      return res.status(200).json({ text: extractedText });
    } catch (extractError: any) {
      // Clean up the uploaded file even if extraction fails
      try {
        await fs.unlink(filePath);
      } catch {}
      
      throw extractError;
    }
  } catch (error: any) {
    console.error('OCR Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to process file' 
    });
  }
}

