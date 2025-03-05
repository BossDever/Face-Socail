import cv2
import numpy as np
import logging

# ตั้งค่า logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def preprocess_face(img, required_size=(160, 160)):
    """
    แปลงภาพใบหน้าให้พร้อมสำหรับการวิเคราะห์
    
    Args:
        img: ภาพใบหน้า
        required_size: ขนาดที่ต้องการ (default: 160x160)
        
    Returns:
        preprocessed_face: ภาพที่ผ่านการแปลงแล้ว หรือ None ในกรณีที่มีข้อผิดพลาด
    """
    try:
        # ตรวจสอบว่า img ไม่เป็น None และมีข้อมูล
        if img is None or img.size == 0:
            logger.error("ภาพใบหน้าเป็น None หรือไม่มีข้อมูล")
            return None
            
        # ตรวจสอบขนาดรูปภาพ
        if img.shape[0] == 0 or img.shape[1] == 0:
            logger.error(f"รูปภาพมีขนาดไม่ถูกต้อง: {img.shape}")
            return None
            
        # ตรวจสอบว่า required_size เป็น tuple ที่ถูกต้อง
        if not isinstance(required_size, tuple) or len(required_size) != 2:
            logger.warning(f"required_size ไม่ถูกต้อง: {required_size}, ใช้ค่าเริ่มต้น (160, 160)")
            required_size = (160, 160)
            
        # แปลงเป็น RGB ถ้าจำเป็น
        if len(img.shape) == 2:  # Grayscale
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
        elif img.shape[2] == 4:  # RGBA
            img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
        
        # ปรับขนาด
        img = cv2.resize(img, (required_size[0], required_size[1]))
        
        # แปลงให้อยู่ในช่วง [-1, 1]
        img = img.astype(np.float32)
        img = (img - 127.5) / 128.0
        
        return img
        
    except Exception as e:
        logger.error(f"เกิดข้อผิดพลาดในการ preprocess ใบหน้า: {str(e)}")
        return None

def extract_face(img, face_box, margin=20):
    """
    ตัดใบหน้าจากภาพใหญ่โดยใช้พิกัดที่ได้จาก face detection
    
    Args:
        img: ภาพต้นฉบับ
        face_box: พิกัดกรอบใบหน้า [x, y, width, height]
        margin: ระยะขอบเพิ่มเติม (default: 20 pixels)
        
    Returns:
        face_img: ภาพใบหน้าที่ตัดแล้ว หรือ None ในกรณีที่มีข้อผิดพลาด
    """
    try:
        # ตรวจสอบว่า img ไม่เป็น None และมีข้อมูล
        if img is None or img.size == 0:
            logger.error("ภาพต้นฉบับเป็น None หรือไม่มีข้อมูล")
            return None
            
        # ตรวจสอบว่า face_box ถูกต้อง
        if face_box is None or len(face_box) != 4:
            logger.error(f"face_box ไม่ถูกต้อง: {face_box}")
            return None
            
        x, y, width, height = face_box
        
        # ตรวจสอบว่าค่าเป็นจำนวนเต็ม
        try:
            x, y, width, height = int(x), int(y), int(width), int(height)
        except (ValueError, TypeError):
            logger.error(f"ไม่สามารถแปลงค่า face_box เป็นจำนวนเต็มได้: {face_box}")
            return None
            
        # ตรวจสอบว่า width และ height มีค่าเป็นบวก
        if width <= 0 or height <= 0:
            logger.error(f"ความกว้างหรือความสูงไม่ถูกต้อง: width={width}, height={height}")
            return None
            
        # คำนวณพิกัดด้วยการเพิ่ม margin
        img_height, img_width = img.shape[:2]
        
        x1 = max(0, x - margin)
        y1 = max(0, y - margin)
        x2 = min(img_width, x + width + margin)
        y2 = min(img_height, y + height + margin)
        
        # ตรวจสอบว่าพิกัดที่คำนวณได้ถูกต้อง
        if x1 >= x2 or y1 >= y2:
            logger.error(f"พิกัดที่คำนวณได้ไม่ถูกต้อง: x1={x1}, y1={y1}, x2={x2}, y2={y2}")
            return None
            
        # ตัดใบหน้า
        face_img = img[y1:y2, x1:x2]
        
        # ตรวจสอบว่าภาพที่ตัดได้มีข้อมูล
        if face_img.size == 0:
            logger.error("ภาพใบหน้าที่ตัดได้ไม่มีข้อมูล")
            return None
            
        return face_img
        
    except Exception as e:
        logger.error(f"เกิดข้อผิดพลาดในการตัดภาพใบหน้า: {str(e)}")
        return None