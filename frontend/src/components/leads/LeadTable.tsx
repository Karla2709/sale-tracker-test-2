import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, Card, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Tag } from 'antd';
import { FilterValues } from './LeadFilterPanel';

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

  const columns: ColumnsType<Lead> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      fixed: 'left',
      width: 150,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} style={{ color: '#333', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: 'Client Domain',
      dataIndex: 'client_domain',
      key: 'client_domain',
      width: 150,
      render: (domain: string) => (
        <Tag color={getDomainColor(domain)} style={{ color: '#333', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
          {domain}
        </Tag>
      ),
    },
    {
      title: 'Contact Platform',
      dataIndex: 'contact_platform',
      key: 'contact_platform',
      width: 150,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => dayjs(date).format('DD-MMM-YYYY'),
      sorter: true,
    },
    {
      title: 'Last Contact Date',
      dataIndex: 'last_contact_date',
      key: 'last_contact_date',
      width: 150,
      render: (date: string) => dayjs(date).format('DD-MMM-YYYY'),
      sorter: true,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      width: 300,
      ellipsis: true,
    },
  ];

  return (
    <Card 
      className="shadow-sm" 
      bodyStyle={{ padding: '16px 25px' }}
    >
      <Table<Lead>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: '100%', y: 'calc(100vh - 380px)' }}
        size="middle"
        bordered
      />
    </Card>
  );
}); 