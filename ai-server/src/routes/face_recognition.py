from flask import Blueprint, request, jsonify
import numpy as np
import cv2
import base64
import os
import json
from src.services.face_detection import detect_faces
from src.services.face_recognition import FaceRecognition
from src.utils.preprocess import extract_face

# สร้าง blueprint
face_recognition_bp = Blueprint('face_recognition', __name__)

# โหลดโมเดล FaceNet
model_path = os.environ.get('FACENET_MODEL_PATH', '../models/facenet/20180402-114759/20180402-114759.pb')
face_recognition = FaceRecognition(model_path)

@face_recognition_bp.route('/embeddings', methods=['POST'])
def get_embeddings():
    """
    API สำหรับสร้าง face embeddings จากรูปภาพ
    
    รับข้อมูลรูปภาพในรูปแบบ Base64 และส่งคืน embeddings
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
        
        if not faces:
            return jsonify({
                "status": "error",
                "message": "ไม่พบใบหน้าในรูปภาพ"
            }), 400
        
        # ถ้ามีหลายใบหน้า ใช้ใบหน้าที่มีความมั่นใจสูงสุด
        face = max(faces, key=lambda x: x['confidence'])
        
        # ตัดใบหน้า
        face_img = extract_face(image, face['box'])
        
        # สร้าง embeddings
        embedding = face_recognition.get_embeddings(face_img)
        
        # ประเมินคุณภาพ
        quality_score, feedback = face_recognition.quality_assessment(face_img)
        
        return jsonify({
            "status": "success",
            "embedding": embedding.tolist(),
            "quality": {
                "score": float(quality_score),
                "feedback": feedback
            },
            "face_box": face['box']
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@face_recognition_bp.route('/compare', methods=['POST'])
def compare_faces():
    """
    API สำหรับเปรียบเทียบใบหน้าสองภาพ
    
    รับข้อมูลรูปภาพสองรูปหรือ embeddings ในรูปแบบ JSON และส่งคืนผลการเปรียบเทียบ
    """
    try:
        data = request.json
        
        # ตรวจสอบว่าส่งมาเป็น embeddings หรือรูปภาพ
        if 'embedding1' in data and 'embedding2' in data:
            # กรณีส่ง embeddings มาโดยตรง
            embedding1 = np.array(data['embedding1'])
            embedding2 = np.array(data['embedding2'])
        
        elif 'image1' in data and 'image2' in data:
            # กรณีส่งรูปภาพมา ต้องสร้าง embeddings ก่อน
            # แปลง Base64 เป็นรูปภาพ 1
            image_data1 = data['image1']
            image_data1 = image_data1.split(',')[1] if ',' in image_data1 else image_data1
            img_bytes1 = base64.b64decode(image_data1)
            img_array1 = np.frombuffer(img_bytes1, np.uint8)
            image1 = cv2.imdecode(img_array1, cv2.IMREAD_COLOR)
            
            # แปลง Base64 เป็นรูปภาพ 2
            image_data2 = data['image2']
            image_data2 = image_data2.split(',')[1] if ',' in image_data2 else image_data2
            img_bytes2 = base64.b64decode(image_data2)
            img_array2 = np.frombuffer(img_bytes2, np.uint8)
            image2 = cv2.imdecode(img_array2, cv2.IMREAD_COLOR)
            
            # ตรวจจับและตัดใบหน้า 1
            faces1 = detect_faces(image1)
            if not faces1:
                return jsonify({"error": "ไม่พบใบหน้าในรูปภาพแรก"}), 400
            face1 = max(faces1, key=lambda x: x['confidence'])
            face_img1 = extract_face(image1, face1['box'])
            
            # ตรวจจับและตัดใบหน้า 2
            faces2 = detect_faces(image2)
            if not faces2:
                return jsonify({"error": "ไม่พบใบหน้าในรูปภาพที่สอง"}), 400
            face2 = max(faces2, key=lambda x: x['confidence'])
            face_img2 = extract_face(image2, face2['box'])
            
            # สร้าง embeddings
            embedding1 = face_recognition.get_embeddings(face_img1)
            embedding2 = face_recognition.get_embeddings(face_img2)
        
        else:
            return jsonify({"error": "กรุณาส่ง embeddings หรือรูปภาพ"}), 400
        
        # กำหนด threshold ถ้ามีการส่งมา
        threshold = data.get('threshold', 0.7)
        
        # เปรียบเทียบใบหน้า
        is_same, distance = face_recognition.compare_faces(embedding1, embedding2, threshold)
        
        # ส่งคืนผลลัพธ์
        return jsonify({
            "status": "success",
            "is_same_person": bool(is_same),
            "confidence": 1.0 - float(distance),
            "distance": float(distance),
            "threshold": threshold
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@face_recognition_bp.route('/quality', methods=['POST'])
def assess_quality():
    """
    API สำหรับประเมินคุณภาพของรูปภาพใบหน้า
    
    รับข้อมูลรูปภาพในรูปแบบ Base64 และส่งคืนผลการประเมินคุณภาพ
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
        
        if not faces:
            return jsonify({
                "status": "error",
                "message": "ไม่พบใบหน้าในรูปภาพ"
            }), 400
        
        # ถ้ามีหลายใบหน้า ใช้ใบหน้าที่มีความมั่นใจสูงสุด
        face = max(faces, key=lambda x: x['confidence'])
        
        # ตัดใบหน้า
        face_img = extract_face(image, face['box'])
        
        # ประเมินคุณภาพ
        quality_score, feedback = face_recognition.quality_assessment(face_img)
        
        return jsonify({
            "status": "success",
            "quality": {
                "score": float(quality_score),
                "feedback": feedback
            },
            "face_box": face['box']
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
