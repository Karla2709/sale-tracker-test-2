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
      // Hardcode the API URL
      const apiUrl = 'http://localhost:3001';
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
    statusFilter: [],
    domainFilter: [],
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

      console.log('fetchLeads called with filters:', activeFilters);

      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', params.page?.toString() || pagination.current.toString());
      queryParams.append('pageSize', params.pageSize?.toString() || pagination.pageSize.toString());
      
      // Add search filter
      if (activeFilters.searchText) {
        queryParams.append('search', activeFilters.searchText);
      }
      
      // Add status filter - handle array properly
      if (activeFilters.statusFilter && activeFilters.statusFilter.length > 0) {
        // Convert array to comma-separated string
        queryParams.append('status', activeFilters.statusFilter.join(','));
      }
      
      // Add domain filter - handle array properly
      if (activeFilters.domainFilter && activeFilters.domainFilter.length > 0) {
        // Convert array to comma-separated string
        queryParams.append('client_domain', activeFilters.domainFilter.join(','));
      }
      
      // Add date range filters
      if (activeFilters.dateRange?.[0]) {
        queryParams.append('startDate', activeFilters.dateRange[0].toISOString());
      }
      
      if (activeFilters.dateRange?.[1]) {
        queryParams.append('endDate', activeFilters.dateRange[1].toISOString());
      }

      console.log('Fetching leads with params:', queryParams.toString());
      
      // Hardcode the API URL to ensure it's correct
      const apiUrl = 'http://localhost:3001';
      const url = `${apiUrl}/api/leads?${queryParams.toString()}`;
      console.log('API URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `Failed to fetch leads: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('Received data:', result);

      // Ensure we have valid data
      if (!result.data) {
        console.error('No data property in response:', result);
        message.error('Invalid data format received from server');
        return;
      }
      
      // If data is not an array, wrap it in an array
      const leadData = Array.isArray(result.data) ? result.data : [result.data];
      console.log('Processed lead data:', leadData);

      setData(leadData);
      setPagination({
        ...pagination,
        total: result.total || leadData.length,
        current: result.page || pagination.current,
        pageSize: result.pageSize || pagination.pageSize,
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
      message.error(`Failed to fetch leads: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchLeads through the ref
  useImperativeHandle(ref, () => ({
    fetchLeads: (filters?: FilterValues) => {
      console.log('fetchLeads called via ref with filters:', filters);
      return fetchLeads(filters);
    },
  }), []);

  useEffect(() => {
    console.log('LeadTable mounted, fetching initial data');
    fetchLeads();
    
    // Expose a global debug function to allow manual refreshing in case of issues
    if (typeof window !== 'undefined') {
      (window as any).__refreshLeads = () => {
        console.log('Manual refresh triggered');
        fetchLeads();
      };
    }
    
    return () => {
      // Clean up if needed
      if (typeof window !== 'undefined') {
        delete (window as any).__refreshLeads;
      }
    };
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
      // Hardcode the API URL
      const apiUrl = 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leads/${selectedLead.id}`, {
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
        className="shadow-sm w-full" 
        styles={{ body: { padding: '12px 16px' } }}
        style={{ width: '100%', margin: 0 }}
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