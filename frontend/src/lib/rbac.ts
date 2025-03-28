import { createContext, useContext, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Role definitions
export type UserRole = 'viewer' | 'saler';

// User with role information
export interface UserWithRole extends User {
  role?: UserRole;
  roleData?: {
    role: UserRole;
  };
}

// RBAC context type
export interface RBACContextType {
  userRole: UserRole | null;
  isViewer: boolean;
  isSaler: boolean;
  // Check function for components
  can: (action: 'view' | 'create' | 'update' | 'delete', resource: string) => boolean;
  // Loading state
  loading: boolean;
}

// Default context values when no provider is available
const defaultRBACContext: RBACContextType = {
  userRole: null,
  isViewer: false,
  isSaler: false,
  can: () => false,
  loading: true,
};

// Create the RBAC context
export const RBACContext = createContext<RBACContextType>(defaultRBACContext);

// Helper hook to use RBAC context
export function useRBAC() {
  const context = useContext(RBACContext);
  
  // Log the context for debugging
  useEffect(() => {
    console.log('useRBAC hook - context:', {
      userRole: context.userRole,
      isViewer: context.isViewer,
      isSaler: context.isSaler,
      loading: context.loading
    });
  }, [context.userRole, context.loading]);
  
  if (context === undefined) {
    console.error('useRBAC must be used within an RBACProvider');
    return defaultRBACContext;
  }
  
  return context;
}

// Function to fetch user role from Supabase
export async function fetchUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data?.role || 'viewer'; // Default to viewer if no role is set
  } catch (error) {
    console.error('Exception fetching user role:', error);
    return null;
  }
}

// Permission checking logic
export function checkPermission(
  role: UserRole | null, 
  action: 'view' | 'create' | 'update' | 'delete', 
  resource: string
): boolean {
  console.log(`Checking permission: role=${role}, action=${action}, resource=${resource}`);
  
  // If no role, deny all permissions
  if (!role) {
    console.log('No role, denying permission');
    return false;
  }

  // Viewer permissions - read-only access to all resources
  if (role === 'viewer') {
    const hasPermission = action === 'view';
    console.log(`Viewer role, has permission: ${hasPermission}`);
    return hasPermission;
  }

  // Saler permissions - full access to all resources
  if (role === 'saler') {
    console.log('Saler role, granting full permission');
    return true;
  }

  // Default deny for any other role
  console.log('Unknown role, denying permission');
  return false;
}

// Helper to determine if user has minimum role level
export function hasMinimumRole(userRole: UserRole | null, minimumRole: UserRole): boolean {
  if (!userRole) return false;
  
  // Role hierarchy
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 1,
    saler: 2,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
} 