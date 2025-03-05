import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (payload: any): string => {
  // ใช้ as string เพื่อบอก TypeScript ว่า JWT_SECRET เป็น string แน่นอน
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  try {
    // ใช้ as string เพื่อบอก TypeScript ว่า JWT_SECRET เป็น string แน่นอน
    return jwt.verify(token, JWT_SECRET as jwt.Secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
