import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// กำหนดประเภทข้อมูลสำหรับการลงทะเบียน
export interface RegisterFormData {
  // ข้อมูลส่วนตัว (ขั้นตอนที่ 1)
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;

  // ข้อมูลการยินยอม (ขั้นตอนที่ 2)
  consentToFaceRecognition: boolean;
  
  // ข้อมูลใบหน้า (ขั้นตอนที่ 2)
  faceImages: string[];
  
  // ข้อมูลขั้นตอน
  currentStep: number;
  isFirstStepValid: boolean;
}

// กำหนดประเภทสำหรับ Store
interface RegisterState {
  // ข้อมูลฟอร์ม
  formData: RegisterFormData;
  
  // สถานะการตรวจสอบ
  isCheckingUsername: boolean;
  isUsernameAvailable: boolean | null;
  isCheckingEmail: boolean;
  isEmailAvailable: boolean | null;
  
  // Actions
  setFormField: <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => void;
  setFormFields: (fields: Partial<RegisterFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  addFaceImage: (imageUrl: string) => void;
  removeFaceImage: (index: number) => void;
  clearForm: () => void;
  
  // การตรวจสอบความพร้อมของแต่ละขั้นตอน
  setFirstStepValid: (isValid: boolean) => void;
  
  // สถานะการตรวจสอบชื่อผู้ใช้และอีเมล
  setUsernameCheckStatus: (isChecking: boolean, isAvailable: boolean | null) => void;
  setEmailCheckStatus: (isChecking: boolean, isAvailable: boolean | null) => void;
}

// ค่าเริ่มต้นสำหรับฟอร์ม
const initialFormData: RegisterFormData = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  consentToFaceRecognition: false,
  faceImages: [],
  currentStep: 1,
  isFirstStepValid: false,
};

// สร้าง Store สำหรับการลงทะเบียน
export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      // สถานะเริ่มต้น
      formData: { ...initialFormData },
      isCheckingUsername: false,
      isUsernameAvailable: null,
      isCheckingEmail: false,
      isEmailAvailable: null,
      
      // Actions
      setFormField: (field, value) => set((state) => ({
        formData: {
          ...state.formData,
          [field]: value,
        },
      })),
      
      setFormFields: (fields) => set((state) => ({
        formData: {
          ...state.formData,
          ...fields,
        },
      })),
      
      nextStep: () => set((state) => ({
        formData: {
          ...state.formData,
          currentStep: state.formData.currentStep + 1,
        },
      })),
      
      prevStep: () => set((state) => ({
        formData: {
          ...state.formData,
          currentStep: Math.max(1, state.formData.currentStep - 1),
        },
      })),
      
      addFaceImage: (imageUrl) => set((state) => ({
        formData: {
          ...state.formData,
          faceImages: [...state.formData.faceImages, imageUrl],
        },
      })),
      
      removeFaceImage: (index) => set((state) => ({
        formData: {
          ...state.formData,
          faceImages: state.formData.faceImages.filter((_, i) => i !== index),
        },
      })),
      
      clearForm: () => set({
        formData: { ...initialFormData },
        isCheckingUsername: false,
        isUsernameAvailable: null,
        isCheckingEmail: false,
        isEmailAvailable: null,
      }),
      
      setFirstStepValid: (isValid) => set((state) => ({
        formData: {
          ...state.formData,
          isFirstStepValid: isValid,
        },
      })),
      
      setUsernameCheckStatus: (isChecking, isAvailable) => set({
        isCheckingUsername: isChecking,
        isUsernameAvailable: isAvailable,
      }),
      
      setEmailCheckStatus: (isChecking, isAvailable) => set({
        isCheckingEmail: isChecking,
        isEmailAvailable: isAvailable,
      }),
    }),
    {
      name: 'register-form-storage', // ชื่อสำหรับเก็บใน localStorage
      partialize: (state) => ({ formData: state.formData }), // เก็บเฉพาะข้อมูลฟอร์ม
    }
  )
);