'use client';

import React from 'react';
import Link from 'next/link';
import { Camera } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Camera className="h-8 w-8 text-blue-500" />
            <span className="ml-2 font-bold text-xl text-gray-900 dark:text-white">FaceSocial</span>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-4 mb-4 md:mb-0">
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              เกี่ยวกับเรา
            </Link>
            <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              ความเป็นส่วนตัว
            </Link>
            <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              เงื่อนไขการใช้งาน
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              ติดต่อเรา
            </Link>
          </div>
          
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FaceSocial. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};