'use client';

import React, { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabase';
import { 
  RBACContext, 
  UserRole, 
  checkPermission, 
  fetchUserRole 
} from '@/lib/rbac';
import { supabase } from '@/lib/supabase';

interface RBACProviderProps {
  children: React.ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { user, loading: userLoading } = useSupabaseAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user role directly from DB
  const getUserRoleDirectly = async (userId: string) => {
    try {
      console.log('Fetching role directly for user:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role directly:', error);
        return null;
      }

      console.log('Role data from direct query:', data);
      return data?.role || 'viewer';
    } catch (error) {
      console.error('Exception in direct role fetch:', error);
      return null;
    }
  };

  // Fetch the user's role whenever the user changes
  useEffect(() => {
    const getUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      console.log('Fetching role for user ID:', user.id);

      try {
        // First try direct method
        const directRole = await getUserRoleDirectly(user.id);
        console.log('Direct role result:', directRole);
        
        if (directRole) {
          setUserRole(directRole as UserRole);
          setLoading(false);
          return;
        }

        // Fall back to the original method if direct fails
        const role = await fetchUserRole(user.id);
        console.log('Fetched role:', role);
        setUserRole(role);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        // Default to viewer role if there's an error
        setUserRole('viewer');
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      getUserRole();
    }
  }, [user, userLoading]);

  // Define permission checking function
  const can = (action: 'view' | 'create' | 'update' | 'delete', resource: string) => {
    return checkPermission(userRole, action, resource);
  };

  // For debugging purposes, log role changes
  useEffect(() => {
    console.log('RBAC Provider - Current role:', userRole);
  }, [userRole]);

  // The value provided to the context consumers
  const rbacContextValue = {
    userRole,
    isViewer: userRole === 'viewer',
    isSaler: userRole === 'saler',
    can,
    loading: userLoading || loading,
  };

  return (
    <RBACContext.Provider value={rbacContextValue}>
      {children}
    </RBACContext.Provider>
  );
};

export default RBACProvider; 