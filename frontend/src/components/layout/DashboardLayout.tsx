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
import { usePathname } from 'next/navigation'

const { Header, Sider } = Layout

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { token } = theme.useToken()
  const pathname = usePathname() || '/dashboard'

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: '/dashboard/settings',
      icon: <SettingOutlined />,
      label: <Link href="/dashboard/settings">Settings</Link>,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        theme="light"
        style={{ 
          overflow: 'auto', 
          height: '100vh', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          bottom: 0 
        }}
      >
        <div className="p-4 h-16 flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="mr-2"
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          />
          {collapsed ? (
            <div className="w-8 h-8 relative">
              <Image 
                src="/images/logo.png" 
                alt="Sale Tracker Logo" 
                fill 
                sizes="(max-width: 32px) 100vw"
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
                  sizes="(max-width: 40px) 100vw"
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
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ padding: 0, background: token.colorBgContainer, position: 'sticky', top: 0, zIndex: 1 }}>
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