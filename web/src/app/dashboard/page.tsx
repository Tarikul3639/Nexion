"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Welcome } from '@/components';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to chat by default
    router.push('/dashboard/chat');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <Welcome />
    </div>
  );
}
