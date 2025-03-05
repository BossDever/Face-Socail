# FaceSocial
![CI](https://github.com/BossDever/Face-Socail/workflows/CI/badge.svg)

แพลตฟอร์มโซเชียลมีเดียด้วยเทคโนโลยีจดจำใบหน้า

## ภาพรวมโครงการ

**FaceSocial** คือแพลตฟอร์มโซเชียลมีเดียนวัตกรรมใหม่ที่ผสมผสานเทคโนโลยีจดจำใบหน้าเข้ากับฟีเจอร์โซเชียลมีเดียมาตรฐาน เพื่อสร้างประสบการณ์ที่ปลอดภัยและมีประสิทธิภาพมากขึ้น

## โครงสร้างโปรเจค

โปรเจคประกอบด้วย 3 ส่วนหลัก:

1. **Frontend**: Next.js 15 & React 19 application
2. **Backend**: Express.js & TypeScript RESTful API
3. **AI Server**: Python Flask API for face detection and recognition

## การติดตั้ง

รายละเอียดการติดตั้งจะเพิ่มเติมในภายหลัง

### ข้อกำหนดเบื้องต้น

- Node.js 20 LTS
- Python 3.10+
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose (optional)

### การตั้งค่า Database

```bash
# เริ่ม PostgreSQL และ Redis ด้วย Docker Compose
docker-compose up -d

# เริ่ม Prisma migration
cd backend
npm run prisma:migrate

## การพัฒนา

รายละเอียดการพัฒนาจะเพิ่มเติมในภายหลัง