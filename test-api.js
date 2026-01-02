const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

async function testFile(filePath, fileName) {
  return new Promise((resolve, reject) => {
    console.log(`\n📤 Testing: ${fileName}`);
    console.log('─'.repeat(60));
    
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), fileName);
    
    const startTime = Date.now();
    
    const request = http.request({
      method: 'POST',
      host: 'localhost',
      port: 3002,
      path: '/api/ocr',
      headers: form.getHeaders(),
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        
        console.log(`⏱️  Duration: ${duration}s`);
        console.log(`📊 Status: ${response.statusCode}`);
        console.log(`📋 Content-Type: ${response.headers['content-type']}`);
        
        try {
          const result = JSON.parse(data);
          
          if (response.statusCode === 200) {
            if (result.text) {
              console.log(`✅ SUCCESS`);
              console.log(`📝 Extracted ${result.text.length} characters`);
              console.log(`📄 First 150 chars: ${result.text.substring(0, 150).replace(/\n/g, ' ')}`);
              resolve({ success: true, chars: result.text.length, duration });
            } else {
              console.log(`⚠️  No text extracted`);
              resolve({ success: false, error: 'No text', duration });
            }
          } else {
            console.log(`❌ ERROR: ${result.error}`);
            resolve({ success: false, error: result.error, duration });
          }
        } catch (error) {
          console.log(`❌ JSON Parse Error`);
          console.log(`Raw response: ${data.substring(0, 200)}`);
          resolve({ success: false, error: 'Invalid JSON', duration });
        }
      });
    });
    
    request.on('error', (error) => {
      console.log(`❌ Request Error: ${error.message}`);
      reject(error);
    });
    
    form.pipe(request);
  });
}

async function runAPITests() {
  console.log('='.repeat(60));
  console.log('🧪 API ENDPOINT TESTING');
  console.log('='.repeat(60));
  console.log('Server: http://localhost:3002');
  console.log('='.repeat(60));
  
  const sampleDir = path.join(__dirname, 'sample_documents');
  
  const testFiles = [
    { file: 'invoice_sample 2.pdf', type: 'PDF' },
    { file: 'purchase_order_sample 2.pdf', type: 'PDF' },
    { file: 'test_document.docx', type: 'Word' },
    { file: 'test_ocr_image.png', type: 'Image' },
  ];
  
  const results = {
    passed: 0,
    failed: 0,
    details: [],
  };
  
  for (const { file, type } of testFiles) {
    const filePath = path.join(sampleDir, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`\n⚠️  File not found: ${file}`);
      continue;
    }
    
    try {
      const result = await testFile(filePath, file);
      result.type = type;
      result.file = file;
      results.details.push(result);
      
      if (result.success) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
      results.failed++;
      results.details.push({ success: false, error: error.message, type, file });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Total:  ${results.passed + results.failed}`);
  console.log('='.repeat(60));
  
  if (results.passed > 0) {
    console.log('\n✅ Successful Tests:');
    results.details.filter(r => r.success).forEach(r => {
      console.log(`   ${r.type.padEnd(6)} - ${r.file} (${r.chars} chars, ${r.duration}s)`);
    });
  }
  
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.details.filter(r => !r.success).forEach(r => {
      console.log(`   ${r.type.padEnd(6)} - ${r.file}`);
      console.log(`            Error: ${r.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (results.failed === 0) {
    console.log('🎉 All tests passed! API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check errors above.');
  }
  
  console.log('='.repeat(60));
}

// Wait a bit for server to be ready
setTimeout(() => {
  runAPITests().catch(console.error);
}, 2000);

