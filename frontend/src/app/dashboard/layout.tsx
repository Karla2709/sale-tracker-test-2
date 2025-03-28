'use client';

import React, { useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabase';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Save the current path for redirect after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', '/dashboard');
      }
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // If no user and not loading, the useEffect above will redirect
  if (!user && !loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" tip="Redirecting to login..." />
      </div>
    );
  }

  // User is authenticated, show dashboard
  return <DashboardLayout>{children}</DashboardLayout>;
} 