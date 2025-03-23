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

export const LeadTable = forwardRef<{ fetchLeads: (filters?: FilterValues) => void }, LeadTableProps>(({ onAddNew }, ref) => {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<Lead[]>([]); // Store all data
  const [filteredData, setFilteredData] = useState<Lead[]>([]); // Store filtered data
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // Store current filters
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
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

      setAllData(result.data);
      applyFilters(result.data, activeFilters);
    } catch (error) {
      console.error('Error loading leads:', error);
      message.error(typeof error === 'string' ? error : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to the data
  const applyFilters = (data: Lead[], filters: FilterValues) => {
    try {
      // Start with all data
      let result = [...data];
      
      // Search by text (name, email, phone)
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        result = result.filter(lead => 
          (lead.name && lead.name.toLowerCase().includes(searchLower)) ||
          (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
          (lead.phone && lead.phone.toLowerCase().includes(searchLower))
        );
      }
      
      // Filter by status - handle both string and array types
      if (filters.statusFilter && 
          (Array.isArray(filters.statusFilter) ? filters.statusFilter.length > 0 : filters.statusFilter)) {
        const statusFilters = Array.isArray(filters.statusFilter) 
          ? filters.statusFilter 
          : [filters.statusFilter];
        
        result = result.filter(lead => lead.status && statusFilters.includes(lead.status));
      }
      
      // Filter by client domain - handle both string and array types
      if (filters.domainFilter && 
          (Array.isArray(filters.domainFilter) ? filters.domainFilter.length > 0 : filters.domainFilter)) {
        const domainFilters = Array.isArray(filters.domainFilter) 
          ? filters.domainFilter 
          : [filters.domainFilter];
        
        result = result.filter(lead => lead.client_domain && domainFilters.includes(lead.client_domain));
      }
      
      // Filter by date range (last contact date)
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const startDate = dayjs(filters.dateRange[0]).startOf('day');
        const endDate = dayjs(filters.dateRange[1]).endOf('day');
        
        result = result.filter(lead => {
          if (!lead.last_contact_date) return false;
          
          const contactDate = dayjs(lead.last_contact_date);
          return contactDate.isAfter(startDate) && contactDate.isBefore(endDate);
        });
      }
      
      // Update filtered data and pagination
      setFilteredData(result);
      setPagination({
        ...pagination,
        current: 1, // Reset to first page when filters change
        total: result.length,
      });
    } catch (error) {
      console.error('Error applying filters:', error);
      // Don't change the filtered data if there's an error
    }
  };

  // Public method to update filters
  const updateFilters = (newFilters: FilterValues) => {
    console.log('Updating filters:', newFilters);
    try {
      // Create a safe copy of filters with default values for missing properties
      const safeFilters = {
        searchText: newFilters.searchText || '',
        statusFilter: newFilters.statusFilter || [],
        domainFilter: newFilters.domainFilter || [],
        dateRange: newFilters.dateRange || null
      };
      
      setActiveFilters(safeFilters);
      applyFilters(allData, safeFilters);
    } catch (error) {
      console.error('Error updating filters:', error);
    }
  };

  // Expose fetchLeads through the ref (now just updates filters)
  useImperativeHandle(ref, () => ({
    fetchLeads: (filters?: FilterValues) => {
      console.log('fetchLeads called with filters:', filters);
      try {
        if (filters) {
          updateFilters(filters);
        } else {
          // If no filters provided, refresh data from API
          return loadAllLeads();
        }
      } catch (error) {
        console.error('Error in fetchLeads:', error);
      }
      return Promise.resolve();
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

  const cellStyle = { 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap' as const
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
      render: (date: string) => <Text>{date ? dayjs(date).format('DD-MMM-YYYY') : ''}</Text>,
      sorter: (a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return dayjs(a.created_at).unix() - dayjs(b.created_at).unix();
      },
    },
    {
      title: 'Last Contact Date',
      dataIndex: 'last_contact_date',
      key: 'last_contact_date',
      width: 150,
      render: (date: string) => <Text>{date ? dayjs(date).format('DD-MMM-YYYY') : ''}</Text>,
      sorter: (a, b) => {
        if (!a.last_contact_date || !b.last_contact_date) return 0;
        return dayjs(a.last_contact_date).unix() - dayjs(b.last_contact_date).unix();
      },
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
          dataSource={filteredData}
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