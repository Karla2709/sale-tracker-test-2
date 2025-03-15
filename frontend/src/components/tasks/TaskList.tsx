import React, { useState } from 'react';
import { Task, TaskStatus } from '../../lib/types/task';
import { useTasks } from '../../lib/contexts/TaskContext';

interface TaskListProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
}

export default function TaskList({ title, tasks, status }: TaskListProps) {
  const { updateTask, deleteTask } = useTasks();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">{title} ({tasks.length})</h2>
      
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks in this category</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map(task => (
            <li key={task.id} className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">
                    {task.due_date && (
                      <span className="mr-2">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    {/* @ts-ignore - lead property is added by the join */}
                    {task.lead && <span>Lead: {task.lead.name}</span>}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => toggleExpand(task.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {expandedTaskId === task.id ? 'Collapse' : 'Expand'}
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {expandedTaskId === task.id && (
                <div className="mt-3 pt-3 border-t">
                  {task.description && (
                    <p className="text-gray-700 mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <span className="text-xs text-gray-500">
                      Created: {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 