'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRegisterStore } from '@/stores/registerStore';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { NavBar } from '@/components/common/NavBar';
import { Footer } from '@/components/common/Footer';
import RegisterStepOne from '@/components/register/RegisterStepOne';
import RegisterStepTwo from '@/components/register/RegisterStepTwo';
import RegisterStepThree from '@/components/register/RegisterStepThree';
import StepIndicator from '@/components/register/StepIndicator';

const RegisterPage = () => {
  const { formData, clearForm } = useRegisterStore();
  const { currentStep } = formData;

  // เคลียร์ฟอร์มเมื่อโหลดครั้งแรก (uncomment ถ้าต้องการ)
  // useEffect(() => {
  //   clearForm();
  // }, [clearForm]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
        <NavBar />
        
        <main className="flex-grow pt-16">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                  สมัครสมาชิก FaceSocial
                </h1>
                
                <StepIndicator currentStep={currentStep} />
                
                <div className="mt-8">
                  {currentStep === 1 && <RegisterStepOne />}
                  {currentStep === 2 && <RegisterStepTwo />}
                  {currentStep === 3 && <RegisterStepThree />}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default RegisterPage;