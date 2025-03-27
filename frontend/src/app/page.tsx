'use client';

import React, { useState, useRef } from 'react'
import { Layout, Typography, message, Button, Space } from 'antd'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { TanStackLeadTable } from '@/components/leads/TanStackLeadTable'
import { LeadForm } from '@/components/leads/LeadForm'
import { PlusOutlined, ImportOutlined } from '@ant-design/icons'

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
      <div className="content-container p-0">
        <div className="mb-6 flex justify-between items-center px-6">
          <div>
            <Title level={2}>Lead Management</Title>
            <p className="text-gray-500">Track and manage your leads in one place</p>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddNewLead}
            >
              Add New
            </Button>
            <Button 
              icon={<ImportOutlined />} 
              disabled
            >
              Import from n8n
            </Button>
          </Space>
        </div>

        {/* TanStack Lead Table */}
        <TanStackLeadTable 
          ref={leadTableRef} 
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