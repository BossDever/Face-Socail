from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
from src.routes.face_detection import face_detection_bp
from src.routes.face_recognition import face_recognition_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# ตรวจสอบ API Key middleware
@app.before_request
def check_api_key():
    # ข้าม health check endpoint
    if request.path == '/api/health':
        return None
        
    # ตรวจสอบ API key ในทุก request
    api_key = os.environ.get('API_KEY')
    request_key = request.headers.get('X-API-Key')
    
    if not request_key or request_key != api_key:
        return jsonify({'error': 'Unauthorized - Invalid API Key'}), 401

# ลงทะเบียน Blueprints
app.register_blueprint(face_detection_bp, url_prefix='/api/face/detection')
app.register_blueprint(face_recognition_bp, url_prefix='/api/face/recognition')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "AI Service is running"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3002))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
