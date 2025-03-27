import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, message, Dropdown, Button, Modal, Typography, Form, Tag, Spin, Input, Select, Row, Col, Space } from 'antd';
import dayjs from 'dayjs';
import { MoreOutlined, EditOutlined, DeleteOutlined, DownOutlined, RightOutlined, SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { LeadForm } from './LeadForm';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getExpandedRowModel,
  ExpandedState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import './TanStackTable.css';

const { Text } = Typography;
const { Option } = Select;

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

interface TanStackLeadTableProps {
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

// Add an array of available statuses and domains for filter options
const LEAD_STATUSES = [
  'New', 
  'Reached Out', 
  'Meeting Scheduled', 
  'First Meeting Complete', 
  'Second Meeting Completed', 
  'In Dilligence', 
  'Close Deal', 
  'Prospect Decline'
];

const CLIENT_DOMAINS = [
  'Container Shipping',
  'Ecommerce',
  'Healthcare',
  'Others'
];

export const TanStackLeadTable = forwardRef<{ fetchLeads: () => void }, TanStackLeadTableProps>(({ onAddNew }, ref) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Lead[]>([]); // Store all data
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<Lead[]>([]);

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

  // Expanded row render function
  const renderExpandedRow = (lead: Lead) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
        <div className="detail-section">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Contact Details</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value font-medium">{lead.email || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value font-medium">{lead.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value font-medium">{lead.location || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Contact Platform:</span>
              <span className="detail-value font-medium">{lead.contact_platform || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="detail-section">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Timeline</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="detail-item">
              <span className="detail-label">Created Date:</span>
              <span className="detail-value font-medium">
                {lead.created_at ? dayjs(lead.created_at).format('DD-MMM-YYYY') : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Contact:</span>
              <span className="detail-value font-medium">
                {lead.last_contact_date ? dayjs(lead.last_contact_date).format('DD-MMM-YYYY') : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        
        {lead.note && (
          <div className="col-span-1 md:col-span-2 mt-2">
            <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Notes</h4>
            <div className="bg-white p-4 rounded-md border border-gray-200 text-gray-800 shadow-sm">
              {lead.note}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Column definitions with TanStack
  const columnHelper = createColumnHelper<Lead>();

  const columns = [
    columnHelper.display({
      id: 'expander',
      header: () => null,
      cell: ({ row }) => {
        const isExpanded = row.getIsExpanded();
        return (
          <button
            onClick={() => row.toggleExpanded()}
            className={`expander-button ${isExpanded ? 'expander-button-expanded' : ''}`}
          >
            {isExpanded ? (
              <DownOutlined className="expander-icon expander-icon-expanded" />
            ) : (
              <RightOutlined className="expander-icon" />
            )}
          </button>
        );
      },
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('client_domain', {
      header: 'Domain',
      cell: (info) => (
        <Tag 
          color={getDomainColor(info.getValue())} 
          style={{ 
            color: '#333', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontWeight: 500
          }}
        >
          {info.getValue()}
        </Tag>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <Tag 
          color={getStatusColor(info.getValue())} 
          style={{ 
            color: '#333', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontWeight: 500
          }}
        >
          {info.getValue()}
        </Tag>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit',
                  icon: <EditOutlined />,
                  onClick: () => handleEdit(row.original),
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(row.original),
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
    }),
  ];

  // Apply filters and search
  useEffect(() => {
    let result = [...data];
    
    // Apply search across name, email, and phone
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.split('/').map(term => term.trim().toLowerCase());
      
      result = result.filter(lead => {
        // For each lead, check if any of the search terms match any of the fields
        return searchTerms.some(term => 
          lead.name.toLowerCase().includes(term) || 
          lead.email.toLowerCase().includes(term) || 
          lead.phone.toLowerCase().includes(term)
        );
      });
    }
    
    // Apply domain filter
    if (selectedDomains.length > 0) {
      result = result.filter(lead => selectedDomains.includes(lead.client_domain));
    }
    
    // Apply status filter
    if (selectedStatuses.length > 0) {
      result = result.filter(lead => selectedStatuses.includes(lead.status));
    }
    
    setFilteredData(result);
  }, [data, searchQuery, selectedDomains, selectedStatuses]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDomains([]);
    setSelectedStatuses([]);
  };

  // Use filteredData for the table instead of data
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      pagination,
      expanded,
    },
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded as any, // Type cast to avoid TypeScript errors
    manualPagination: false,
    debugTable: true,
  });

  return (
    <>
      {/* Search and Filter Bar */}
      <Card className="shadow-sm mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search name, email, phone (separate terms with /)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Filter by domain"
              value={selectedDomains}
              onChange={setSelectedDomains}
              allowClear
              maxTagCount="responsive"
            >
              {CLIENT_DOMAINS.map(domain => (
                <Option key={domain} value={domain}>
                  <Tag color={getDomainColor(domain)} style={{ color: '#333', borderRadius: '12px' }}>
                    {domain}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Filter by status"
              value={selectedStatuses}
              onChange={setSelectedStatuses}
              allowClear
              maxTagCount="responsive"
            >
              {LEAD_STATUSES.map(status => (
                <Option key={status} value={status}>
                  <Tag color={getStatusColor(status)} style={{ color: '#333', borderRadius: '12px' }}>
                    {status}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Button 
              onClick={handleResetFilters}
              icon={<ReloadOutlined />}
              style={{ width: '100%' }}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table Card */}
      <Card className="shadow-sm tanstack-card">
        <div className="tanstack-table-container">
          {loading && (
            <div className="tanstack-table-loading">
              <Spin size="large" />
            </div>
          )}
          <table className="tanstack-table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className={header.id === 'expander' ? 'p-0' : ''}>
                      {header.isPlaceholder ? null : 
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      }
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <tr>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className={cell.column.id === 'expander' || cell.column.id === 'actions' ? 'p-0' : ''}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={row.getVisibleCells().length} className="p-0">
                        <div className="expanded-row-content">
                          {renderExpandedRow(row.original)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {/* Show message when no data matches filters */}
          {filteredData.length === 0 && !loading && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No leads match your search criteria.</p>
              <Button onClick={handleResetFilters} type="link">
                Reset filters
              </Button>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="tanstack-table-pagination">
          <div className="tanstack-table-pagination-buttons">
            <Button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </Button>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </Button>
            <Button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="pagination-info">
              Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{' '}
              <span className="font-medium">{table.getPageCount()}</span>
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="pagination-select"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
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