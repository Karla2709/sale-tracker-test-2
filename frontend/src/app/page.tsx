'use client';

import React, { useState, useRef } from 'react'
import { Layout, Typography, message } from 'antd'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { LeadTable } from '@/components/leads/LeadTable'
import { LeadForm } from '@/components/leads/LeadForm'

const { Content } = Layout
const { Title } = Typography

const HomePage = () => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false)
  const leadTableRef = useRef<{ fetchLeads: () => void } | null>(null)

  const handleAddNewLead = () => {
    setIsLeadFormOpen(true)
  }

  const handleLeadFormCancel = () => {
    setIsLeadFormOpen(false)
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
      <div className="content-container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>Lead Management</Title>
        </div>

        <LeadTable ref={leadTableRef} onAddNew={handleAddNewLead} />
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