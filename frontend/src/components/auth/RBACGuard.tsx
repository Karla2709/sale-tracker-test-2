'use client';

import React from 'react';
import { useRBAC } from '@/lib/rbac';

// For debugging - matches the constant in dashboard/page.tsx
const FORCE_SALER_MODE = true;

interface RBACGuardProps {
  /**
   * Content to render if the user has permission
   */
  children: React.ReactNode;
  
  /**
   * Content to render if the user doesn't have permission
   */
  fallback?: React.ReactNode;
  
  /**
   * Required action (view, create, update, delete)
   */
  requiredAction: 'view' | 'create' | 'update' | 'delete';
  
  /**
   * Resource being accessed
   */
  resource: string;
  
  /**
   * If true, renders nothing when permission is denied (instead of fallback)
   */
  renderNothing?: boolean;
  
  /**
   * If true, ignores permission checks for debugging
   */
  ignorePermissions?: boolean;
}

/**
 * RBACGuard component conditionally renders content based on user permissions.
 * Use this for UI elements that should be conditionally shown or hidden
 * based on the user's role/permissions.
 */
const RBACGuard: React.FC<RBACGuardProps> = ({
  children,
  fallback = null,
  requiredAction,
  resource,
  renderNothing = false,
  ignorePermissions = false,
}) => {
  const { can, loading } = useRBAC();
  
  // While loading permissions, don't render anything yet
  if (loading) {
    return null;
  }
  
  // Check if the user has the required permission
  // In debug mode with FORCE_SALER_MODE, allow all actions
  const hasPermission = FORCE_SALER_MODE || ignorePermissions || can(requiredAction, resource);
  
  // If the user has permission, render the children
  if (hasPermission) {
    return <>{children}</>;
  }
  
  // If renderNothing is true, render nothing
  if (renderNothing) {
    return null;
  }
  
  // Otherwise, render the fallback content
  return <>{fallback}</>;
};

export default RBACGuard; 