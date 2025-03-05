import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, login, faceLogin, register, LoginCredentials, FaceLoginData, RegisterData } from '@/lib/api';

// Interface สำหรับ Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  faceLogin: (data: FaceLoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// สร้าง Auth Store ด้วย Zustand
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Action สำหรับการเข้าสู่ระบบ
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await login(credentials);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
            isLoading: false,
          });
          throw error;
        }
      },
      
      // Action สำหรับการเข้าสู่ระบบด้วยใบหน้า
      faceLogin: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await faceLogin(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วยใบหน้า',
            isLoading: false,
          });
          throw error;
        }
      },
      
      // Action สำหรับการลงทะเบียน
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await register(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน',
            isLoading: false,
          });
          throw error;
        }
      },
      
      // Action สำหรับการออกจากระบบ
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage', // ชื่อสำหรับ localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);