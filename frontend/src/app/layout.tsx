import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConfigProvider } from 'antd'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sale Tracker MVP',
  description: 'SaaS Potential Clients Sale Tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
} 