'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) => {
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