import cv2
import numpy as np
from mtcnn import MTCNN
import os

# Initialize MTCNN detector
detector = MTCNN()

def detect_faces(image_data):
    """
    Detect faces in the given image using MTCNN
    
    Args:
        image_data: numpy array of image data
        
    Returns:
        List of dictionaries containing face detection results
    """
    # Convert to RGB if needed
    if len(image_data.shape) == 2:  # Grayscale
        image_data = cv2.cvtColor(image_data, cv2.COLOR_GRAY2RGB)
    elif image_data.shape[2] == 4:  # RGBA
        image_data = cv2.cvtColor(image_data, cv2.COLOR_RGBA2RGB)
    
    # Detect faces
    faces = detector.detect_faces(image_data)
    
    return faces
