'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabase';
import LoginForm from '@/components/auth/LoginForm';
import { Spin } from 'antd';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
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

  // If user is not logged in, show login form
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Sale Tracker
          </Link>
        </div>
        
        <LoginForm />
        
        <div className="mt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Sale Tracker. All rights reserved.</p>
        </div>
      </div>
    );
  }

  // This should never show as we redirect logged in users
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Spin size="large" tip="Redirecting..." />
    </div>
  );
} 