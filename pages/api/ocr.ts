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
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const extractFromWord = async (filePath: string): Promise<string> => {
  const buffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

const extractFromImage = async (filePath: string): Promise<string> => {
  const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
    logger: () => {}, // Suppress logs in production
  });
  return text;
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

