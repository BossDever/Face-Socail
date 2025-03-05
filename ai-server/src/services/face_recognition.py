import os
import numpy as np
import tensorflow as tf
import cv2
from src.utils.preprocess import preprocess_face

# ปิดการแจ้งเตือน TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

class FaceRecognition:
    def __init__(self, model_path):
        self.model_path = model_path
        self.graph = tf.Graph()
        self.sess = None
        self.embeddings = None
        self.images_placeholder = None
        self.phase_train_placeholder = None
        self.load_model()
        
    def load_model(self):
        """โหลดโมเดล FaceNet"""
        with self.graph.as_default():
            with tf.io.gfile.GFile(self.model_path, 'rb') as f:
                graph_def = tf.compat.v1.GraphDef()
                graph_def.ParseFromString(f.read())
                tf.import_graph_def(graph_def, name='')
            
            # เริ่ม TensorFlow session
            self.sess = tf.compat.v1.Session(graph=self.graph)
            
            # ดึง placeholders
            self.images_placeholder = self.graph.get_tensor_by_name("input:0")
            self.embeddings = self.graph.get_tensor_by_name("embeddings:0")
            self.phase_train_placeholder = self.graph.get_tensor_by_name("phase_train:0")
            
            print("โหลดโมเดล FaceNet สำเร็จ")
    
    def get_embeddings(self, face_img, image_size=160):
        """
        สร้าง face embeddings จากรูปภาพใบหน้า
        
        Args:
            face_img: ภาพใบหน้าที่ตัดมาแล้ว
            image_size: ขนาดภาพที่ต้องการปรับ (ค่าเริ่มต้น 160x160)
            
        Returns:
            embedding: เวกเตอร์ 512 มิติที่แทนใบหน้า
        """
        # ตรวจสอบว่ามีใบหน้าหรือไม่
        if face_img is None:
            return None
        
        # Preprocess ใบหน้า
        processed_img = preprocess_face(face_img, image_size)
        
        # คำนวณ embeddings
        feed_dict = {
            self.images_placeholder: [processed_img],
            self.phase_train_placeholder: False
        }
        embedding = self.sess.run(self.embeddings, feed_dict=feed_dict)[0]
        
        return embedding
    
    def compare_faces(self, embedding1, embedding2, threshold=0.7):
        """
        เปรียบเทียบ embeddings สองชุดว่าเป็นคนเดียวกันหรือไม่
        
        Args:
            embedding1: embedding ชุดแรก
            embedding2: embedding ชุดที่สอง
            threshold: ค่าขีดแบ่งสำหรับการตัดสินใจ (ค่าต่ำ = เข้มงวดน้อย)
            
        Returns:
            is_same_person: True/False
            distance: ระยะห่างระหว่าง embeddings
        """
        if embedding1 is None or embedding2 is None:
            return False, 1.0
        
        # คำนวณระยะทาง Euclidean
        dist = np.linalg.norm(embedding1 - embedding2)
        
        # ตัดสินใจว่าเป็นคนเดียวกันหรือไม่
        is_same_person = dist < threshold
        
        return is_same_person, dist
        
    def quality_assessment(self, face_img):
        """
        ประเมินคุณภาพของภาพใบหน้า
        
        Args:
            face_img: ภาพใบหน้าที่ตัดมาแล้ว
            
        Returns:
            quality_score: คะแนนคุณภาพ 0-100
            feedback: คำแนะนำในการปรับปรุงคุณภาพ
        """
        if face_img is None:
            return 0, "ไม่พบใบหน้าในภาพ"
        
        feedback = []
        quality_scores = {}
        
        # ตรวจสอบความสว่างของภาพ
        brightness = np.mean(face_img)
        quality_scores['brightness'] = min(100, max(0, 100 * (brightness / 128.0)))
        if brightness < 50:
            feedback.append("ภาพมืดเกินไป เพิ่มแสงสว่าง")
        elif brightness > 200:
            feedback.append("ภาพสว่างเกินไป ลดแสงลง")
        
        # ตรวจสอบความคมชัด
        gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        sharpness = np.var(laplacian)
        quality_scores['sharpness'] = min(100, max(0, 100 * (sharpness / 500.0)))
        if sharpness < 100:
            feedback.append("ภาพไม่คมชัด อาจเป็นเพราะกล้องเคลื่อนไหวหรือโฟกัสไม่ดี")
        
        # คำนวณคะแนนเฉลี่ย
        avg_quality = sum(quality_scores.values()) / len(quality_scores)
        
        # ถ้าไม่มีปัญหา
        if not feedback:
            feedback.append("คุณภาพภาพดี เหมาะสำหรับการจดจำใบหน้า")
        
        return avg_quality, ", ".join(feedback)
        
    def __del__(self):
        """ทำความสะอาดทรัพยากร"""
        if self.sess:
            self.sess.close()
