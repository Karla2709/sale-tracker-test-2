import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task, CreateTaskInput, UpdateTaskInput, TaskWithLead } from '../lib/types/task';
import { useSupabaseQuery } from './useSupabase';

/**
 * Hook for fetching all tasks
 */
export function useTasks() {
  return useSupabaseQuery<Task[]>('tasks', {
    select: '*, lead:leads(name, email)',
    order: { column: 'due_date', ascending: true }
  });
}

/**
 * Hook for fetching tasks for a specific lead
 */
export function useLeadTasks(leadId: string) {
  return useSupabaseQuery<Task[]>('tasks', {
    select: '*',
    match: { lead_id: leadId },
    order: { column: 'due_date', ascending: true }
  });
}

/**
 * Hook for fetching tasks with a specific status
 */
export function useTasksByStatus(status: string) {
  return useSupabaseQuery<Task[]>('tasks', {
    select: '*, lead:leads(name, email)',
    match: { status },
    order: { column: 'due_date', ascending: true }
  });
}

/**
 * Hook for managing tasks (create, update, delete)
 */
export function useTaskActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTask = async (taskData: CreateTaskInput) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: createError } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();
      
      if (createError) throw createError;
      
      return data as Task;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, taskData: UpdateTaskInput) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', taskId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      return data as Task;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (deleteError) throw deleteError;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTask,
    updateTask,
    deleteTask,
    loading,
    error
  };
}

/**
 * Hook for real-time task updates
 */
export function useTasksSubscription(callback: () => void) {
  useEffect(() => {
    const subscription = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        callback();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [callback]);
} 