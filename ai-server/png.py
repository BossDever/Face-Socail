import base64

# แปลงรูปภาพเป็น base64
with open("your_image.jpg", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

# เพิ่ม prefix สำหรับ base64 image
base64_image = f"data:image/jpeg;base64,{encoded_string}"

print(base64_image)  # คัดลอกผลลัพธ์นี้ไปใช้ใน API call