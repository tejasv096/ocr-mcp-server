const fs = require('fs/promises');
const path = require('path');
const pdfParse = require('pdf-parse');

async function testPDFWithOptions(filePath) {
  console.log('\n📄 Testing PDF:', path.basename(filePath));
  const dataBuffer = await fs.readFile(filePath);
  
  // Try different parsing strategies
  const strategies = [
    { name: 'Default', options: {} },
    { name: 'Max 0', options: { max: 0 } },
    { name: 'Pagerender', options: { pagerender: (pageData) => pageData.getTextContent() } },
    { name: 'No version', options: { version: undefined } },
  ];

  for (const strategy of strategies) {
    try {
      console.log(`  Trying strategy: ${strategy.name}...`);
      const data = await pdfParse(dataBuffer, strategy.options);
      console.log(`  ✅ SUCCESS with ${strategy.name}`);
      console.log(`     Pages: ${data.numpages}, Characters: ${data.text.length}`);
      console.log(`     First 150 chars: ${data.text.substring(0, 150).replace(/\n/g, ' ')}`);
      return { success: true, strategy: strategy.name, data };
    } catch (error) {
      console.log(`  ❌ Failed with ${strategy.name}: ${error.message}`);
    }
  }

  return { success: false };
}

async function checkPDFStructure(filePath) {
  console.log('\n🔍 Checking PDF structure:', path.basename(filePath));
  const buffer = await fs.readFile(filePath);
  
  // Check PDF header
  const header = buffer.slice(0, 8).toString();
  console.log('  Header:', header);
  
  // Check if it starts with %PDF
  if (!header.startsWith('%PDF')) {
    console.log('  ⚠️  Not a valid PDF file (missing %PDF header)');
    return false;
  }
  
  // Check PDF version
  const version = header.match(/%PDF-(\d\.\d)/);
  if (version) {
    console.log('  PDF Version:', version[1]);
  }
  
  // Check file size
  console.log('  File size:', (buffer.length / 1024).toFixed(2), 'KB');
  
  // Look for xref
  const content = buffer.toString('binary');
  const hasXref = content.includes('xref');
  const hasStartxref = content.includes('startxref');
  console.log('  Has xref table:', hasXref);
  console.log('  Has startxref:', hasStartxref);
  
  return true;
}

async function runAdvancedTests() {
  console.log('='.repeat(70));
  console.log('🔬 ADVANCED PDF TESTING');
  console.log('='.repeat(70));

  const sampleDir = path.join(__dirname, 'sample_documents');
  const pdfFiles = [
    'invoice_sample 2.pdf',
    'purchase_order_sample 2.pdf',
  ];

  for (const file of pdfFiles) {
    const filePath = path.join(sampleDir, file);
    
    try {
      await fs.access(filePath);
      
      // Check structure
      await checkPDFStructure(filePath);
      
      // Try parsing
      const result = await testPDFWithOptions(filePath);
      
      if (!result.success) {
        console.log('\n  ⚠️  All parsing strategies failed for this PDF');
        console.log('  💡 This PDF may be:');
        console.log('     - Scanned/image-based (needs OCR)');
        console.log('     - Corrupted or malformed');
        console.log('     - Using unsupported encryption');
      }
      
      console.log('\n' + '-'.repeat(70));
    } catch (error) {
      console.log(`\n⚠️  Error accessing file: ${error.message}`);
    }
  }
}

runAdvancedTests().catch(console.error);

