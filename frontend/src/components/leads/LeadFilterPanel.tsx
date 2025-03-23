import React, { useState } from 'react';
import { Card, Input, Row, Col, Select, DatePicker, Button, Space, Typography, Divider } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Search } = Input;

export interface FilterValues {
  searchText: string;
  statusFilter: string[] | string | undefined;
  domainFilter: string[] | string | undefined;
  dateRange: [Dayjs, Dayjs] | null;
}

interface LeadFilterPanelProps {
  onFilter: (values: FilterValues) => void;
  onAddNew?: () => void;
}

const statusOptions = [
  { value: 'New', label: 'New' },
  { value: 'Reached Out', label: 'Reached Out' },
  { value: 'Meeting Scheduled', label: 'Meeting Scheduled' },
  { value: 'First Meeting Complete', label: 'First Meeting Complete' },
  { value: 'Second Meeting Completed', label: 'Second Meeting Completed' },
  { value: 'In Dilligence', label: 'In Dilligence' },
  { value: 'Close Deal', label: 'Close Deal' },
  { value: 'Prospect Decline', label: 'Prospect Decline' },
];

const domainOptions = [
  { value: 'Container Shipping', label: 'Container Shipping' },
  { value: 'Ecommerce', label: 'Ecommerce' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Others', label: 'Others' },
];

export const LeadFilterPanel: React.FC<LeadFilterPanelProps> = ({ onFilter }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[] | undefined>(undefined);
  const [domainFilter, setDomainFilter] = useState<string[] | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const handleSearch = () => {
    onFilter({
      searchText,
      statusFilter,
      domainFilter,
      dateRange,
    });
  };

  const handleReset = () => {
    setSearchText('');
    setStatusFilter(undefined);
    setDomainFilter(undefined);
    setDateRange(null);
    
    onFilter({
      searchText: '',
      statusFilter: undefined,
      domainFilter: undefined,
      dateRange: null,
    });
  };

  return (
    <Card 
      className="shadow-sm mb-3" 
      bodyStyle={{ padding: '16px 25px' }}
      style={{ marginBottom: '8px' }}
    >
      <div className="flex items-center mb-2">
        <FilterOutlined className="mr-2 text-blue-500" />
        <span className="text-lg font-medium">Search & Filter</span>
      </div>
      
      {/* First line: Search input and buttons */}
      <Row gutter={[12, 12]} className="mb-2">
        <Col xs={24} sm={24} md={18} lg={20} xl={20}>
          <Search
            placeholder="Search by name, email, phone..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            enterButton={
              <Button type="primary">
                <SearchOutlined /> Search
              </Button>
            }
            allowClear
            size="middle"
          />
        </Col>
        
        <Col xs={24} sm={24} md={6} lg={4} xl={4}>
          <div className="flex justify-end">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              block
            >
              Reset
            </Button>
          </div>
        </Col>
      </Row>
      
      <Divider style={{ margin: '6px 0' }} />
      
      {/* Second line: Filter options */}
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="mb-1">
            <Text type="secondary" strong>Status</Text>
          </div>
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              onFilter({
                searchText,
                statusFilter: value,
                domainFilter,
                dateRange,
              });
            }}
            style={{ width: '100%' }}
            options={statusOptions}
            allowClear
            showSearch
            mode="multiple"
            maxTagCount={1}
          />
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="mb-1">
            <Text type="secondary" strong>Client Domain</Text>
          </div>
          <Select
            placeholder="Filter by domain"
            value={domainFilter}
            onChange={(value) => {
              setDomainFilter(value);
              onFilter({
                searchText,
                statusFilter,
                domainFilter: value,
                dateRange,
              });
            }}
            style={{ width: '100%' }}
            options={domainOptions}
            allowClear
            showSearch
            mode="multiple"
            maxTagCount={1}
          />
        </Col>
        
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text type="secondary" strong style={{ display: 'flex', alignItems: 'center' }}>
              <CalendarOutlined style={{ marginRight: 4 }} /> Last Contact Date
            </Text>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                const typedDates = dates as [Dayjs, Dayjs] | null;
                setDateRange(typedDates);
                onFilter({
                  searchText,
                  statusFilter,
                  domainFilter,
                  dateRange: typedDates,
                });
              }}
              style={{ width: '100%' }}
              allowClear
            />
          </Space>
        </Col>
      </Row>
    </Card>
  );
}; 