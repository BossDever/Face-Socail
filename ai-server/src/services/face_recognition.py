import os
import numpy as np
import tensorflow as tf
import cv2
import logging
from src.utils.preprocess import preprocess_face

# ตั้งค่า logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ปรับการใช้งาน GPU
physical_devices = tf.config.list_physical_devices('GPU')
if len(physical_devices) > 0:
    logger.info(f"พบ GPU {len(physical_devices)} เครื่อง: {physical_devices}")
    try:
        # ให้ TensorFlow จองหน่วยความจำตามที่จำเป็น
        for device in physical_devices:
            tf.config.experimental.set_memory_growth(device, True)
        logger.info("ตั้งค่า GPU memory growth สำเร็จ")
    except Exception as e:
        logger.error(f"ไม่สามารถตั้งค่า GPU memory growth: {e}")
else:
    logger.warning("ไม่พบ GPU - การประมวลผลจะช้ากว่าปกติ")

# ปิดการแจ้งเตือน TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

class FaceRecognition:
    def __init__(self, model_path, threshold=0.6):
        """
        เริ่มต้นคลาส FaceRecognition

        Args:
            model_path: path ไปยังโมเดล FaceNet
            threshold: ค่าเริ่มต้นสำหรับการเปรียบเทียบใบหน้า (ค่าต่ำ = เข้มงวดมากขึ้น)
        """
        self.model_path = model_path
        self.default_threshold = threshold
        self.graph = tf.Graph()
        self.sess = None
        self.embeddings = None
        self.images_placeholder = None
        self.phase_train_placeholder = None
        self.batch_size_placeholder = None
        self.load_model()
        
    def load_model(self):
        """โหลดโมเดล FaceNet และตั้งค่า TensorFlow session"""
        try:
            with self.graph.as_default():
                with tf.io.gfile.GFile(self.model_path, 'rb') as f:
                    graph_def = tf.compat.v1.GraphDef()
                    graph_def.ParseFromString(f.read())
                    tf.import_graph_def(graph_def, name='')
                
                # สร้าง TensorFlow session ที่ใช้ GPU ถ้ามี
                config = tf.compat.v1.ConfigProto()
                config.gpu_options.allow_growth = True
                self.sess = tf.compat.v1.Session(graph=self.graph, config=config)
                
                # ดึง placeholders จากโมเดล
                self.images_placeholder = self.graph.get_tensor_by_name("input:0")
                self.embeddings = self.graph.get_tensor_by_name("embeddings:0")
                self.phase_train_placeholder = self.graph.get_tensor_by_name("phase_train:0")
                
                # ทดสอบโมเดลด้วย dummy input เพื่อให้แน่ใจว่าทุกอย่างทำงานได้
                dummy_input = np.zeros((1, 160, 160, 3))
                feed_dict = {
                    self.images_placeholder: dummy_input,
                    self.phase_train_placeholder: False
                }
                self.sess.run(self.embeddings, feed_dict=feed_dict)
                
                logger.info("โหลดโมเดล FaceNet สำเร็จและพร้อมใช้งาน")
        except Exception as e:
            logger.error(f"ไม่สามารถโหลดโมเดล FaceNet: {e}")
            raise
    
    def get_embeddings(self, face_img, image_size=(160, 160)):
        """
        สร้าง face embeddings จากรูปภาพใบหน้า
        
        Args:
            face_img: ภาพใบหน้าที่ตัดมาแล้ว (numpy array)
            image_size: ขนาดภาพที่ต้องการปรับ (default: 160x160)
            
        Returns:
            embedding: เวกเตอร์ 512 มิติที่แทนใบหน้า หรือ None ถ้ามีข้อผิดพลาด
        """
        try:
            # ตรวจสอบว่ามีใบหน้าหรือไม่
            if face_img is None:
                logger.warning("ไม่สามารถสร้าง embedding เนื่องจากไม่มีข้อมูลใบหน้า")
                return None
            
            # Preprocess ใบหน้า
            processed_img = preprocess_face(face_img, image_size)
            if processed_img is None:
                logger.warning("การ preprocess ใบหน้าล้มเหลว")
                return None
            
            # คำนวณ embeddings
            feed_dict = {
                self.images_placeholder: [processed_img],
                self.phase_train_placeholder: False
            }
            embedding = self.sess.run(self.embeddings, feed_dict=feed_dict)[0]
            
            # Normalize embedding เพื่อให้ค่าที่ได้มีความแม่นยำมากขึ้น
            embedding = embedding / np.linalg.norm(embedding)
            
            return embedding
            
        except Exception as e:
            logger.error(f"เกิดข้อผิดพลาดในการสร้าง embedding: {e}")
            return None
    
    def get_embeddings_batch(self, face_imgs, image_size=(160, 160)):
        """
        สร้าง face embeddings จากรูปภาพใบหน้าหลายรูป (batch processing)
        
        Args:
            face_imgs: รายการภาพใบหน้าที่ตัดมาแล้ว
            image_size: ขนาดภาพที่ต้องการปรับ
            
        Returns:
            embeddings: รายการ embeddings หรือ None ถ้ามีข้อผิดพลาด
        """
        try:
            # ตรวจสอบว่ามีใบหน้าหรือไม่
            if not face_imgs or len(face_imgs) == 0:
                logger.warning("ไม่สามารถสร้าง embeddings เนื่องจากไม่มีข้อมูลใบหน้า")
                return None
            
            # Preprocess ใบหน้าทั้งหมด
            processed_imgs = []
            for face_img in face_imgs:
                if face_img is not None:
                    processed_img = preprocess_face(face_img, image_size)
                    if processed_img is not None:
                        processed_imgs.append(processed_img)
            
            if not processed_imgs:
                logger.warning("ไม่มีใบหน้าที่สามารถ preprocess ได้")
                return None
            
            # คำนวณ embeddings
            feed_dict = {
                self.images_placeholder: processed_imgs,
                self.phase_train_placeholder: False
            }
            embeddings = self.sess.run(self.embeddings, feed_dict=feed_dict)
            
            # Normalize embeddings
            for i in range(len(embeddings)):
                embeddings[i] = embeddings[i] / np.linalg.norm(embeddings[i])
            
            return embeddings
            
        except Exception as e:
            logger.error(f"เกิดข้อผิดพลาดในการสร้าง embeddings แบบ batch: {e}")
            return None
    
    def compare_faces(self, embedding1, embedding2, threshold=None):
        """
        เปรียบเทียบ embeddings สองชุดว่าเป็นคนเดียวกันหรือไม่
        
        Args:
            embedding1: embedding ชุดแรก
            embedding2: embedding ชุดที่สอง
            threshold: ค่าขีดแบ่งสำหรับการตัดสินใจ (ถ้าไม่ระบุจะใช้ค่าเริ่มต้น)
            
        Returns:
            is_same_person: True/False
            distance: ระยะห่างระหว่าง embeddings
        """
        if embedding1 is None or embedding2 is None:
            logger.warning("ไม่สามารถเปรียบเทียบใบหน้าเนื่องจาก embedding เป็น None")
            return False, 1.0
        
        # ใช้ threshold ที่ระบุหรือใช้ค่าเริ่มต้น
        if threshold is None:
            threshold = self.default_threshold
        
        # ทำให้ embeddings เป็น normalized vector (มีขนาด 1)
        # นี่จะช่วยให้การเปรียบเทียบมีความแม่นยำมากขึ้น
        if np.linalg.norm(embedding1) > 0:
            embedding1 = embedding1 / np.linalg.norm(embedding1)
        if np.linalg.norm(embedding2) > 0:
            embedding2 = embedding2 / np.linalg.norm(embedding2)
        
        # คำนวณ cosine similarity (ค่ายิ่งสูงยิ่งเหมือนกัน)
        similarity = np.dot(embedding1, embedding2)
        # คำนวณ distance (1 - similarity) เพื่อให้ค่าต่ำ = เหมือนกัน
        distance = 1.0 - similarity
        
        # ตัดสินใจว่าเป็นคนเดียวกันหรือไม่
        is_same_person = distance < threshold
        
        return is_same_person, distance
    
    def find_best_match(self, embedding, embeddings_list, threshold=None):
        """
        ค้นหาใบหน้าที่ตรงกับ embedding ที่กำหนดมากที่สุด
        
        Args:
            embedding: embedding ที่ต้องการเปรียบเทียบ
            embeddings_list: รายการ embeddings ที่ต้องการค้นหา
            threshold: ค่าขีดแบ่งสำหรับการตัดสินใจ
            
        Returns:
            best_match_idx: ดัชนีของ embedding ที่ตรงมากที่สุด (-1 ถ้าไม่พบ)
            best_match_distance: ระยะห่างของ embedding ที่ตรงมากที่สุด
        """
        if embedding is None or not embeddings_list:
            return -1, 1.0
        
        best_match_idx = -1
        best_match_distance = 1.0
        
        for i, emb in enumerate(embeddings_list):
            is_same, distance = self.compare_faces(embedding, emb, threshold)
            if is_same and distance < best_match_distance:
                best_match_idx = i
                best_match_distance = distance
        
        return best_match_idx, best_match_distance
        
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
        if len(face_img.shape) > 2:
            gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
        else:
            gray = face_img
            
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        sharpness = np.var(laplacian)
        quality_scores['sharpness'] = min(100, max(0, 100 * (sharpness / 500.0)))
        if sharpness < 100:
            feedback.append("ภาพไม่คมชัด อาจเป็นเพราะกล้องเคลื่อนไหวหรือโฟกัสไม่ดี")
        
        # ตรวจสอบคอนทราสต์
        if len(face_img.shape) > 2:
            gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
        else:
            gray = face_img
            
        contrast = gray.std()
        quality_scores['contrast'] = min(100, max(0, 100 * (contrast / 80.0)))
        if contrast < 20:
            feedback.append("ภาพมีคอนทราสต์ต่ำ อาจทำให้ยากต่อการจดจำ")
        
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