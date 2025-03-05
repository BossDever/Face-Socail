/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['localhost', 'api.facesocial.example.com'],
    },
    compiler: {
      // Enables the styled-components SWC transform
      styledComponents: true,
    },
    i18n: {
      locales: ['th', 'en'],
      defaultLocale: 'th',
    },
  }
  
  module.exports = nextConfig