'use client';

import React, { useState, useRef } from 'react'
import { Layout, Typography, message } from 'antd'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { LeadTable } from '@/components/leads/LeadTable'
import { LeadForm } from '@/components/leads/LeadForm'
import { LeadFilterPanel, FilterValues } from '@/components/leads/LeadFilterPanel'

const { Content } = Layout
const { Title } = Typography

const HomePage = () => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false)
  const leadTableRef = useRef<{ fetchLeads: (filters?: FilterValues) => void } | null>(null)

  const handleAddNewLead = () => {
    setIsLeadFormOpen(true)
  }

  const handleLeadFormCancel = () => {
    setIsLeadFormOpen(false)
  }

  const handleSearch = (filters: FilterValues) => {
    if (leadTableRef.current) {
      leadTableRef.current.fetchLeads(filters);
    }
  }

  const handleLeadFormSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create lead');
      }

      message.success('Lead created successfully');
      setIsLeadFormOpen(false);
      
      // Refresh the table
      if (leadTableRef.current) {
        leadTableRef.current.fetchLeads();
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      message.error('Failed to create lead');
    }
  }

  return (
    <DashboardLayout>
      <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Title level={2}>Lead Management</Title>
          <p className="text-gray-500">Track and manage your leads in one place</p>
        </div>

        {/* Search and Filter Panel */}
        <LeadFilterPanel 
          onSearch={handleSearch} 
          onAddNew={handleAddNewLead} 
        />

        {/* Lead Table */}
        <LeadTable 
          ref={leadTableRef} 
          onAddNew={handleAddNewLead} 
        />
        
        {/* Lead Form Modal */}
        <LeadForm
          open={isLeadFormOpen}
          onCancel={handleLeadFormCancel}
          onSubmit={handleLeadFormSubmit}
        />
      </div>
    </DashboardLayout>
  )
}

export default HomePage 