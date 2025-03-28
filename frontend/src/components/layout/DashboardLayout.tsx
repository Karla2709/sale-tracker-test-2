'use client'

import { useState } from 'react'
import { Layout, Button, theme, Dropdown } from 'antd'
import {
  DashboardOutlined,
  SettingOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/hooks/useSupabase'
import { useRBAC } from '@/lib/rbac'

const { Header, Content } = Layout

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { token } = theme.useToken()
  const pathname = usePathname() || '/'
  const router = useRouter()
  const { user, signOut, loading } = useSupabaseAuth()
  const { userRole } = useRBAC()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          background: token.colorBgContainer, 
          padding: '0 24px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}
      >
        {/* Logo and App Name */}
        <div className="flex items-center h-full">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-semibold">Sale Tracker</h1>
            </Link>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex items-center space-x-2">
          <Link 
            href="/dashboard"
            className={`flex items-center px-4 py-2 rounded-md transition-colors text-base ${
              pathname === '/' || pathname === '/dashboard'
                ? 'text-blue-600 bg-blue-50 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-500'
            }`}
          >
            <DashboardOutlined className="mr-2 text-lg" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/settings"
            className={`flex items-center px-4 py-2 rounded-md transition-colors text-base ${
              pathname === '/settings' || pathname === '/dashboard/settings'
                ? 'text-blue-600 bg-blue-50 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-500'
            }`}
          >
            <SettingOutlined className="mr-2 text-lg" />
            <span>Settings</span>
          </Link>
          
          {user ? (
            <Dropdown menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <div className="px-4 py-2 text-sm">
                      <div className="text-gray-500">Logged in as</div>
                      <div className="font-semibold">{user.email}</div>
                      <div className="mt-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs inline-block">
                        Role: {userRole || 'Loading...'}
                      </div>
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: 'Logout',
                  icon: <LogoutOutlined />,
                  onClick: handleLogout,
                },
              ],
            }} placement="bottomRight">
              <Button type="text" className="flex items-center">
                <UserOutlined />
                <span className="ml-1">{user?.email?.split('@')[0] || 'User'}</span>
              </Button>
            </Dropdown>
          ) : (
            <Link href="/login">
              <Button type="primary" className="flex items-center">
                <LoginOutlined />
                <span className="ml-1">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </Header>
      <Content style={{ padding: '24px' }}>
        {children}
      </Content>
    </Layout>
  )
}

export default DashboardLayout 