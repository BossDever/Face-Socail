'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Sun, Moon, LogIn, UserPlus, Bell, MessageSquare, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuthStore } from '@/stores/authStore';

export const NavBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo และ Brand */}
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 flex items-center"
            >
              <Link href="/" className="flex items-center">
                <Camera className="h-8 w-8 text-blue-500" />
                <span className="ml-2 font-bold text-xl text-gray-900 dark:text-white">FaceSocial</span>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link href="/" className="text-blue-500 font-medium px-3 py-2 rounded-md">หน้าแรก</Link>
              <Link href="/discover" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 rounded-md">ค้นพบ</Link>
              <Link href="/activity" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 rounded-md">กิจกรรม</Link>
            </div>
          </div>
          
          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text"
                placeholder="ค้นหา..."
                className="bg-gray-100 dark:bg-gray-800 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            
            <button 
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {isAuthenticated ? (
              <>
                <button className="rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-900"></span>
                </button>
                
                <button className="rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                  <MessageSquare className="h-5 w-5" />
                </button>
                
                <div className="relative group">
                  <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 focus:outline-none">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user?.firstName?.charAt(0) || user?.username?.charAt(0) || <User className="h-5 w-5" />}
                    </div>
                    <span className="ml-2">{user?.firstName || user?.username}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      โปรไฟล์
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      ตั้งค่า
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-blue-500 px-4 py-2 rounded-md border border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-300 flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  เข้าสู่ระบบ
                </Link>
                
                <Link 
                  href="/register" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              หน้าแรก
            </Link>
            <Link 
              href="/discover" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              ค้นพบ
            </Link>
            <Link 
              href="/activity" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              กิจกรรม
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 space-y-1">
              <div className="relative mx-2 mb-4">
                <input 
                  type="text"
                  placeholder="ค้นหา..."
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              
              <button 
                onClick={toggleTheme}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
                {theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}
              </button>
              
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3" />
                    โปรไฟล์
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5 mr-3" />
                    เข้าสู่ระบบ
                  </Link>
                  
                  <Link 
                    href="/register" 
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="h-5 w-5 mr-3" />
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};