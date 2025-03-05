'use client';

import React from 'react';
import { LogIn, Camera, Bell, MessageSquare, Search, UserPlus } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export const FeaturesSection: React.FC = () => {
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