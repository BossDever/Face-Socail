from flask import Blueprint, request, jsonify
import numpy as np
import cv2
from src.services.face_detection import detect_faces
import base64

# สร้าง blueprint
face_detection_bp = Blueprint('face_detection', __name__)

@face_detection_bp.route('/detect', methods=['POST'])
def detect():
    """
    API สำหรับตรวจจับใบหน้าในรูปภาพ
    
    รับข้อมูลรูปภาพในรูปแบบ Base64 และส่งคืนพิกัดของใบหน้าที่ตรวจพบ
    """
    # ตรวจสอบข้อมูลที่ส่งมา
    if 'image' not in request.json:
        return jsonify({"error": "กรุณาส่งรูปภาพในรูปแบบ Base64"}), 400
    
    try:
        # แปลง Base64 เป็นรูปภาพ
        image_data = request.json['image']
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        
        # Decode base64
        img_bytes = base64.b64decode(image_data)
        img_array = np.frombuffer(img_bytes, np.uint8)
        image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({"error": "ไม่สามารถอ่านรูปภาพได้"}), 400
        
        # ตรวจจับใบหน้า
        faces = detect_faces(image)
        
        # ประมวลผลข้อมูลใบหน้า
        results = []
        for face in faces:
            # ดึงพิกัดของใบหน้า
            box = face['box']
            confidence = face['confidence']
            
            # ดึงจุด landmarks
            landmarks = {
                'left_eye': face['keypoints']['left_eye'],
                'right_eye': face['keypoints']['right_eye'],
                'nose': face['keypoints']['nose'],
                'mouth_left': face['keypoints']['mouth_left'],
                'mouth_right': face['keypoints']['mouth_right']
            }
            
            results.append({
                'box': box,
                'confidence': float(confidence),
                'landmarks': landmarks
            })
        
        return jsonify({
            "status": "success",
            "faces": results,
            "count": len(results)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
