import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'FaceSocial',
  description: 'แพลตฟอร์มโซเชียลมีเดียด้วยเทคโนโลยีจดจำใบหน้า',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}