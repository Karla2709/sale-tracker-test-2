import React from 'react';
import { useTasks } from '../../lib/contexts/TaskContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

export default function TaskBoard() {
  const { pendingTasks, inProgressTasks, completedTasks, loading, error, refreshTasks } = useTasks();

  if (loading) {
    return <div className="text-center py-10">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Error loading tasks: {error.message}
        <button 
          onClick={refreshTasks}
          className="ml-4 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Board</h1>
      </div>

      <TaskForm onSuccess={refreshTasks} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <TaskList 
            title="Pending Tasks" 
            tasks={pendingTasks} 
            status="pending" 
          />
        </div>
        
        <div>
          <TaskList 
            title="In Progress" 
            tasks={inProgressTasks} 
            status="in_progress" 
          />
        </div>
        
        <div>
          <TaskList 
            title="Completed" 
            tasks={completedTasks} 
            status="completed" 
          />
        </div>
      </div>
    </div>
  );
} 