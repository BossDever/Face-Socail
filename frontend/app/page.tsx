'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import HomePage from '@/components/home/HomePage';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  
  // ตรวจสอบสถานะของ API
  const { data: healthStatus, isLoading: isCheckingHealth, isError } = useQuery({
    queryKey: ['apiHealth'],
    queryFn: checkHealth,
    retry: 3,
    staleTime: 60000, // 1 นาที
    // แก้ไขเพื่อป้องกัน hydration error
    enabled: typeof window !== 'undefined',
  });
  
  // อัปเดตสถานะ API
  useEffect(() => {
    if (isCheckingHealth) {
      setApiStatus('loading');
    } else if (isError) {
      setApiStatus('offline');
      console.error('API is offline!');
    } else if (healthStatus) {
      setApiStatus('online');
      console.log('API Status:', healthStatus);
    }
  }, [healthStatus, isCheckingHealth, isError]);
  
  // สามารถ redirect ไปยังหน้า Dashboard ถ้าผู้ใช้ login แล้ว (ตัวอย่าง)
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     router.push('/dashboard');
  //   }
  // }, [isAuthenticated, user, router]);
  
  return (
    <>
      {apiStatus === 'offline' && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-50">
          ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาลองใหม่ภายหลัง หรือติดต่อผู้ดูแลระบบ
        </div>
      )}
      <HomePage />
    </>
  );
}