'use client';

import dynamic from 'next/dynamic';

const IDEContent = dynamic(() => import('@/components/IDEContent'), { ssr: false });

export default function Home() {
  return <IDEContent />;
}
