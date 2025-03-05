import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

// ขยาย interface ของ Express.Request เพื่อให้มี user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // ตรวจสอบว่ามี Authorization header หรือไม่
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // ดึง token และตรวจสอบความถูกต้อง
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // เก็บข้อมูลผู้ใช้ไว้ใน request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
