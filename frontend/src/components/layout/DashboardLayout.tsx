'use client'

import { useState } from 'react'
import { Layout, Button, theme } from 'antd'
import {
  DashboardOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const { Header, Content } = Layout

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { token } = theme.useToken()
  const pathname = usePathname() || '/dashboard'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          background: token.colorBgContainer, 
          padding: '0 16px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo and App Name */}
        <div className="flex items-center h-16">
          <div className="flex items-center">
            <div className="w-10 h-10 relative mr-2">
              <Image 
                src="/images/logo.png" 
                alt="Sale Tracker Logo" 
                fill 
                sizes="(max-width: 40px) 100vw"
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold">Sale Tracker</h1>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex items-center space-x-6">
          <Link 
            href="/dashboard"
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              pathname === '/dashboard' 
                ? 'text-blue-600 bg-blue-50' 
                : 'hover:bg-gray-100'
            }`}
          >
            <DashboardOutlined className="mr-1" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/dashboard/settings"
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              pathname === '/dashboard/settings' 
                ? 'text-blue-600 bg-blue-50' 
                : 'hover:bg-gray-100'
            }`}
          >
            <SettingOutlined className="mr-1" />
            <span>Settings</span>
          </Link>
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        {children}
      </Content>
    </Layout>
  )
}

export default DashboardLayout 