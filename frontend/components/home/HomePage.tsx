'use client';

import React from 'react';
import { ThemeProvider } from '../common/ThemeProvider';
import { NavBar } from '../common/NavBar';
import { Footer } from '../common/Footer';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { CTASection } from './CTASection';
import { useAuthStore } from '@/stores/authStore';

const HomePage: React.FC = () => {
  // เช็คว่ามีการเชื่อมต่อกับ Auth Store หรือไม่
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
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