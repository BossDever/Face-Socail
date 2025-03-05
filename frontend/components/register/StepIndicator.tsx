import React from 'react';
import { motion } from 'framer-motion';
import { Check, User, Camera, Send } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'ข้อมูลส่วนตัว', icon: User },
    { number: 2, title: 'ถ่ายภาพใบหน้า', icon: Camera },
    { number: 3, title: 'เสร็จสิ้น', icon: Send },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.number}>
                <div className="relative flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive 
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-500' 
                        : isCompleted 
                          ? 'border-green-500 bg-green-500 text-white' 
                          : 'border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-500 dark:text-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </motion.div>

                  <div className="absolute top-14 text-center">
                    <p className={`text-xs ${isActive || isCompleted ? 'text-blue-500 dark:text-blue-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex-1">
                    <div 
                      className={`h-0.5 transition-colors duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;