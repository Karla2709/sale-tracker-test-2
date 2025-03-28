'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabase';
import { Spin } from 'antd';

export default function Home() {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/landing');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Spin size="large" tip="Loading..." />
    </div>
  );
}
