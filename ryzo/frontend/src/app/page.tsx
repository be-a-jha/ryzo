'use client';

import dynamic from 'next/dynamic';

// Import the entire page as a client component to avoid SSR issues with Zustand
const ClientHome = dynamic(() => import('@/components/ClientHome'), { ssr: false });

export default function Home() {
  return <ClientHome />;
}
