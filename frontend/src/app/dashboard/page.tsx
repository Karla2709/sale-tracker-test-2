'use client'

import React from 'react'
import { Layout, Typography, Card, Row, Col, Statistic } from 'antd'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DashboardOutlined, SettingOutlined } from '@ant-design/icons'

const { Content } = Layout
const { Title } = Typography

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Content className="p-6">
        <div className="content-container">
          <Title level={2} className="mb-6">Dashboard</Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic 
                  title="Total Clients" 
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
              This simplified version focuses only on Dashboard and Settings.
              All leads and tasks modules have been removed as requested.
            </p>
          </div>
        </div>
      </Content>
    </DashboardLayout>
  )
}

export default Dashboard 