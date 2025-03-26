'use client';

import React, { useState, useRef } from 'react'
import { Layout, Typography, message, Button, Space } from 'antd'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { LeadTable } from '@/components/leads/LeadTable'
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
      <div className="content-container">
        <div className="mb-6 flex justify-between items-center">
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

        {/* Lead Table */}
        <LeadTable 
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