'use client'

import React from 'react'
import { Layout, Typography, Card, Form, Input, Button, Switch, Divider, Select } from 'antd'
import DashboardLayout from '@/components/layout/DashboardLayout'

const { Content } = Layout
const { Title } = Typography
const { Option } = Select

const Settings = () => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('Form values:', values)
    // In a real app, you would save these settings
  }

  return (
    <DashboardLayout>
      <Content className="p-6" style={{ overflow: 'initial' }}>
        <div className="content-container max-w-7xl mx-auto">
          <Title level={2} className="mb-6">Settings</Title>
          
          <Card className="max-w-3xl">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                companyName: 'Sale Tracker Inc.',
                email: 'admin@saletracker.com',
                darkMode: false,
                language: 'en',
                notifications: true
              }}
            >
              <Divider orientation="left">Profile Settings</Divider>
              
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: 'Please enter your company name' }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input />
              </Form.Item>
              
              <Divider orientation="left">Application Settings</Divider>
              
              <Form.Item name="language" label="Language">
                <Select>
                  <Option value="en">English</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="darkMode" label="Dark Mode" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Form.Item name="notifications" label="Notifications" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </DashboardLayout>
  )
}

export default Settings 