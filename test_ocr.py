#!/usr/bin/env python3
"""
Test script for OCR functionality
Tests PDF, Word, and Image extraction
"""

import sys
import asyncio
from pathlib import Path
import pytesseract
from PIL import Image
import PyPDF2
from pdf2image import convert_from_path
from docx import Document

async def test_pdf(file_path: Path):
    """Test PDF extraction"""
    print(f"\nTesting PDF: {file_path.name}")
    
    try:
        # Try text extraction first
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            if text.strip():
                print(f"SUCCESS - {len(text)} chars (text extraction)")
                print(f"   Preview: {text[:100].replace(chr(10), ' ')}...")
                return True
        
        # Fallback to OCR
        print("   Trying OCR fallback...")
        images = convert_from_path(str(file_path), dpi=300)
        text = ""
        for image in images:
            page_text = pytesseract.image_to_string(image)
            text += page_text + "\n"
        
        if text.strip():
            print(f"SUCCESS - {len(text)} chars (OCR)")
            print(f"   Preview: {text[:100].replace(chr(10), ' ')}...")
            return True
        else:
            print("FAILED - No text extracted")
            return False

    except Exception as e:
        print(f"ERROR - {str(e)}")
        return False

async def test_word(file_path: Path):
    """Test Word extraction"""
    print(f"\nTesting Word: {file_path.name}")
    
    try:
        doc = Document(file_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        
        if text.strip():
            print(f"SUCCESS - {len(text)} chars")
            print(f"   Preview: {text[:100].replace(chr(10), ' ')}...")
            return True
        else:
            print("FAILED - No text extracted")
            return False

    except Exception as e:
        print(f"ERROR - {str(e)}")
        return False

async def test_image(file_path: Path):
    """Test image OCR"""
    print(f"\nTesting Image: {file_path.name}")
    
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        
        if text.strip():
            print(f"SUCCESS - {len(text)} chars")
            print(f"   Preview: {text[:100].replace(chr(10), ' ')}...")
            return True
        else:
            print("FAILED - No text extracted")
            return False

    except Exception as e:
        print(f"ERROR - {str(e)}")
        return False

async def main():
    print("=" * 70)
    print("TESTING OCR FUNCTIONALITY")
    print("=" * 70)
    
    sample_dir = Path("sample_documents")

    if not sample_dir.exists():
        print(f"Sample directory not found: {sample_dir}")
        return
    
    test_files = [
        ("invoice_sample 2.pdf", test_pdf),
        ("purchase_order_sample 2.pdf", test_pdf),
        ("test_document.docx", test_word),
        ("test_ocr_image.png", test_image),
    ]
    
    passed = 0
    failed = 0
    
    for filename, test_func in test_files:
        file_path = sample_dir / filename
        
        if not file_path.exists():
            print(f"\nFile not found: {filename}")
            continue
        
        result = await test_func(file_path)
        if result:
            passed += 1
        else:
            failed += 1
    
    print("\n" + "=" * 70)
    print("RESULTS")
    print("=" * 70)
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Total:  {passed + failed}")
    print("=" * 70)

    if failed == 0:
        print("\nAll tests passed!\n")
        sys.exit(0)
    else:
        print("\nSome tests failed.\n")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())

