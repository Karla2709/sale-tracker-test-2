'use client';

import React from 'react';
import { Button, Typography, Layout } from 'antd';
import Link from 'next/link';
import Image from 'next/image';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function HomePage() {
  return (
    <Layout className="min-h-screen">
      <Content className="flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 relative mb-8">
          <Image
            src="/images/logo.png"
            alt="Sale Tracker Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <Title level={1} className="text-center mb-4">
          Welcome to Sale Tracker
        </Title>
        
        <Paragraph className="text-center text-lg mb-8 max-w-2xl">
          A simplified sales tracking solution for managing your business efficiently.
          Access your dashboard to view key metrics and manage your settings.
        </Paragraph>
        
        <Link href="/dashboard" passHref>
          <Button type="primary" size="large">
            Go to Dashboard
          </Button>
        </Link>
      </Content>
    </Layout>
  );
} 