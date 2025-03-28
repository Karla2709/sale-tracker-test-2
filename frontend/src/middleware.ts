import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Debug flag to bypass authentication checks during development
const DEBUG_BYPASS_AUTH = true;

// Create a supabase client for authentication checks
function getSupabaseClient(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Supabase URL exists:', !!supabaseUrl);
  
  // Extract cookies from the request
  const authCookie = request.cookies.get('sb-auth-token')?.value;
  console.log('Auth cookie exists:', !!authCookie);

  // Create a supabase client with or without the auth cookie
  return createClient(supabaseUrl || '', supabaseKey || '', {
    auth: {
      persistSession: false,
      // If we have an auth cookie, use it
      ...(authCookie ? {
        autoRefreshToken: false,
        detectSessionInUrl: false,
      } : {})
    },
    global: {
      headers: {
        // If we have an auth cookie, pass it in the header
        ...(authCookie ? {
          Authorization: `Bearer ${authCookie}`,
        } : {})
      }
    }
  });
}

// Function to check if the user has the required role for the action
async function hasRequiredRole(request: NextRequest, method: string): Promise<boolean> {
  // Skip permissions checks if DEBUG_BYPASS_AUTH is true
  if (DEBUG_BYPASS_AUTH) {
    console.log('DEBUG: Bypassing role check in middleware');
    return true;
  }

  try {
    const supabase = getSupabaseClient(request);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No session found in middleware');
      return false;
    }
    
    console.log('User email in middleware:', session.user.email);
    
    // Get the user's role from the database
    const { data: userRoleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return false;
    }
    
    console.log('User role data:', userRoleData);
    const userRole = typeof userRoleData.role === 'string' 
      ? userRoleData.role
      : userRoleData.role?.name || '';
    
    console.log('User role:', userRole);
    
    // Define required roles for different HTTP methods
    // GET requires at least 'viewer' role
    // POST, PUT, DELETE require 'saler' role
    const requiredRole = method === 'GET' ? 'viewer' : 'saler';
    
    // Check if the user has the required role
    // 'saler' can do everything that 'viewer' can do
    return (requiredRole === 'viewer' && (userRole === 'viewer' || userRole === 'saler')) || 
           (requiredRole === 'saler' && userRole === 'saler');
           
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  // Skip non-API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  const method = request.method;
  console.log(`API ${method} request for ${request.nextUrl.pathname}`);
  
  // For debugging
  if (DEBUG_BYPASS_AUTH) {
    console.log('DEBUG: Bypassing middleware authentication check');
    return NextResponse.next();
  }
  
  // Check if the user has the required role for this action
  const hasPermission = await hasRequiredRole(request, method);
  
  if (!hasPermission) {
    console.log(`User does not have permission for ${method} operation`);
    return NextResponse.json(
      { error: 'Unauthorized. You do not have permission to perform this action.' },
      { status: 403 }
    );
  }
  
  // User has the required role, proceed with the request
  return NextResponse.next();
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
}; 