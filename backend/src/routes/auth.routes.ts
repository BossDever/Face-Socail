import { Router } from 'express';
import { register, login, faceLogin, checkDuplicate } from '../controllers/auth.controller';

const router = Router();

// ตรวจสอบข้อมูลซ้ำ
router.get('/check-duplicate', checkDuplicate);

// ลงทะเบียนผู้ใช้ใหม่
router.post('/register', register);

// เข้าสู่ระบบด้วย username และรหัสผ่าน
router.post('/login', login);

// เข้าสู่ระบบด้วยใบหน้า
router.post('/face-login', faceLogin);

export default router;
