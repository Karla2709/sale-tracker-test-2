'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { supabase } from '../../../../lib/supabase';
import TaskForm from '../../../../components/tasks/TaskForm';
import { useLeadTasks } from '../../../../hooks/useTasks';
import TaskList from '../../../../components/tasks/TaskList';

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchLead() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('leads')
          .select(`
            *,
            company:companies(name, industry)
          `)
          .eq('id', leadId)
          .single();
          
        if (error) throw error;
        setLead(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lead'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchLead();
  }, [leadId]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading lead details...</div>
      </DashboardLayout>
    );
  }
  
  if (error || !lead) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-500">
          Error: {error?.message || 'Lead not found'}
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{lead.name}</h1>
          <div className="text-gray-600 mb-4">
            {lead.position && <p>Position: {lead.position}</p>}
            {lead.company && <p>Company: {lead.company.name}</p>}
            {lead.email && <p>Email: {lead.email}</p>}
            {lead.phone && <p>Phone: {lead.phone}</p>}
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{lead.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-medium">{lead.source || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{new Date(lead.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Contact</p>
                <p className="font-medium">
                  {lead.last_contact_date 
                    ? new Date(lead.last_contact_date).toLocaleDateString() 
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>
          
          {lead.notes && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Notes</h2>
              <p className="whitespace-pre-line">{lead.notes}</p>
            </div>
          )}
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <TaskForm leadId={leadId} />
          <LeadTasksList leadId={leadId} />
        </div>
      </div>
    </DashboardLayout>
  );
}

function LeadTasksList({ leadId }: { leadId: string }) {
  const { data: tasks, loading, error, refetch } = useLeadTasks(leadId);
  
  if (loading) {
    return <div>Loading tasks...</div>;
  }
  
  if (error) {
    return (
      <div className="text-red-500 mb-4">
        Error loading tasks: {error.message}
        <button onClick={refetch} className="ml-2 underline">
          Try Again
        </button>
      </div>
    );
  }
  
  if (!tasks || tasks.length === 0) {
    return <div className="text-gray-500">No tasks for this lead yet.</div>;
  }
  
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <TaskList title="Pending Tasks" tasks={pendingTasks} status="pending" />
      )}
      
      {inProgressTasks.length > 0 && (
        <TaskList title="In Progress" tasks={inProgressTasks} status="in_progress" />
      )}
      
      {completedTasks.length > 0 && (
        <TaskList title="Completed" tasks={completedTasks} status="completed" />
      )}
    </div>
  );
} 