'use client'

import { useState } from 'react'
import { Layout, Menu, Button, theme } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons'
import Link from 'next/link'

const { Header, Sider, Content } = Layout

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { token } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="p-4 h-16 flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="mr-2"
          />
          <h1 className={`text-xl font-bold ${collapsed ? 'hidden' : 'block'}`}>Sale Tracker</h1>
          <h1 className={`text-xl font-bold ${collapsed ? 'block' : 'hidden'}`}>ST</h1>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: <Link href="/dashboard">Dashboard</Link>,
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: <Link href="/dashboard/leads">Leads</Link>,
            },
            {
              key: '3',
              icon: <CheckSquareOutlined />,
              label: <Link href="/tasks">Tasks</Link>,
            },
            {
              key: '4',
              icon: <SettingOutlined />,
              label: <Link href="/dashboard/settings">Settings</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: token.colorBgContainer }}>
          <div className="flex justify-end items-center px-4">
            {/* Header content can be added here if needed */}
          </div>
        </Header>
        {children}
      </Layout>
    </Layout>
  )
}

export default DashboardLayout 