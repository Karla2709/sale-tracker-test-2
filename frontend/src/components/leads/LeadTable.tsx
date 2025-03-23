import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, Card, message, Dropdown, Button, Modal, Typography, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Tag } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FilterValues } from './LeadFilterPanel';
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
  onAddNew: () => void;
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
      const response = await fetch(`/api/leads/${currentLead.id}`, {
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

export const LeadTable = forwardRef<{ fetchLeads: (filters?: FilterValues) => void }, LeadTableProps>(({ onAddNew }, ref) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // Store current filters
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    searchText: '',
    statusFilter: undefined,
    domainFilter: undefined,
    dateRange: null,
  });

  // State for delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Use the edit lead hook
  const { 
    modalOpen: editModalOpen, 
    currentLead,
    handleSubmit: handleEditSubmit, 
    openModal: openEditModal, 
    closeModal: closeEditModal 
  } = useEditLead({
    onSuccess: () => fetchLeads()
  });

  const fetchLeads = async (filters?: FilterValues, params: any = {}) => {
    try {
      setLoading(true);
      
      // Update current filters if new ones are provided
      const activeFilters = filters || currentFilters;
      if (filters) {
        setCurrentFilters(filters);
      }

      // Helper function to handle arrays for filters
      const getFilterParams = (filter: string[] | string | undefined) => {
        if (Array.isArray(filter)) {
          return filter.join(',');
        }
        return filter;
      };
      
      const queryParams = new URLSearchParams({
        page: params.page?.toString() || pagination.current.toString(),
        pageSize: params.pageSize?.toString() || pagination.pageSize.toString(),
        ...(activeFilters.searchText && { search: activeFilters.searchText }),
        ...(activeFilters.statusFilter && { status: getFilterParams(activeFilters.statusFilter) }),
        ...(activeFilters.domainFilter && { client_domain: getFilterParams(activeFilters.domainFilter) }),
        ...(activeFilters.dateRange?.[0] && { startDate: activeFilters.dateRange[0].toISOString() }),
        ...(activeFilters.dateRange?.[1] && { endDate: activeFilters.dateRange[1].toISOString() }),
      });

      const response = await fetch(`/api/leads?${queryParams}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to fetch leads');

      setData(result.data);
      setPagination({
        ...pagination,
        total: result.total,
        current: result.page,
        pageSize: result.pageSize,
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
      message.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchLeads: (filters?: FilterValues) => fetchLeads(filters),
  }));

  useEffect(() => {
    fetchLeads();
  }, []); // Initial fetch

  const handleTableChange = (newPagination: any, filters: any, sorter: any) => {
    fetchLeads(undefined, {
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
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
      const response = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }

      message.success('Lead deleted successfully');
      fetchLeads(); // Refresh the list
      setDeleteModalVisible(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
      message.error('Failed to delete lead');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Lead> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 150,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: string) => (
        <Tag 
          color={getStatusColor(status)} 
          style={{ 
            color: '#333', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontWeight: 500,
            maxWidth: '100%',
            display: 'inline-block',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: '1.4'
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: 'Client Domain',
      dataIndex: 'client_domain',
      key: 'client_domain',
      width: 160,
      render: (domain: string) => (
        <Tag 
          color={getDomainColor(domain)} 
          style={{ 
            color: '#333', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontWeight: 500,
            maxWidth: '100%',
            display: 'inline-block',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: '1.4'
          }}
        >
          {domain}
        </Tag>
      ),
    },
    {
      title: 'Contact Platform',
      dataIndex: 'contact_platform',
      key: 'contact_platform',
      width: 150,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 150,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => <Text>{dayjs(date).format('DD-MMM-YYYY')}</Text>,
      sorter: true,
    },
    {
      title: 'Last Contact Date',
      dataIndex: 'last_contact_date',
      key: 'last_contact_date',
      width: 150,
      render: (date: string) => <Text>{dayjs(date).format('DD-MMM-YYYY')}</Text>,
      sorter: true,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      width: 300,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 70,
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
      <Card 
        className="shadow-sm" 
        bodyStyle={{ padding: '12px 16px' }}
        style={{ width: '100%' }}
      >
        <Table<Lead>
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1800, y: 'calc(100vh - 340px)' }}
          size="middle"
          bordered
          style={{ width: '100%' }}
          tableLayout="fixed"
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