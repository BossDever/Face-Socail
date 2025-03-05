import cv2
import numpy as np

def preprocess_face(img, required_size=(160, 160)):
    """
    แปลงภาพใบหน้าให้พร้อมสำหรับการวิเคราะห์
    
    Args:
        img: ภาพใบหน้า
        required_size: ขนาดที่ต้องการ (default: 160x160)
        
    Returns:
        preprocessed_face: ภาพที่ผ่านการแปลงแล้ว
    """
    # แปลงเป็น RGB ถ้าจำเป็น
    if len(img.shape) == 2:  # Grayscale
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    elif img.shape[2] == 4:  # RGBA
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
    
    # ปรับขนาด
    img = cv2.resize(img, required_size)
    
    # แปลงให้อยู่ในช่วง [-1, 1]
    img = img.astype(np.float32)
    img = (img - 127.5) / 128.0
    
    return img

def extract_face(img, face_box, margin=20):
    """
    ตัดใบหน้าจากภาพใหญ่โดยใช้พิกัดที่ได้จาก face detection
    
    Args:
        img: ภาพต้นฉบับ
        face_box: พิกัดกรอบใบหน้า [x, y, width, height]
        margin: ระยะขอบเพิ่มเติม (default: 20 pixels)
        
    Returns:
        face_img: ภาพใบหน้าที่ตัดแล้ว
    """
    x, y, width, height = face_box
    
    # คำนวณพิกัดด้วยการเพิ่ม margin
    img_height, img_width = img.shape[:2]
    
    x1 = max(0, x - margin)
    y1 = max(0, y - margin)
    x2 = min(img_width, x + width + margin)
    y2 = min(img_height, y + height + margin)
    
    # ตัดใบหน้า
    face_img = img[y1:y2, x1:x2]
    
    return face_img
