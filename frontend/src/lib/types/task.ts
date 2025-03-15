export interface Task {
  id: string;
  lead_id: string;
  user_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  priority?: TaskPriority;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskWithLead extends Task {
  lead: {
    name: string;
    email: string | null;
  };
}

export interface CreateTaskInput {
  lead_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  due_date?: string;
  status?: TaskStatus;
} 