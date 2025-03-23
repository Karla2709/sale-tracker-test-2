import React, { useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';

interface Lead {
  name: string;
  email: string;
  phone: string;
  status: string;
  client_domain: string;
  contact_platform: string;
  location: string;
  note?: string;
}

interface UseCreateLeadProps {
  onSuccess?: () => void;
}

export const useCreateLead = ({ onSuccess }: UseCreateLeadProps = {}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<Lead>();

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    form.resetFields();
    setModalOpen(false);
  };

  const handleSubmit = async (values: {
    name: string;
    email: string;
    phone: string;
    status: string;
    client_domain: string;
    contact_platform: string;
    location: string;
    note?: string;
  }) => {
    try {
      setLoading(true);
      // Use environment variables for API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create lead');
      }

      message.success('Lead created successfully');
      closeModal();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      message.error('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const leadForm = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input the name!' }]}
      >
        <Input placeholder="Enter lead name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input the email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input type="email" placeholder="Enter email address" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[{ required: true, message: 'Please input the phone number!' }]}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select a status!' }]}
      >
        <Select placeholder="Select status">
          <Select.Option value="New">New</Select.Option>
          <Select.Option value="Reached Out">Reached Out</Select.Option>
          <Select.Option value="Meeting Scheduled">Meeting Scheduled</Select.Option>
          <Select.Option value="First Meeting Complete">First Meeting Complete</Select.Option>
          <Select.Option value="Second Meeting Completed">Second Meeting Completed</Select.Option>
          <Select.Option value="In Dilligence">In Dilligence</Select.Option>
          <Select.Option value="Close Deal">Close Deal</Select.Option>
          <Select.Option value="Prospect Decline">Prospect Decline</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="client_domain"
        label="Client Domain"
        rules={[{ required: true, message: 'Please select a client domain!' }]}
      >
        <Select placeholder="Select client domain">
          <Select.Option value="Container Shipping">Container Shipping</Select.Option>
          <Select.Option value="Ecommerce">Ecommerce</Select.Option>
          <Select.Option value="Healthcare">Healthcare</Select.Option>
          <Select.Option value="Others">Others</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="contact_platform"
        label="Contact Platform"
        rules={[{ required: true, message: 'Please input the contact platform!' }]}
      >
        <Input placeholder="Enter contact platform (e.g., Email, LinkedIn)" />
      </Form.Item>

      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: 'Please input the location!' }]}
      >
        <Input placeholder="Enter location" />
      </Form.Item>

      <Form.Item
        name="note"
        label="Note"
      >
        <Input.TextArea rows={4} placeholder="Enter additional notes" />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={closeModal}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            Save
          </Button>
        </div>
      </Form.Item>
    </Form>
  );

  return {
    modalOpen,
    leadForm,
    loading,
    handleSubmit,
    openModal,
    closeModal,
  };
}; 