'use client';

import React from 'react';
import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const CTASection: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return null; // ไม่แสดง CTA ถ้าล็อกอินแล้ว
  }
  
  return (
    <section className="py-16 bg-blue-600 dark:bg-blue-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">พร้อมที่จะเริ่มต้นใช้งานแล้วหรือยัง?</h2>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
          สมัครสมาชิกวันนี้และค้นพบประสบการณ์โซเชียลมีเดียที่ปลอดภัยและมีประสิทธิภาพมากขึ้น
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            href="/register" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            สมัครสมาชิก
          </Link>
          <Link 
            href="/login" 
            className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          >
            <LogIn className="h-5 w-5 mr-2" />
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </section>
  );
};