const fs = require('fs/promises');
const path = require('path');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function testPDF(filePath) {
  console.log('\n📄 Testing PDF:', path.basename(filePath));
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer, {
      max: 0,
    });
    console.log('✅ SUCCESS - Extracted', data.text.length, 'characters');
    console.log('First 200 chars:', data.text.substring(0, 200).replace(/\n/g, ' '));
    return true;
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    return false;
  }
}

async function testWord(filePath) {
  console.log('\n📝 Testing Word Document:', path.basename(filePath));
  try {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    console.log('✅ SUCCESS - Extracted', result.value.length, 'characters');
    console.log('First 200 chars:', result.value.substring(0, 200).replace(/\n/g, ' '));
    return true;
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    return false;
  }
}

async function testImage(filePath) {
  console.log('\n🖼️  Testing Image OCR:', path.basename(filePath));
  try {
    console.log('Starting OCR... (this may take 10-30 seconds)');
    const startTime = Date.now();
    
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          process.stdout.write(`\rProgress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ SUCCESS - Extracted ${text.length} characters in ${duration}s`);
    console.log('First 200 chars:', text.substring(0, 200).replace(/\n/g, ' '));
    return true;
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('🧪 OCR FUNCTIONALITY TEST');
  console.log('='.repeat(60));

  const sampleDir = path.join(__dirname, 'sample_documents');
  const results = {
    passed: 0,
    failed: 0,
  };

  // Test PDFs
  const pdfFiles = [
    'invoice_sample 2.pdf',
    'purchase_order_sample 2.pdf',
  ];

  for (const file of pdfFiles) {
    const filePath = path.join(sampleDir, file);
    try {
      await fs.access(filePath);
      const success = await testPDF(filePath);
      if (success) results.passed++;
      else results.failed++;
    } catch (error) {
      console.log(`\n⚠️  File not found: ${file}`);
    }
  }

  // Test Word Document
  const wordFile = 'test_document.docx';
  const wordPath = path.join(sampleDir, wordFile);
  try {
    await fs.access(wordPath);
    const success = await testWord(wordPath);
    if (success) results.passed++;
    else results.failed++;
  } catch (error) {
    console.log(`\n⚠️  File not found: ${wordFile}`);
  }

  // Test Image
  const imageFile = 'test_ocr_image.png';
  const imagePath = path.join(sampleDir, imageFile);
  try {
    await fs.access(imagePath);
    const success = await testImage(imagePath);
    if (success) results.passed++;
    else results.failed++;
  } catch (error) {
    console.log(`\n⚠️  File not found: ${imageFile}`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Total:  ${results.passed + results.failed}`);
  console.log('='.repeat(60));

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! OCR is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

runTests().catch(console.error);

