/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost', 'api.facesocial.example.com'],
    },
    // หมายเหตุ: swcMinify ถูกลบออกเนื่องจากเป็นค่าเริ่มต้นใน Next.js ล่าสุดแล้ว
    // หมายเหตุ: i18n ถูกลบออกเนื่องจากไม่รองรับใน App Router
  }
  
  module.exports = nextConfig