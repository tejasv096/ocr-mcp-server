const fs = require('fs/promises');
const path = require('path');

// Use pdfjs-dist for more robust PDF parsing
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractTextWithPDFJS(filePath) {
  console.log('\n📄 Testing with PDF.js:', path.basename(filePath));
  
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = new Uint8Array(dataBuffer);
    
    // Load the PDF
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    console.log(`  ✅ PDF loaded successfully`);
    console.log(`     Pages: ${pdf.numPages}`);
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
      console.log(`     Page ${pageNum}: ${pageText.length} characters`);
    }
    
    console.log(`  📝 Total extracted: ${fullText.length} characters`);
    console.log(`  First 200 chars: ${fullText.substring(0, 200).replace(/\n/g, ' ')}`);
    
    return { success: true, text: fullText };
  } catch (error) {
    console.log(`  ❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runPDFJSTests() {
  console.log('='.repeat(70));
  console.log('🔬 TESTING WITH PDF.JS (More Robust Parser)');
  console.log('='.repeat(70));

  const sampleDir = path.join(__dirname, 'sample_documents');
  const pdfFiles = [
    'invoice_sample 2.pdf',
    'purchase_order_sample 2.pdf',
  ];

  let passed = 0;
  let failed = 0;

  for (const file of pdfFiles) {
    const filePath = path.join(sampleDir, file);
    
    try {
      await fs.access(filePath);
      const result = await extractTextWithPDFJS(filePath);
      
      if (result.success) {
        passed++;
      } else {
        failed++;
      }
      
      console.log('-'.repeat(70));
    } catch (error) {
      console.log(`\n⚠️  Error accessing file: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 RESULTS');
  console.log('='.repeat(70));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (passed === pdfFiles.length) {
    console.log('\n🎉 PDF.js can handle these PDFs!');
    console.log('💡 Recommendation: Switch to pdfjs-dist for better PDF support');
  } else if (passed > 0) {
    console.log('\n⚠️  PDF.js works for some PDFs but not all');
  } else {
    console.log('\n❌ These PDFs may be truly corrupted or image-based');
  }
}

runPDFJSTests().catch(console.error);

