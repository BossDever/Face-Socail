module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
EOLฃ
cd /d/FinalProject/Face-Socail/frontend

# วิธีที่ 1: ติดตั้ง @tailwindcss/postcss (แนะนำ)
npm install @tailwindcss/postcss

# แก้ไข postcss.config.js
cat > postcss.config.js << EOL
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
