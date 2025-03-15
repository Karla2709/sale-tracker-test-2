import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task, CreateTaskInput, UpdateTaskInput, TaskWithLead } from '../lib/types/task';
import { useSupabaseQuery } from './useSupabase';

// Mock data for tasks
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Follow up with client',
    description: 'Send email about proposal',
    status: 'pending',
    priority: 'high',
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    lead_id: '1',
    user_id: '1'
  },
  {
    id: '2',
    title: 'Prepare presentation',
    description: 'Create slides for next meeting',
    status: 'in_progress',
    priority: 'medium',
    due_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    lead_id: '2',
    user_id: '1'
  },
  {
    id: '3',
    title: 'Send contract',
    description: 'Email final contract for signature',
    status: 'completed',
    priority: 'high',
    due_date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    lead_id: '3',
    user_id: '1'
  }
];

/**
 * Hook for fetching all tasks
 */
export function useTasks() {
  // Return mock data immediately
  return {
    data: MOCK_TASKS,
    loading: false,
    error: null,
    refetch: () => {}
  };
}

/**
 * Hook for fetching tasks for a specific lead
 */
export function useLeadTasks(leadId: string) {
  const [data, setData] = useState<Task[]>(MOCK_TASKS.filter(task => task.lead_id === leadId));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    setData(MOCK_TASKS.filter(task => task.lead_id === leadId));
  };

  return { data, loading, error, refetch };
}

/**
 * Hook for fetching tasks with a specific status
 */
export function useTasksByStatus(status: string) {
  const [data, setData] = useState<Task[]>(MOCK_TASKS.filter(task => task.status === status));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    setData(MOCK_TASKS.filter(task => task.status === status));
  };

  return { data, loading, error, refetch };
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
      
      // Mock creating a task
      const newTask: Task = {
        id: Math.random().toString(36).substring(2, 9),
        ...taskData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Task;
      
      // In a real app, this would be added to the database
      MOCK_TASKS.push(newTask);
      
      return newTask;
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
      
      // Find the task to update
      const taskIndex = MOCK_TASKS.findIndex(task => task.id === taskId);
      if (taskIndex === -1) throw new Error('Task not found');
      
      // Update the task
      const updatedTask: Task = {
        ...MOCK_TASKS[taskIndex],
        ...taskData,
        updated_at: new Date().toISOString()
      };
      
      MOCK_TASKS[taskIndex] = updatedTask;
      
      return updatedTask;
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
      
      // Find the task index
      const taskIndex = MOCK_TASKS.findIndex(task => task.id === taskId);
      if (taskIndex === -1) throw new Error('Task not found');
      
      // Remove the task
      MOCK_TASKS.splice(taskIndex, 1);
      
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
    // In a real app, this would set up a subscription
    // For mock purposes, we'll just call the callback once
    callback();
    
    return () => {
      // Cleanup would happen here
    };
  }, [callback]);
} 