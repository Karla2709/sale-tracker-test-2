'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../lib/api';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true);
        const data = await api.getLeads() as any[];
        setLeads(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch leads'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeads();
  }, []);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading leads...</div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-500">
          Error: {error.message}
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leads</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add New Lead
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Company</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Last Contact</th>
                <th className="py-3 px-4 text-left">Created</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/leads/${lead.id}`} className="text-blue-500 hover:underline">
                      {lead.name}
                    </Link>
                    {lead.position && <p className="text-sm text-gray-500">{lead.position}</p>}
                  </td>
                  <td className="py-3 px-4">
                    {lead.company ? lead.company.name : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                      lead.status === 'proposal' ? 'bg-purple-100 text-purple-800' :
                      lead.status === 'negotiation' ? 'bg-indigo-100 text-indigo-800' :
                      lead.status === 'closed-won' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {lead.last_contact_date 
                      ? new Date(lead.last_contact_date).toLocaleDateString() 
                      : 'Never'}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/leads/${lead.id}`} className="text-blue-500 hover:underline mr-2">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 