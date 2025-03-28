'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Layout, Typography, message, Button, Space } from 'antd'
import { TanStackLeadTable } from '@/components/leads/TanStackLeadTable'
import { LeadForm } from '@/components/leads/LeadForm'
import { PlusOutlined, ImportOutlined } from '@ant-design/icons'
import { useSupabaseAuth } from '@/hooks/useSupabase'
import { useRouter } from 'next/navigation'
import { Spin } from 'antd'
import RBACGuard from '@/components/auth/RBACGuard'
import { useRBAC } from '@/lib/rbac'
import api from '@/lib/api' // Import API client

const { Content } = Layout
const { Title } = Typography

// Force saler role temporarily for debugging - moved to top level for consistency
const FORCE_SALER_MODE = true;

const DashboardPage = () => {
  const { user, loading } = useSupabaseAuth()
  const { userRole, isSaler } = useRBAC()
  const router = useRouter()
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false)
  const leadTableRef = useRef<{ fetchLeads: () => void } | null>(null)

  // Debug RBAC state
  useEffect(() => {
    console.log('Dashboard RBAC state:', { 
      userRole, 
      isSaler, 
      userEmail: user?.email,
      forceSalerMode: FORCE_SALER_MODE,
      effectivePermission: FORCE_SALER_MODE || isSaler
    });
  }, [userRole, isSaler, user]);

  const handleAddNewLead = () => {
    setIsLeadFormOpen(true)
  }

  const handleLeadFormCancel = () => {
    setIsLeadFormOpen(false)
  }

  const handleLeadFormSubmit = async (values: any) => {
    try {
      console.log('Submitting new lead:', values);
      
      await api.createLead(values);

      message.success('Lead created successfully')
      setIsLeadFormOpen(false)
      
      // Refresh the table
      if (leadTableRef.current) {
        leadTableRef.current.fetchLeads()
      }
    } catch (error) {
      console.error('Error creating lead:', error)
      message.error('Failed to create lead: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="content-container p-0">
      <div className="mb-6 flex justify-between items-center px-6">
        <div>
          <Title level={2}>Lead Management</Title>
          <p className="text-gray-500">Track and manage your leads in one place</p>
          <p className="text-xs text-blue-600">Current role: {userRole || 'Loading...'} {FORCE_SALER_MODE && '(Debug Mode: Force Saler)'}</p>
        </div>
        <Space>
          <RBACGuard requiredAction="create" resource="leads" renderNothing={false} fallback={
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              disabled
              title="You don't have permission to add new leads"
            >
              Add New
            </Button>
          }>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddNewLead}
            >
              Add New
            </Button>
          </RBACGuard>
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
        canEditDelete={FORCE_SALER_MODE || isSaler}
      />
      
      {/* Lead Form Modal */}
      <LeadForm
        open={isLeadFormOpen}
        onCancel={handleLeadFormCancel}
        onSubmit={handleLeadFormSubmit}
      />
    </div>
  )
}

export default DashboardPage