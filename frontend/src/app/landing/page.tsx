'use client';

import React, { useEffect } from 'react';
import { Button, Typography, Space, Card, Row, Col } from 'antd';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabase';
import Link from 'next/link';
import { BarChartOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function LandingPage() {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, show landing page
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Sale Tracker
          </Link>
          
          <div>
            <Link href="/login">
              <Button type="primary" size="large">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Title>Manage Your Sales Pipeline with Ease</Title>
          <Paragraph className="text-lg mt-4 mb-8 max-w-3xl mx-auto">
            Sale Tracker helps you track and manage your sales opportunities, from initial contact to closing the deal.
          </Paragraph>
          <Space size="large">
            <Link href="/login">
              <Button type="primary" size="large">
                Get Started
              </Button>
            </Link>
          </Space>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Title level={2} className="text-center mb-12">
            Key Features
          </Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="h-full text-center p-6 hover:shadow-md transition-shadow">
                <BarChartOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4}>Lead Tracking</Title>
                <Paragraph>
                  Keep track of all your leads in one place. Never miss an opportunity again.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="h-full text-center p-6 hover:shadow-md transition-shadow">
                <TeamOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4}>Team Collaboration</Title>
                <Paragraph>
                  Role-based access control allows your team to collaborate effectively.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="h-full text-center p-6 hover:shadow-md transition-shadow">
                <DollarOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4}>Deal Management</Title>
                <Paragraph>
                  Manage the entire lifecycle of your deals from proposal to closing.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Title level={2} className="text-white">
            Ready to boost your sales?
          </Title>
          <Paragraph className="text-lg mb-8">
            Join thousands of businesses using Sale Tracker to manage their sales pipeline.
          </Paragraph>
          <Link href="/login">
            <Button size="large" type="default">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© {new Date().getFullYear()} Sale Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 