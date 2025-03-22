'use client'

import { useState } from 'react'
import { Table, Tag, Button, Space, Modal, Form, Input, Select, Typography, Spin, Alert } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useLeads } from '@/lib/contexts/LeadContext'
import { Lead, LeadStatus, FocusDomain, ContactPlatform } from '@/lib/types/lead'

const { Option } = Select
const { TextArea } = Input
const { Title } = Typography

const LeadTable = () => {
  const { filteredLeads, addLead, updateLead, deleteLead, loading, error } = useLeads()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentLead, setCurrentLead] = useState<Lead | null>(null)
  const [form] = Form.useForm()
  const [formSubmitting, setFormSubmitting] = useState(false)

  const showAddModal = () => {
    setIsEditMode(false)
    setCurrentLead(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const showEditModal = (lead: Lead) => {
    setIsEditMode(true)
    setCurrentLead(lead)
    form.setFieldsValue(lead)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleSubmit = async () => {
    try {
      setFormSubmitting(true)
      await form.validateFields()
      const values = form.getFieldsValue()
      
      if (isEditMode && currentLead) {
        await updateLead(currentLead.id, values)
      } else {
        await addLead(values)
      }
      
      setIsModalVisible(false)
      form.resetFields()
    } catch (err) {
      // Form validation error or API error
      console.error('Error submitting form:', err)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this lead?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await deleteLead(id)
      },
    })
  }

  const getStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      'New': 'blue',
      'In Contact': 'purple',
      'Interested': 'green',
      'Closed': 'gray',
      'Not Interested': 'red',
    }
    return colors[status]
  }

  const columns = [
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
      sorter: (a: Lead, b: Lead) => a.clientName.localeCompare(b.clientName),
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a: Lead, b: Lead) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: 'Contact Person',
      dataIndex: 'primaryContactPerson',
      key: 'primaryContactPerson',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: LeadStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      sorter: (a: Lead, b: Lead) => a.status.localeCompare(b.status),
    },
    {
      title: 'Focus Domain',
      dataIndex: 'focusDomain',
      key: 'focusDomain',
      render: (domain: FocusDomain) => <Tag>{domain}</Tag>,
      sorter: (a: Lead, b: Lead) => a.focusDomain.localeCompare(b.focusDomain),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a: Lead, b: Lead) => a.location.localeCompare(b.location),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Lead) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  // If there's an error fetching leads
  if (error) {
    return (
      <Alert
        message="Error Loading Leads"
        description={error.message || "There was a problem loading the leads data."}
        type="error"
        showIcon
      />
    );
  }

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Loading leads..." />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Leads ({filteredLeads.length})</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          Add New Lead
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <Table 
        columns={columns} 
        dataSource={filteredLeads} 
        rowKey="id"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-4">
              <p className="font-medium mb-2">Potential Value:</p>
              <p className="mb-4">{record.potentialValue}</p>
              
              <p className="font-medium mb-2">Contact:</p>
              <p className="mb-1">Email: {record.email}</p>
              <p className="mb-4">Platform: {record.contactPlatform}</p>
              
              {record.notes && (
                <>
                  <p className="font-medium mb-2">Notes:</p>
                  <p>{record.notes}</p>
                </>
              )}
            </div>
          ),
        }}
      />

      <Modal
        title={isEditMode ? 'Edit Lead' : 'Add New Lead'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} loading={formSubmitting}>
            {isEditMode ? 'Update' : 'Add'}
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          name="leadForm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="clientName"
              label="Client Name"
              rules={[{ required: true, message: 'Please enter client name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="primaryContactPerson"
              label="Primary Contact Person"
              rules={[{ required: true, message: 'Please enter contact person' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select>
                <Option value="New">New</Option>
                <Option value="In Contact">In Contact</Option>
                <Option value="Interested">Interested</Option>
                <Option value="Closed">Closed</Option>
                <Option value="Not Interested">Not Interested</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="focusDomain"
              label="Focus Domain"
              rules={[{ required: true, message: 'Please select focus domain' }]}
            >
              <Select>
                <Option value="Container Shipping">Container Shipping</Option>
                <Option value="Drop Shipping">Drop Shipping</Option>
                <Option value="Ecommerce">Ecommerce</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="contactPlatform"
              label="Contact Platform"
              rules={[{ required: true, message: 'Please select contact platform' }]}
            >
              <Select>
                <Option value="LinkedIn">LinkedIn</Option>
                <Option value="Email">Email</Option>
                <Option value="Referral">Referral</Option>
                <Option value="Conference">Conference</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item
            name="potentialValue"
            label="Potential Value"
            rules={[{ required: true, message: 'Please describe potential value' }]}
          >
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LeadTable 