"""
Test script for Docker OCR API
"""
import requests
from pathlib import Path

API_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_ocr(file_path: str):
    """Test OCR endpoint"""
    file_path = Path(file_path)
    print(f"Testing OCR with: {file_path.name}")
    
    with open(file_path, 'rb') as f:
        files = {'file': (file_path.name, f)}
        response = requests.post(f"{API_URL}/api/ocr", files=files)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Extracted {data['length']} characters")
        print(f"Preview: {data['text'][:100]}...")
    else:
        print(f"Error: {response.json()}")
    print()

if __name__ == "__main__":
    print("=" * 70)
    print("TESTING DOCKER OCR API")
    print("=" * 70)
    print()
    
    # Test health
    try:
        test_health()
    except Exception as e:
        print(f"Health check failed: {e}")
        print("Make sure Docker container is running: docker-compose up")
        exit(1)
    
    # Test files
    sample_dir = Path("sample_documents")
    
    test_files = [
        "invoice_sample 2.pdf",
        "purchase_order_sample 2.pdf",
        "test_document.docx",
        "test_ocr_image.png"
    ]
    
    for filename in test_files:
        file_path = sample_dir / filename
        if file_path.exists():
            try:
                test_ocr(file_path)
            except Exception as e:
                print(f"Error testing {filename}: {e}")
                print()
    
    print("=" * 70)
    print("TESTING COMPLETE")
    print("=" * 70)

