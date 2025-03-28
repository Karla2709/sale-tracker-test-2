import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Get client IP and user agent for debugging
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Get all cookies for debugging
  const cookies: Record<string, string> = {};
  request.cookies.getAll().forEach(cookie => {
    cookies[cookie.name] = cookie.value;
  });
  
  // Test connections
  let supabaseStatus = 'unknown';
  let supabaseError = null;
  
  try {
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        supabaseStatus = 'error';
        supabaseError = error.message;
      } else {
        supabaseStatus = data.session ? 'authenticated' : 'not_authenticated';
      }
    } else {
      supabaseStatus = 'config_missing';
    }
  } catch (error) {
    supabaseStatus = 'connection_error';
    supabaseError = String(error);
  }
  
  // Build response
  const statusInfo = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    request: {
      method: request.method,
      url: request.url,
      clientIp,
      userAgent,
    },
    environment: {
      node_env: process.env.NODE_ENV,
      supabase_url_exists: !!supabaseUrl,
      api_url_exists: !!process.env.NEXT_PUBLIC_API_URL,
    },
    supabase: {
      status: supabaseStatus,
      error: supabaseError,
    },
    cookies: {
      count: Object.keys(cookies).length,
      names: Object.keys(cookies),
      // Don't include actual values for security
    }
  };
  
  return NextResponse.json(statusInfo);
} 