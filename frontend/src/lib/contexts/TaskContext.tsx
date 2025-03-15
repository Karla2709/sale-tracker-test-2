import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import { useTasks as useTasksQuery, useTaskActions, useTasksSubscription } from '../../hooks/useTasks';

interface TaskContextType {
  tasks: Task[];
  pendingTasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
  loading: boolean;
  error: Error | null;
  createTask: (task: CreateTaskInput) => Promise<Task | null>;
  updateTask: (id: string, task: UpdateTaskInput) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  refreshTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { data: fetchedTasks, loading, error, refetch } = useTasksQuery();
  const { createTask, updateTask, deleteTask } = useTaskActions();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Update tasks when data is fetched
  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);

  // Subscribe to real-time updates
  useTasksSubscription(refetch);

  // Filter tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const value = {
    tasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: refetch
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext; 