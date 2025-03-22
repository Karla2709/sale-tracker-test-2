'use client'

import React, { useEffect } from 'react'
import { Layout, Typography } from 'antd'
import DashboardLayout from '@/components/layout/DashboardLayout'
import SearchFilterBar from '@/components/leads/SearchFilterBar'
import LeadTable from '@/components/leads/LeadTable'
import { LeadProvider } from '@/lib/contexts/LeadContext'

const { Content } = Layout
const { Title } = Typography

// Add a simple API test function
const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    const response = await fetch('/api/leads');
    console.log('API Response Status:', response.status);
    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  } catch (error) {
    console.error('API Connection Test Error:', error);
    return null;
  }
};

const Dashboard = () => {
  // Run the test on component mount
  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <DashboardLayout>
      <Content className="p-6">
        <div className="content-container">
          <Title level={2} className="mb-6">Lead Management Dashboard</Title>
          <LeadProvider>
            <SearchFilterBar />
            <LeadTable />
          </LeadProvider>
        </div>
      </Content>
    </DashboardLayout>
  )
}

export default Dashboard 