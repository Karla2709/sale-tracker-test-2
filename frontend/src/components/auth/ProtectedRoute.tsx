'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRBAC } from '@/lib/rbac';
import { useSupabaseAuth } from '@/hooks/useSupabase';
import { Spin } from 'antd';

// Debug flag to bypass authentication checks (must match other components)
const DEBUG_BYPASS_AUTH = true;

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'viewer' | 'saler';
  requiredAction?: 'view' | 'create' | 'update' | 'delete';
  resource?: string;
  fallbackPath?: string;
}

/**
 * ProtectedRoute component to restrict access to routes based on user role
 * and permissions. Redirects to login or fallback path if the user doesn't
 * have the required permissions.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'viewer',
  requiredAction = 'view',
  resource = 'app',
  fallbackPath = '/login',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useSupabaseAuth();
  const { can, userRole, loading: rbacLoading } = useRBAC();
  
  // If debug bypass is enabled, render children directly
  if (DEBUG_BYPASS_AUTH) {
    console.log('DEBUG: Bypassing auth in ProtectedRoute');
    return <>{children}</>;
  }
  
  // Check if we're still loading auth or RBAC data
  const isLoading = authLoading || rbacLoading;
  
  // User is not authenticated, redirect to login
  if (!isLoading && !user) {
    // Save the current path for redirect after login
    if (typeof window !== 'undefined' && pathname !== '/login') {
      sessionStorage.setItem('redirectAfterLogin', pathname);
    }
    
    // Use router to redirect
    React.useEffect(() => {
      router.push('/login');
    }, [router]);
    
    // Return null or loading state while redirecting
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Redirecting to login..." />
      </div>
    );
  }
  
  // User is authenticated but lacks required permissions
  if (!isLoading && user) {
    // For role-based check
    if (requiredRole && userRole) {
      const hasRequiredRole = 
        requiredRole === 'viewer' || 
        (requiredRole === 'saler' && userRole === 'saler');
        
      if (!hasRequiredRole) {
        // Use router to redirect to fallback
        React.useEffect(() => {
          router.push(fallbackPath);
        }, [router, fallbackPath]);
        
        return (
          <div className="flex justify-center items-center min-h-screen">
            <Spin size="large" tip="Insufficient permissions..." />
          </div>
        );
      }
    }
    
    // For action-based check on a resource
    if (requiredAction && resource) {
      const hasPermission = can(requiredAction, resource);
      
      if (!hasPermission) {
        // Use router to redirect to fallback
        React.useEffect(() => {
          router.push(fallbackPath);
        }, [router, fallbackPath]);
        
        return (
          <div className="flex justify-center items-center min-h-screen">
            <Spin size="large" tip="Insufficient permissions..." />
          </div>
        );
      }
    }
  }
  
  // Show loading spinner while determining authentication/authorization
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }
  
  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute; 