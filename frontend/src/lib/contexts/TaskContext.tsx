import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '../types/task';
import { useTaskActions } from '../../hooks/useTasks';

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
  const { createTask, updateTask, deleteTask } = useTaskActions();
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Filter tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const refreshTasks = () => {
    // In a real app, this would fetch from the API
    setTasks([...MOCK_TASKS]);
  };

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
    refreshTasks
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