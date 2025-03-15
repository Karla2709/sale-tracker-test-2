import React, { useState } from 'react';
import { CreateTaskInput, TaskStatus } from '../../lib/types/task';
import { useTasks } from '../../lib/contexts/TaskContext';

interface TaskFormProps {
  leadId?: string;
  onSuccess?: () => void;
}

export default function TaskForm({ leadId, onSuccess }: TaskFormProps) {
  const { createTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTaskInput>({
    lead_id: leadId || '',
    title: '',
    description: '',
    status: 'pending',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.lead_id) {
        throw new Error('Lead ID is required');
      }

      const result = await createTask(formData);
      
      if (result) {
        setFormData({
          lead_id: leadId || '',
          title: '',
          description: '',
          status: 'pending',
          due_date: ''
        });
        setIsFormOpen(false);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Task
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">Add New Task</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!leadId && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Lead ID</label>
                <input
                  type="text"
                  name="lead_id"
                  value={formData.lead_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Task'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 