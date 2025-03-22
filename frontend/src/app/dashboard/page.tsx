'use client'

import React, { useState, useRef } from 'react'
import { Layout, Typography, Card, Row, Col, Statistic, message } from 'antd'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DashboardOutlined, SettingOutlined } from '@ant-design/icons'
import { LeadTable } from '@/components/leads/LeadTable'
import { LeadForm } from '@/components/leads/LeadForm'

const { Content } = Layout
const { Title } = Typography

const Dashboard = () => {
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
      const response = await fetch('http://localhost:3001/api/leads', {
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
      <Content className="p-6" style={{ overflow: 'initial' }}>
        <div className="content-container max-w-7xl mx-auto">
          <Title level={2} className="mb-6">Dashboard</Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic 
                  title="Total Leads" 
                  value={42} 
                  prefix={<DashboardOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic 
                  title="Active Deals" 
                  value={12} 
                  prefix={<DashboardOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic 
                  title="System Status" 
                  value="Online" 
                  prefix={<SettingOutlined />} 
                />
              </Card>
            </Col>
          </Row>

          <div className="mt-8">
            <Title level={4}>Welcome to Sale Tracker</Title>
            <p className="mt-4">
              Track and manage your leads efficiently with our comprehensive dashboard.
              Use the table below to view, filter, and manage your leads.
            </p>
          </div>

          <LeadTable ref={leadTableRef} onAddNew={handleAddNewLead} />
          <LeadForm
            open={isLeadFormOpen}
            onCancel={handleLeadFormCancel}
            onSubmit={handleLeadFormSubmit}
          />
        </div>
      </Content>
    </DashboardLayout>
  )
}

export default Dashboard