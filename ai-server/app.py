import tensorflow as tf
print(tf.test.is_built_with_cuda())  # ตรวจสอบว่า TensorFlow ถูกคอมไพล์พร้อม CUDA หรือไม่
print(tf.test.is_gpu_available())    # ตรวจสอบว่าพบ GPU หรือไม่ (เก่า)
print(tf.config.list_physical_devices('GPU'))  # ตรวจสอบ GPU ที่ใช้งานได้ (ใหม่)
