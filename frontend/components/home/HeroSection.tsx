'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-32 sm:px-6 md:py-40 lg:py-48">
        <div className="text-center md:text-left md:max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white"
          >
            <span className="block">โซเชียลมีเดียยุคใหม่</span>
            <span className="block text-blue-600 dark:text-blue-400">ด้วยเทคโนโลยีจดจำใบหน้า</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300"
          >
            เชื่อมต่อกับเพื่อนและแบ่งปันช่วงเวลาสำคัญด้วยความปลอดภัยสูงสุด ด้วยระบบยืนยันตัวตนและแท็กรูปภาพที่ใช้เทคโนโลยีจดจำใบหน้า
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
          >
            {!isAuthenticated ? (
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                เริ่มต้นใช้งานฟรี
              </Link>
            ) : (
              <Link 
                href="/feed" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
              >
                ไปยังฟีดของคุณ
              </Link>
            )}
            
            <Link 
              href="/about" 
              className="bg-transparent border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
            >
              เรียนรู้เพิ่มเติม
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 w-2/5 h-4/5">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-full h-full"
        >
          <div className="absolute top-0 right-24 w-72 h-72 bg-blue-500 rounded-full opacity-10"></div>
          <div className="absolute bottom-20 right-12 w-48 h-48 bg-indigo-500 rounded-full opacity-10"></div>
          <div className="absolute top-40 right-8 w-64 h-64 bg-purple-500 rounded-full opacity-10"></div>
        </motion.div>
      </div>
    </section>
  );
};
