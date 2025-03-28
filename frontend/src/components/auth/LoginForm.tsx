'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSupabaseAuth } from '@/hooks/useSupabase';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const { signIn, loading } = useSupabaseAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const onFinish = async (values: LoginFormValues) => {
    setFormError(null);
    
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        throw error;
      }
      
      // Login successful
      message.success('Login successful!');
      
      // Redirect to dashboard or the page they were trying to access
      const redirectPath = typeof window !== 'undefined' 
        ? sessionStorage.getItem('redirectAfterLogin') || '/dashboard' 
        : '/dashboard';
        
      router.push(redirectPath);
      
      // Clear the stored redirect path
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('redirectAfterLogin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setFormError(error.message || 'Failed to sign in. Please check your credentials.');
      message.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <Card className="max-w-md w-full p-6 shadow-md">
      <div className="text-center mb-6">
        <Title level={2}>Welcome Back</Title>
        <Text type="secondary">Sign in to continue to Sale Tracker</Text>
      </div>

      {formError && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded">
          {formError}
        </div>
      )}

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Email address" 
            size="large" 
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Password" 
            size="large" 
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            size="large"
            className="w-full"
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Divider>Demo Accounts</Divider>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button 
          onClick={() => {
            form.setFieldsValue({
              email: 'viewtest1@example.com',
              password: 'abc1234!'
            });
          }}
          className="w-full"
        >
          Viewer
        </Button>
        
        <Button 
          onClick={() => {
            form.setFieldsValue({
              email: 'saletest1@example.com',
              password: 'abc1234!'
            });
          }}
          className="w-full"
        >
          Saler
        </Button>
      </div>
    </Card>
  );
};

export default LoginForm; 