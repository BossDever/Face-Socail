# FaceSocial
![CI](https://github.com/BossDever/Face-Socail/workflows/CI/badge.svg)

แพลตฟอร์มโซเชียลมีเดียด้วยเทคโนโลยีจดจำใบหน้า

## ภาพรวมโครงการ

**FaceSocial** คือแพลตฟอร์มโซเชียลมีเดียนวัตกรรมใหม่ที่ผสมผสานเทคโนโลยีจดจำใบหน้าเข้ากับฟีเจอร์โซเชียลมีเดียมาตรฐาน เพื่อสร้างประสบการณ์ที่ปลอดภัยและมีประสิทธิภาพมากขึ้น

## โครงสร้างโปรเจค

โปรเจคประกอบด้วย 3 ส่วนหลัก:

1. **Frontend**: Next.js 15 & React 19 application
2. **Backend**: Express.js & TypeScript RESTful API
3. **AI Server**: Simple HTTP server สำหรับ facial recognition API (ใช้งานในช่วงพัฒนา)

## การติดตั้ง

### ข้อกำหนดเบื้องต้น

- Node.js 20 LTS
- Python 3.10+
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose (optional)

### การเริ่มต้นระบบ

```bash
# เริ่ม PostgreSQL และ Redis ด้วย Docker Compose
docker-compose up -d

# เริ่ม Backend
cd backend
npm install
npm run dev

# เริ่ม AI Server (Simple Version)
cd ai-server
# เปิดไฟล์ run-simple-server.bat หรือรันคำสั่ง:
python simple-app.py

# เริ่ม Frontend
cd frontend
npm install
npm run dev
```

## การพัฒนา

### Frontend (Port 3000)
Frontend พัฒนาด้วย Next.js 15 และ React 19 พร้อม Tailwind CSS

### Backend (Port 3001)
Backend พัฒนาด้วย Express.js และ TypeScript พร้อม Prisma ORM

### AI Server (Port 3002)
ในช่วงพัฒนาใช้ Simple HTTP Server เพื่อจำลองการตอบกลับของ AI Service
