import React from 'react';
import { Form, Input, Select, Modal } from 'antd';

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  client_domain: string;
  contact_platform: string;
  location: string;
  note?: string;
}

interface LeadFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: LeadFormData) => void;
  initialValues?: Partial<LeadFormData>;
  title?: string;
}

const { Option } = Select;

export const LeadForm: React.FC<LeadFormProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  title = 'Add New Lead'
}) => {
  const [form] = Form.useForm<LeadFormData>();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      open={open}
      title={title}
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input the email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please input the phone number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select the status!' }]}
        >
          <Select>
            <Option value="New">New</Option>
            <Option value="Reached Out">Reached Out</Option>
            <Option value="Meeting Scheduled">Meeting Scheduled</Option>
            <Option value="First Meeting Complete">First Meeting Complete</Option>
            <Option value="Second Meeting Completed">Second Meeting Completed</Option>
            <Option value="In Dilligence">In Dilligence</Option>
            <Option value="Close Deal">Close Deal</Option>
            <Option value="Prospect Decline">Prospect Decline</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="client_domain"
          label="Client Domain"
          rules={[{ required: true, message: 'Please select the client domain!' }]}
        >
          <Select>
            <Option value="Container Shipping">Container Shipping</Option>
            <Option value="Ecommerce">Ecommerce</Option>
            <Option value="Healthcare">Healthcare</Option>
            <Option value="Others">Others</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="contact_platform"
          label="Contact Platform"
          rules={[{ required: true, message: 'Please select the contact platform!' }]}
        >
          <Select>
            <Option value="LinkedIn">LinkedIn</Option>
            <Option value="Email">Email</Option>
            <Option value="Conference">Conference</Option>
            <Option value="Referral">Referral</Option>
            <Option value="Website">Website</Option>
            <Option value="Industry Event">Industry Event</Option>
            <Option value="Partner Referral">Partner Referral</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: 'Please input the location!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="note"
          label="Note"
          rules={[{ max: 4000, message: 'Note cannot exceed 4000 characters!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 