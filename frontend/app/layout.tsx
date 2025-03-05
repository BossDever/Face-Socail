import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FaceSocial',
  description: 'แพลตฟอร์มโซเชียลมีเดียด้วยเทคโนโลยีจดจำใบหน้า',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
