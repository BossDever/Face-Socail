import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRegisterStore } from '@/stores/registerStore';
import { ArrowRight, Check, X, Loader2 } from 'lucide-react';
import { checkDuplicate } from '@/lib/api';
import { debounce } from 'lodash';

// สร้างฟังก์ชันดีเบาวน์ซ์ภายนอกหากใช้ lodash ไม่ได้
const createDebounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// คอมโพเนนต์ RegisterStepOne
const RegisterStepOne: React.FC = () => {
  const {
    formData,
    setFormField,
    nextStep,
    setFirstStepValid,
    isCheckingUsername,
    isUsernameAvailable,
    isCheckingEmail,
    isEmailAvailable,
    setUsernameCheckStatus,
    setEmailCheckStatus,
  } = useRegisterStore();

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  // Refs สำหรับการเช็คว่าฟอร์มถูกส่งหรือไม่
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formIsValid = useRef(false);

  // ฟังก์ชันสำหรับการดีเบาวน์ซ์การตรวจสอบชื่อผู้ใช้และอีเมล
  const debouncedCheckUsername = debounce(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameCheckStatus(false, null);
      return;
    }

    try {
      setUsernameCheckStatus(true, null);
      const result = await checkDuplicate('username', username);
      setUsernameCheckStatus(false, !result.isDuplicate);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameCheckStatus(false, null);
    }
  }, 500);

  const debouncedCheckEmail = debounce(async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailCheckStatus(false, null);
      return;
    }

    try {
      setEmailCheckStatus(true, null);
      const result = await checkDuplicate('email', email);
      setEmailCheckStatus(false, !result.isDuplicate);
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailCheckStatus(false, null);
    }
  }, 500);

  // ตรวจสอบความแข็งแรงของรหัสผ่าน
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const score = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars, isLongEnough].filter(Boolean).length;

    if (score <= 2) setPasswordStrength('weak');
    else if (score <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  // ตรวจสอบความถูกต้องของฟอร์ม
  const validateForm = () => {
    const { firstName, lastName, email, username, password } = formData;
    
    const isPasswordValid = password.length >= 8;
    const doPasswordsMatch = password === passwordConfirm;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isUsernameValid = username.length >= 3;

    const isFormValid = !!(
      firstName &&
      lastName &&
      isEmailValid &&
      isUsernameValid &&
      isPasswordValid &&
      doPasswordsMatch &&
      isUsernameAvailable &&
      isEmailAvailable
    );

    formIsValid.current = isFormValid;
    setFirstStepValid(isFormValid);
    return isFormValid;
  };

  // ตรวจสอบความถูกต้องของฟอร์มเมื่อข้อมูลเปลี่ยนแปลง
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [formData, passwordConfirm, isUsernameAvailable, isEmailAvailable, formSubmitted]);

  // เช็คว่ารหัสผ่านตรงกันหรือไม่
  useEffect(() => {
    if (formData.password || passwordConfirm) {
      setPasswordMatch(formData.password === passwordConfirm);
    } else {
      setPasswordMatch(null);
    }
  }, [formData.password, passwordConfirm]);

  // เช็คความแข็งแรงของรหัสผ่าน
  useEffect(() => {
    checkPasswordStrength(formData.password);
  }, [formData.password]);

  // เช็คชื่อผู้ใช้ซ้ำ
  useEffect(() => {
    debouncedCheckUsername(formData.username);
  }, [formData.username]);

  // เช็คอีเมลซ้ำ
  useEffect(() => {
    debouncedCheckEmail(formData.email);
  }, [formData.email]);

  // ฟังก์ชันสำหรับการส่งฟอร์ม
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ชื่อจริง */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ชื่อจริง <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormField('firstName', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                formSubmitted && !formData.firstName
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {formSubmitted && !formData.firstName && (
              <p className="mt-1 text-sm text-red-500">กรุณากรอกชื่อจริง</p>
            )}
          </div>

          {/* นามสกุล */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormField('lastName', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                formSubmitted && !formData.lastName
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {formSubmitted && !formData.lastName && (
              <p className="mt-1 text-sm text-red-500">กรุณากรอกนามสกุล</p>
            )}
          </div>
        </div>

        {/* อีเมล */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            อีเมล <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormField('email', e.target.value)}
              className={`w-full pl-4 pr-10 py-2 rounded-lg border ${
                formSubmitted && (!formData.email || isEmailAvailable === false)
                  ? 'border-red-500 dark:border-red-500'
                  : isEmailAvailable
                  ? 'border-green-500 dark:border-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            <div className="absolute right-3 top-2.5">
              {isCheckingEmail ? (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              ) : isEmailAvailable === true ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : isEmailAvailable === false ? (
                <X className="h-5 w-5 text-red-500" />
              ) : null}
            </div>
          </div>
          {formSubmitted && !formData.email && (
            <p className="mt-1 text-sm text-red-500">กรุณากรอกอีเมล</p>
          )}
          {formSubmitted && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
            <p className="mt-1 text-sm text-red-500">กรุณากรอกอีเมลที่ถูกต้อง</p>
          )}
          {isEmailAvailable === false && (
            <p className="mt-1 text-sm text-red-500">อีเมลนี้ถูกใช้งานแล้ว</p>
          )}
        </div>

        {/* ชื่อผู้ใช้ */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ชื่อผู้ใช้ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormField('username', e.target.value)}
              className={`w-full pl-4 pr-10 py-2 rounded-lg border ${
                formSubmitted && (!formData.username || isUsernameAvailable === false)
                  ? 'border-red-500 dark:border-red-500'
                  : isUsernameAvailable
                  ? 'border-green-500 dark:border-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            <div className="absolute right-3 top-2.5">
              {isCheckingUsername ? (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              ) : isUsernameAvailable === true ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : isUsernameAvailable === false ? (
                <X className="h-5 w-5 text-red-500" />
              ) : null}
            </div>
          </div>
          {formSubmitted && !formData.username && (
            <p className="mt-1 text-sm text-red-500">กรุณากรอกชื่อผู้ใช้</p>
          )}
          {formSubmitted && formData.username && formData.username.length < 3 && (
            <p className="mt-1 text-sm text-red-500">ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร</p>
          )}
          {isUsernameAvailable === false && (
            <p className="mt-1 text-sm text-red-500">ชื่อผู้ใช้นี้ถูกใช้งานแล้ว</p>
          )}
        </div>

        {/* รหัสผ่าน */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            รหัสผ่าน <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormField('password', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              formSubmitted && (!formData.password || formData.password.length < 8)
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          
          {/* ตัวบ่งชี้ความแข็งแรงของรหัสผ่าน */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      passwordStrength === 'weak'
                        ? 'bg-red-500 w-1/3'
                        : passwordStrength === 'medium'
                        ? 'bg-yellow-500 w-2/3'
                        : 'bg-green-500 w-full'
                    }`}
                  ></div>
                </div>
                <span className="ml-2 text-xs">
                  {passwordStrength === 'weak'
                    ? 'อ่อน'
                    : passwordStrength === 'medium'
                    ? 'ปานกลาง'
                    : 'แข็งแกร่ง'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                รหัสผ่านควรมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรและตัวเลข
              </p>
            </div>
          )}
          
          {formSubmitted && !formData.password && (
            <p className="mt-1 text-sm text-red-500">กรุณากรอกรหัสผ่าน</p>
          )}
          
          {formSubmitted && formData.password && formData.password.length < 8 && (
            <p className="mt-1 text-sm text-red-500">รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร</p>
          )}
        </div>

        {/* ยืนยันรหัสผ่าน */}
        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={`w-full pl-4 pr-10 py-2 rounded-lg border ${
                formSubmitted && (!passwordConfirm || passwordMatch === false)
                  ? 'border-red-500 dark:border-red-500'
                  : passwordMatch === true
                  ? 'border-green-500 dark:border-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            
            {passwordConfirm && (
              <div className="absolute right-3 top-2.5">
                {passwordMatch ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          
          {formSubmitted && !passwordConfirm && (
            <p className="mt-1 text-sm text-red-500">กรุณายืนยันรหัสผ่าน</p>
          )}
          
          {formSubmitted && passwordConfirm && !passwordMatch && (
            <p className="mt-1 text-sm text-red-500">รหัสผ่านไม่ตรงกัน</p>
          )}
        </div>

        {/* ปุ่มดำเนินการต่อ */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ดำเนินการต่อ <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterStepOne;