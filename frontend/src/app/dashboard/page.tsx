'use client'

import { useState } from 'react'
import { Layout, Typography } from 'antd'
import DashboardLayout from '@/components/layout/DashboardLayout'
import LeadTable from '@/components/leads/LeadTable'
import SearchFilterBar from '@/components/leads/SearchFilterBar'
import { LeadProvider } from '@/lib/contexts/LeadContext'

const { Content } = Layout
const { Title } = Typography

export default function Dashboard() {
  return (
    <LeadProvider>
      <DashboardLayout>
        <Content className="p-6">
          <div className="content-container">
            <Title level={2} className="mb-6">Lead Management Dashboard</Title>
            <SearchFilterBar />
            <LeadTable />
          </div>
        </Content>
      </DashboardLayout>
    </LeadProvider>
  )
} 