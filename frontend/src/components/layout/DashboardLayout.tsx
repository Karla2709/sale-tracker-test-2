'use client'

import { useState } from 'react'
import { Layout, Menu, Button, theme } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import Image from 'next/image'

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
          {collapsed ? (
            <div className="w-8 h-8 relative">
              <Image 
                src="/images/logo.png" 
                alt="Sale Tracker Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 relative mr-2">
                <Image 
                  src="/images/logo.png" 
                  alt="Sale Tracker Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-xl font-bold">Sale Tracker</h1>
            </div>
          )}
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