import http.server
import socketserver
import json
import base64
from urllib.parse import urlparse

PORT = 3002

class SimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        if self.path == '/api/health':
            response = {"status": "ok", "message": "AI Service is running"}
        else:
            response = {"status": "ok", "message": "Unknown endpoint, but we're still running!"}
            
        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            request_json = json.loads(post_data.decode('utf-8'))
        except:
            request_json = {}
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        # ตอบกลับ dummy response สำหรับการทดสอบ
        if self.path == '/api/face/detection/detect':
            response = {"status": "success", "faces": [{"box": [0, 0, 100, 100], "confidence": 0.99, "landmarks": {"left_eye": [30, 30], "right_eye": [70, 30], "nose": [50, 50], "mouth_left": [30, 70], "mouth_right": [70, 70]}}], "count": 1}
        elif self.path == '/api/face/recognition/embeddings':
            # สร้าง dummy embedding vector
            dummy_embedding = [0.01 * i for i in range(128)]
            response = {
                "status": "success", 
                "embedding": dummy_embedding,
                "quality": {"score": 85.5, "feedback": "คุณภาพภาพดี เหมาะสำหรับการจดจำใบหน้า"},
                "face_box": [0, 0, 100, 100]
            }
        elif self.path == '/api/face/recognition/compare':
            response = {
                "status": "success", 
                "is_same_person": True, 
                "confidence": 0.92, 
                "distance": 0.08, 
                "threshold": 0.7
            }
        else:
            response = {"status": "success", "message": "Dummy response for endpoint: " + self.path}
            
        self.wfile.write(json.dumps(response).encode())

    def log_message(self, format, *args):
        print(f"Request: {args[0]} {args[1]} {args[2]}")

print(f"Starting simple HTTP server on port {PORT}")
with socketserver.TCPServer(("", PORT), SimpleHTTPRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print("This is a dummy server for testing purposes")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Server stopped")
