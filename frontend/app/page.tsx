'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import HomePage from '@/components/home/HomePage';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  
  // ตรวจสอบสถานะของ API
  const { data: healthStatus, isLoading: isCheckingHealth } = useQuery({
    queryKey: ['apiHealth'],
    queryFn: checkHealth,
    retry: 3,
  });
  
  // ตรวจสอบสถานะแบบอัตโนมัติเมื่อโหลดหน้า
  useEffect(() => {
    if (healthStatus) {
      console.log('API Status:', healthStatus);
    }
  }, [healthStatus]);
  
  return <HomePage />;
}