import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, Card, message, Dropdown, Button, Modal, Typography, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Tag } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { LeadForm } from './LeadForm';

const { Text } = Typography;

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  client_domain: string;
  contact_platform: string;
  location: string;
  created_at: string;
  last_contact_date: string;
  note: string;
}

interface LeadTableProps {
  onAddNew?: () => void;
}

// Implement the useEditLead functionality directly in this component
const useEditLead = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);

  const openModal = (lead: Lead) => {
    setCurrentLead(lead);
    setModalOpen(true);
    form.setFieldsValue(lead);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentLead(null);
    form.resetFields();
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
    if (!currentLead?.id) return;
    
    try {
      setLoading(true);
      // Use environment variables for API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leads/${currentLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      message.success('Lead updated successfully');
      closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating lead:', error);
      message.error('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    modalOpen,
    loading,
    currentLead,
    handleSubmit,
    openModal,
    closeModal,
  };
};

const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'New': '#808080', // gray
    'Reached Out': '#9370DB', // medium purple
    'Meeting Scheduled': '#F8C471', // light orange
    'First Meeting Complete': '#85C1E9', // light blue
    'Second Meeting Completed': '#76D7C4', // light teal
    'In Dilligence': '#F0B27A', // light brown
    'Close Deal': '#7DCEA0', // light green
    'Prospect Decline': '#F1948A', // light red
  };
  return colors[status] || '#808080';
};

const getDomainColor = (domain: string): string => {
  const colors: { [key: string]: string } = {
    'Container Shipping': '#90EE90', // Light Green
    'Ecommerce': '#FFB6C1', // Light Red
    'Healthcare': '#ADD8E6', // Light Blue
    'Others': '#D3D3D3', // Light Gray
  };
  return colors[domain] || '#D3D3D3';
};

export const LeadTable = forwardRef<{ fetchLeads: () => void }, LeadTableProps>(({ onAddNew }, ref) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Lead[]>([]); // Store all data
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // State for delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Use the edit lead hook
  const { 
    form: editForm,
    modalOpen: editModalOpen, 
    currentLead,
    handleSubmit: handleEditSubmit, 
    openModal: openEditModal, 
    closeModal: closeEditModal 
  } = useEditLead({
    onSuccess: () => loadAllLeads()
  });

  // Fetch all leads from API
  const loadAllLeads = async () => {
    try {
      setLoading(true);
      
      // Use environment variables for API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leads?page=1&pageSize=1000`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Loaded all leads:', result);

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid response format');
      }

      setData(result.data);
      setPagination({
        ...pagination,
        total: result.data.length,
      });
    } catch (error) {
      console.error('Error loading leads:', error);
      message.error(typeof error === 'string' ? error : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchLeads through the ref
  useImperativeHandle(ref, () => ({
    fetchLeads: () => {
      console.log('fetchLeads called');
      return loadAllLeads();
    }
  }), []);

  // Load leads when component mounts
  useEffect(() => {
    console.log('LeadTable mounted, loading all leads');
    loadAllLeads();
  }, []);

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // Handle edit action
  const handleEdit = (record: Lead) => {
    openEditModal(record);
  };

  // Handle delete action
  const handleDelete = (record: Lead) => {
    setSelectedLead(record);
    setDeleteModalVisible(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!selectedLead) return;
    
    try {
      setLoading(true);
      // Use environment variables for API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leads/${selectedLead.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }

      message.success('Lead deleted successfully');
      loadAllLeads(); // Refresh the list
      setDeleteModalVisible(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
      message.error('Failed to delete lead');
    } finally {
      setLoading(false);
    }
  };

  // Expandable row render function for detail view
  const expandedRowRender = (record: Lead) => {
    return (
      <div className="lead-detail-expanded bg-gray-50 rounded-md">
        <div className="lead-detail-text">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="detail-item">
              <span className="detail-label">Created Date:</span>
              <span className="detail-value">
                {record.created_at ? dayjs(record.created_at).format('DD-MMM-YYYY') : 'N/A'}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Last Contact Date:</span>
              <span className="detail-value">
                {record.last_contact_date ? dayjs(record.last_contact_date).format('DD-MMM-YYYY') : 'N/A'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Contact Platform:</span>
              <span className="detail-value">{record.contact_platform || 'N/A'}</span>
            </div>
          </div>
          
          {record.note && (
            <div className="mt-3">
              <div className="detail-item note-item">
                <span className="detail-label">Note:</span>
                <div className="note-content">
                  {record.note || 'No notes'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Custom expand icon
  const expandIcon = ({ expanded, onExpand, record }: any) => 
    expanded ? (
      <DownOutlined onClick={e => onExpand(record, e)} className="text-blue-500 mr-2" />
    ) : (
      <RightOutlined onClick={e => onExpand(record, e)} className="text-gray-500 mr-2" />
    );

  const cellStyle = { 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap' as const
  };

  // Simplified columns for list view
  const columns: ColumnsType<Lead> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag 
          color={getStatusColor(status)} 
          style={{ 
            color: '#333', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontWeight: 500
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Domain',
      dataIndex: 'client_domain',
      key: 'client_domain',
      render: (domain: string) => (
        <Tag 
          color={getDomainColor(domain)} 
          style={{ 
            color: '#333', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontWeight: 500
          }}
        >
          {domain}
        </Tag>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit',
                  icon: <EditOutlined />,
                  onClick: () => handleEdit(record),
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record),
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              className="border-0 shadow-none"
              style={{ 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                padding: 0,
                minWidth: 'auto'
              }}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card className="shadow-sm">
        <Table<Lead>
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          size="middle"
          bordered
          expandable={{
            expandedRowRender,
            expandRowByClick: false,
            expandIcon: expandIcon,
          }}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true, loading: loading }}
        cancelButtonProps={{ disabled: loading }}
      >
        <p>Are you sure you want to delete the lead <strong>{selectedLead?.name}</strong>?</p>
        <p>This action cannot be undone.</p>
      </Modal>

      {/* Edit Lead Modal */}
      <LeadForm
        open={editModalOpen}
        onCancel={closeEditModal}
        onSubmit={handleEditSubmit}
        initialValues={currentLead || undefined}
        title="Edit Lead"
      />
    </>
  );
}); 