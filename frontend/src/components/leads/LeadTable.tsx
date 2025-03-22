import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, Card, Input, Select, Button, Space, DatePicker, Tag, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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

const { RangePicker } = DatePicker;
const { Option } = Select;

const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'New': '#808080', // gray
    'Reached Out': '#87CEEB', // light blue
    'Meeting Scheduled': '#0000FF', // blue
    'First Meeting Complete': '#FFFFE0', // light yellow
    'Second Meeting Completed': '#FFFF00', // yellow
    'In Dilligence': '#FFA500', // orange
    'Close Deal': '#008000', // green
    'Prospect Decline': '#FF0000', // red
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
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [domainFilter, setDomainFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchLeads = async (params: any = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: params.page?.toString() || '1',
        pageSize: params.pageSize?.toString() || '10',
        ...(searchText && { search: searchText }),
        ...(statusFilter && { status: statusFilter }),
        ...(domainFilter && { client_domain: domainFilter }),
        ...(dateRange?.[0] && { startDate: dateRange[0].toISOString() }),
        ...(dateRange?.[1] && { endDate: dateRange[1].toISOString() }),
      });

      const response = await fetch(`http://localhost:3001/api/leads?${queryParams}`);
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
    fetchLeads: () => fetchLeads(),
  }));

  useEffect(() => {
    fetchLeads();
  }, []); // Initial fetch

  const handleTableChange = (newPagination: any, filters: any, sorter: any) => {
    fetchLeads({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  const handleSearch = () => {
    fetchLeads({ page: 1 }); // Reset to first page when searching
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
        <Tag color={getStatusColor(status)} style={{ color: '#000' }}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'New', value: 'New' },
        { text: 'Reached Out', value: 'Reached Out' },
        { text: 'Meeting Scheduled', value: 'Meeting Scheduled' },
        { text: 'First Meeting Complete', value: 'First Meeting Complete' },
        { text: 'Second Meeting Completed', value: 'Second Meeting Completed' },
        { text: 'In Dilligence', value: 'In Dilligence' },
        { text: 'Close Deal', value: 'Close Deal' },
        { text: 'Prospect Decline', value: 'Prospect Decline' },
      ],
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
        <Tag color={getDomainColor(domain)} style={{ color: '#000' }}>
          {domain}
        </Tag>
      ),
      filters: [
        { text: 'Container Shipping', value: 'Container Shipping' },
        { text: 'Ecommerce', value: 'Ecommerce' },
        { text: 'Healthcare', value: 'Healthcare' },
        { text: 'Others', value: 'Others' },
      ],
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
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap>
          <Input
            placeholder="Search leads..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="Status"
            style={{ width: 200 }}
            onChange={setStatusFilter}
            allowClear
          >
            <Option value="New">New</Option>
            <Option value="Reached Out">Reached Out</Option>
            <Option value="Meeting Scheduled">Meeting Scheduled</Option>
            <Option value="First Meeting Complete">First Meeting Complete</Option>
            <Option value="Second Meeting Completed">Second Meeting Completed</Option>
            <Option value="In Dilligence">In Dilligence</Option>
            <Option value="Close Deal">Close Deal</Option>
            <Option value="Prospect Decline">Prospect Decline</Option>
          </Select>
          <Select
            placeholder="Client Domain"
            style={{ width: 180 }}
            onChange={setDomainFilter}
            allowClear
          >
            <Option value="Container Shipping">Container Shipping</Option>
            <Option value="Ecommerce">Ecommerce</Option>
            <Option value="Healthcare">Healthcare</Option>
            <Option value="Others">Others</Option>
          </Select>
          <RangePicker onChange={setDateRange} />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
            Add New Lead
          </Button>
        </Space>
        <Table<Lead>
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
      </Space>
    </Card>
  );
}); 