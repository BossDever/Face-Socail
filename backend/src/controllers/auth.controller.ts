import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { generateToken } from '../config/jwt';
import { z } from 'zod';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// กำหนด interfaces สำหรับ response จาก AI Service
interface EmbeddingResponse {
  status: string;
  embedding: number[];
  quality?: {
    score: number;
    feedback: string;
  };
  face_box?: number[];
}

interface CompareResponse {
  status: string;
  is_same_person: boolean;
  confidence: number;
  distance: number;
  threshold: number;
}

// Schema สำหรับตรวจสอบข้อมูลการลงทะเบียน
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  faceImages: z.array(z.string()).optional()
});

// Schema สำหรับตรวจสอบข้อมูลการเข้าสู่ระบบ
const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

// Schema สำหรับตรวจสอบข้อมูลการเข้าสู่ระบบด้วยใบหน้า
const faceLoginSchema = z.object({
  faceImage: z.string()
});

// ตรวจสอบว่า username หรือ email ซ้ำหรือไม่
export const checkDuplicate = async (req: Request, res: Response) => {
  try {
    const { field, value } = req.query;
    
    if (!field || !value || !['username', 'email'].includes(field as string)) {
      return res.status(400).json({ message: 'Invalid parameters' });
    }

    const whereClause = field === 'username' 
      ? { username: value as string }
      : { email: value as string };

    const user = await prisma.user.findUnique({
      where: whereClause
    });
    
    return res.status(200).json({ 
      isDuplicate: !!user,
      field
    });
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ลงทะเบียนผู้ใช้ใหม่
export const register = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบความถูกต้องของข้อมูล
    const validatedData = registerSchema.parse(req.body);
    
    // ตรวจสอบว่า username หรือ email ซ้ำหรือไม่
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: validatedData.username },
          { email: validatedData.email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // สร้าง face embeddings ถ้ามีรูปภาพใบหน้า
    let faceEmbeddingsData: number[][] | null = null;
    if (validatedData.faceImages && validatedData.faceImages.length > 0) {
      // ส่งรูปภาพไปยัง AI Service เพื่อสร้าง embeddings
      try {
        const embeddingsPromises = validatedData.faceImages.map(async (faceImage) => {
          const response = await axios.post<EmbeddingResponse>(
            `${process.env.AI_SERVICE_URL}/api/face/recognition/embeddings`,
            { image: faceImage },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.AI_SERVICE_API_KEY || ''
              }
            }
          );
          
          if (response.data.status === 'success') {
            return response.data.embedding;
          }
          return null;
        });
        
        const embeddings = await Promise.all(embeddingsPromises);
        
        // กรองเอาเฉพาะค่าที่ไม่ใช่ null
        const validEmbeddings = embeddings.filter((emb): emb is number[] => emb !== null);
        
        if (validEmbeddings.length > 0) {
          faceEmbeddingsData = validEmbeddings;
        }
      } catch (error) {
        console.error('Error generating face embeddings:', error);
        // ไม่ return error ออกไป เพราะสามารถลงทะเบียนได้โดยไม่มี face embeddings
      }
    }
    
    // สร้างผู้ใช้ใหม่
    const newUser = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        faceEmbeddings: faceEmbeddingsData ? JSON.stringify(faceEmbeddingsData) : undefined
      }
    });

    // สร้าง token
    const token = generateToken({ 
      id: newUser.id, 
      username: newUser.username 
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        hasFaceRecognition: !!faceEmbeddingsData
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input data', 
        errors: error.errors 
      });
    }
    
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// เข้าสู่ระบบด้วย username และรหัสผ่าน
export const login = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบความถูกต้องของข้อมูล
    const validatedData = loginSchema.parse(req.body);
    
    // หาผู้ใช้จาก username
    const user = await prisma.user.findUnique({
      where: { username: validatedData.username }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ตรวจสอบรหัสผ่าน
    const passwordMatch = await bcrypt.compare(validatedData.password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // สร้าง token
    const token = generateToken({ 
      id: user.id, 
      username: user.username 
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        hasFaceRecognition: !!user.faceEmbeddings
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input data', 
        errors: error.errors 
      });
    }
    
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// เข้าสู่ระบบด้วยใบหน้า
export const faceLogin = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบความถูกต้องของข้อมูล
    const validatedData = faceLoginSchema.parse(req.body);
    
    // ส่งรูปภาพไปยัง AI Service เพื่อสร้าง embedding
    let faceEmbedding: number[] | null = null;
    try {
      const response = await axios.post<EmbeddingResponse>(
        `${process.env.AI_SERVICE_URL}/api/face/recognition/embeddings`,
        { image: validatedData.faceImage },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.AI_SERVICE_API_KEY || ''
          }
        }
      );
      
      if (response.data.status !== 'success') {
        return res.status(400).json({ 
          message: 'Failed to process face image' 
        });
      }
      
      faceEmbedding = response.data.embedding;
    } catch (error) {
      console.error('Error processing face image:', error);
      return res.status(500).json({ 
        message: 'Error processing face image' 
      });
    }
    
    // ดึงทุกผู้ใช้ที่มี face embeddings - แก้ไขวิธีการตรวจสอบว่าไม่เป็น null
    const users = await prisma.user.findMany({
      where: {
        // ใช้ NOT ร่วมกับ is แทนการใช้ not: null โดยตรง
        NOT: {
          faceEmbeddings: {
            equals: undefined
          }
        }
      }
    });
    
    // ค้นหาผู้ใช้ที่ใบหน้าตรงกัน
    let matchedUser = null;
    let highestConfidence = 0;
    
    for (const user of users) {
      if (!user.faceEmbeddings) continue;
      
      const userEmbeddings = JSON.parse(user.faceEmbeddings as string) as number[][];
      
      // เปรียบเทียบ embedding กับทุก embedding ของผู้ใช้
      for (const userEmbedding of userEmbeddings) {
        try {
          const compareResponse = await axios.post<CompareResponse>(
            `${process.env.AI_SERVICE_URL}/api/face/recognition/compare`,
            { 
              embedding1: faceEmbedding, 
              embedding2: userEmbedding,
              threshold: 0.7 // ค่าเริ่มต้น
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.AI_SERVICE_API_KEY || ''
              }
            }
          );
          
          if (compareResponse.data.status === 'success' && compareResponse.data.is_same_person) {
            // ถ้าความมั่นใจสูงกว่าที่พบก่อนหน้านี้
            if (compareResponse.data.confidence > highestConfidence) {
              highestConfidence = compareResponse.data.confidence;
              matchedUser = user;
            }
          }
        } catch (error) {
          console.error('Error comparing faces:', error);
          // ข้ามหากมีข้อผิดพลาดในการเปรียบเทียบ
        }
      }
    }
    
    if (!matchedUser) {
      return res.status(401).json({ message: 'Face not recognized' });
    }

    // สร้าง token
    const loginToken = generateToken({ 
      id: matchedUser.id, 
      username: matchedUser.username 
    });

    return res.status(200).json({
      message: 'Face login successful',
      token: loginToken,
      user: {
        id: matchedUser.id,
        username: matchedUser.username,
        email: matchedUser.email,
        firstName: matchedUser.firstName,
        lastName: matchedUser.lastName,
        hasFaceRecognition: true
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input data', 
        errors: error.errors 
      });
    }
    
    console.error('Error during face login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
