import axios from 'axios';

// กำหนด Base URL สำหรับ API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// สร้าง Axios instance พร้อมกับกำหนดค่าเริ่มต้น
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor สำหรับการจัดการ Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API สำหรับการตรวจสอบสถานะ API
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('API Health Check Error:', error);
    throw error;
  }
};

// Types สำหรับข้อมูลผู้ใช้
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  hasFaceRecognition: boolean;
}

// Types สำหรับข้อมูลการเข้าสู่ระบบ
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface FaceLoginData {
  faceImage: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// API สำหรับการเข้าสู่ระบบ
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

// API สำหรับการเข้าสู่ระบบด้วยใบหน้า
export const faceLogin = async (data: FaceLoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/face-login', data);
    return response.data;
  } catch (error) {
    console.error('Face Login Error:', error);
    throw error;
  }
};

// Types สำหรับข้อมูลการลงทะเบียน
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  faceImages?: string[];
}

// API สำหรับการลงทะเบียน
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Register Error:', error);
    throw error;
  }
};

// API สำหรับการตรวจสอบข้อมูลซ้ำ
export const checkDuplicate = async (field: 'username' | 'email', value: string): Promise<{ isDuplicate: boolean; field: string }> => {
  try {
    const response = await apiClient.get(`/auth/check-duplicate?field=${field}&value=${value}`);
    return response.data;
  } catch (error) {
    console.error('Check Duplicate Error:', error);
    throw error;
  }
};