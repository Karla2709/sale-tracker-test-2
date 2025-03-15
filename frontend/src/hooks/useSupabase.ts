import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/**
 * Hook for fetching data from Supabase
 * @param tableName - The name of the table to fetch from
 * @param options - Options for the query
 * @returns The data, loading state, error, and refetch function
 */
export function useSupabaseQuery<T>(
  tableName: string, 
  options: {
    select?: string;
    match?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    single?: boolean;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(tableName).select(options.select || '*');

      // Apply filters if provided
      if (options.match) {
        Object.entries(options.match).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply ordering if provided
      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        });
      }

      // Apply limit if provided
      if (options.limit) {
        query = query.limit(options.limit);
      }

      // Get single result if requested
      const { data: result, error: queryError } = options.single 
        ? await query.single() 
        : await query;

      if (queryError) throw queryError;
      
      setData(result as T);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName, JSON.stringify(options)]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for manually refreshing data when changes occur
 * @param callback - Function to call when data should be refreshed
 * @param interval - Optional interval in milliseconds to refresh data
 */
export function useDataRefresh(callback: () => void, interval?: number) {
  useEffect(() => {
    // Set up interval if provided
    if (interval) {
      const timer = setInterval(callback, interval);
      return () => clearInterval(timer);
    }
    
    // Otherwise, just call once
    callback();
    return () => {};
  }, [callback, interval]);
}

/**
 * Hook for authentication state
 * @returns The current user, loading state, and auth functions
 */
export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Auth functions
  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  return { user, loading, signIn, signUp, signOut };
}

export default { useSupabaseQuery, useDataRefresh, useSupabaseAuth }; 