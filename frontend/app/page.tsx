import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sun, Moon, LogIn, UserPlus, Bell, MessageSquare, Search, Menu, X } from 'lucide-react';

// สร้าง ThemeProvider สำหรับรองรับ Dark Mode
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // ตรวจสอบ preference จาก localStorage หรือ system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { isDarkMode, toggleTheme })
      )}
    </div>
  );
};

// NavBar Component
const NavBar = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <Camera className="h-8 w-8 text-blue-500" />
              <span className="ml-2 font-bold text-xl text-gray-900 dark:text-white">FaceSocial</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <a href="#" className="text-blue-500 font-medium px-3 py-2 rounded-md">หน้าแรก</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 rounded-md">ค้นพบ</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 rounded-md">กิจกรรม</a>
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
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button className="rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-900"></span>
            </button>
            
            <button className="rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
              <MessageSquare className="h-5 w-5" />
            </button>
            
            <a 
              href="/login" 
              className="text-blue-500 px-4 py-2 rounded-md border border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-300 flex items-center"
            >
              <LogIn className="h-4 w-4 mr-2" />
              เข้าสู่ระบบ
            </a>
            
            <a 
              href="/register" 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              สมัครสมาชิก
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Open menu"
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
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-blue-500">หน้าแรก</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">ค้นพบ</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">กิจกรรม</a>
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
                {isDarkMode ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
                {isDarkMode ? 'โหมดสว่าง' : 'โหมดมืด'}
              </button>
              
              <a 
                href="/login" 
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogIn className="h-5 w-5 mr-3" />
                เข้าสู่ระบบ
              </a>
              
              <a 
                href="/register" 
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <UserPlus className="h-5 w-5 mr-3" />
                สมัครสมาชิก
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// Footer Component
const Footer = ({ isDarkMode }) => {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Camera className="h-8 w-8 text-blue-500" />
            <span className="ml-2 font-bold text-xl text-gray-900 dark:text-white">FaceSocial</span>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">เกี่ยวกับเรา</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">ความเป็นส่วนตัว</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">เงื่อนไขการใช้งาน</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">ติดต่อเรา</a>
          </div>
          
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FaceSocial. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

// Hero Section Component
const HeroSection = () => {
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
            <a 
              href="/register" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              เริ่มต้นใช้งานฟรี
            </a>
            
            <a 
              href="/about" 
              className="bg-transparent border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
            >
              เรียนรู้เพิ่มเติม
            </a>
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

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">ฟีเจอร์หลัก</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            ค้นพบประสบการณ์โซเชียลมีเดียที่ปลอดภัยและสะดวกกว่าเดิมด้วยเทคโนโลยีจดจำใบหน้า
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={LogIn}
            title="การเข้าสู่ระบบด้วยใบหน้า"
            description="เข้าสู่ระบบได้อย่างรวดเร็วและปลอดภัยด้วยใบหน้าของคุณ ไม่ต้องจำรหัสผ่านอีกต่อไป"
            delay={0.1}
          />
          <FeatureCard 
            icon={Camera}
            title="แท็กใบหน้าอัตโนมัติ"
            description="ระบบจะตรวจจับและแท็กเพื่อนในรูปภาพของคุณโดยอัตโนมัติ ช่วยให้จัดการรูปภาพได้สะดวกยิ่งขึ้น"
            delay={0.2}
          />
          <FeatureCard 
            icon={Bell}
            title="การแจ้งเตือนที่เกี่ยวข้อง"
            description="รับการแจ้งเตือนเมื่อมีคนแท็กคุณในรูปภาพหรือเมื่อระบบตรวจพบใบหน้าของคุณในโพสต์ใหม่"
            delay={0.3}
          />
          <FeatureCard 
            icon={MessageSquare}
            title="แชทแบบ Real-time"
            description="พูดคุยกับเพื่อนแบบเรียลไทม์ด้วยระบบแชทที่รวดเร็วและใช้งานง่าย"
            delay={0.4}
          />
          <FeatureCard 
            icon={Search}
            title="ค้นหาด้วยใบหน้า"
            description="ค้นหารูปภาพที่มีคุณหรือเพื่อนของคุณด้วยเทคโนโลยีการค้นหาด้วยใบหน้า"
            delay={0.5}
          />
          <FeatureCard 
            icon={UserPlus}
            title="การแนะนำเพื่อน"
            description="พบเพื่อนใหม่และเชื่อมต่อกับผู้คนที่มีความสนใจคล้ายคุณด้วยระบบแนะนำอัจฉริยะ"
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  return (
    <section className="py-16 bg-blue-600 dark:bg-blue-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">พร้อมที่จะเริ่มต้นใช้งานแล้วหรือยัง?</h2>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
          สมัครสมาชิกวันนี้และค้นพบประสบการณ์โซเชียลมีเดียที่ปลอดภัยและมีประสิทธิภาพมากขึ้น
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a 
            href="/register" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            สมัครสมาชิก
          </a>
          <a 
            href="/login" 
            className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          >
            <LogIn className="h-5 w-5 mr-2" />
            เข้าสู่ระบบ
          </a>
        </div>
      </div>
    </section>
  );
};

// Main HomePage Component
const HomePage = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
        <NavBar />
        <main className="flex-grow pt-16">
          <HeroSection />
          <FeaturesSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default HomePage;