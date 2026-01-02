const fs = require('fs');
const path = require('path');

function inspectPDF(filePath) {
  console.log('\n🔍 Inspecting:', path.basename(filePath));
  console.log('='.repeat(60));
  
  const buffer = fs.readFileSync(filePath);
  const content = buffer.toString('binary');
  
  // Check header
  const header = buffer.slice(0, 20).toString();
  console.log('Header:', header.replace(/\n/g, '\\n'));
  
  // Check for common PDF elements
  console.log('\nPDF Structure:');
  console.log('  Has /Type /Catalog:', content.includes('/Type /Catalog'));
  console.log('  Has /Type /Page:', content.includes('/Type /Page'));
  console.log('  Has /Type /Pages:', content.includes('/Type /Pages'));
  console.log('  Has /Font:', content.includes('/Font'));
  console.log('  Has /Image:', content.includes('/Image'));
  console.log('  Has stream objects:', content.includes('stream'));
  console.log('  Has /Contents:', content.includes('/Contents'));
  
  // Check for text content
  console.log('\nContent Analysis:');
  const hasText = content.match(/\(([^)]+)\)/g);
  if (hasText && hasText.length > 0) {
    console.log('  Found', hasText.length, 'text strings');
    console.log('  Sample strings:');
    hasText.slice(0, 5).forEach((str, i) => {
      console.log(`    ${i + 1}. ${str.substring(0, 50)}`);
    });
  } else {
    console.log('  ⚠️  No text strings found (might be image-based)');
  }
  
  // Check xref
  const xrefMatch = content.match(/xref\s+(\d+)\s+(\d+)/);
  if (xrefMatch) {
    console.log('\nXRef Table:');
    console.log('  Start object:', xrefMatch[1]);
    console.log('  Number of objects:', xrefMatch[2]);
  }
  
  // Check trailer
  const trailerMatch = content.match(/trailer\s*<<([^>]+)>>/);
  if (trailerMatch) {
    console.log('\nTrailer found');
  }
  
  // Look for startxref
  const startxrefMatch = content.match(/startxref\s+(\d+)/);
  if (startxrefMatch) {
    console.log('  startxref position:', startxrefMatch[1]);
    
    // Check if the xref position is valid
    const xrefPos = parseInt(startxrefMatch[1]);
    if (xrefPos > buffer.length) {
      console.log('  ⚠️  ERROR: xref position is beyond file size!');
      console.log('     This explains the "bad XRef entry" error');
    }
  }
  
  console.log('\nFile Info:');
  console.log('  Size:', (buffer.length / 1024).toFixed(2), 'KB');
  console.log('  Binary size:', buffer.length, 'bytes');
}

const sampleDir = path.join(__dirname, 'sample_documents');
const pdfFiles = [
  'invoice_sample 2.pdf',
  'purchase_order_sample 2.pdf',
];

console.log('='.repeat(60));
console.log('PDF INSPECTION TOOL');
console.log('='.repeat(60));

pdfFiles.forEach(file => {
  const filePath = path.join(sampleDir, file);
  if (fs.existsSync(filePath)) {
    inspectPDF(filePath);
  } else {
    console.log(`\n⚠️  File not found: ${file}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('INSPECTION COMPLETE');
console.log('='.repeat(60));

