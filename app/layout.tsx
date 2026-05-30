import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ultimate Data Architect',
  description: 'Design, simulate, and deploy enterprise-grade data architectures',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
