import React, { useState } from 'react';
import { Card, Input, Select, Button, Space, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface LeadFilterPanelProps {
  onSearch: (filters: FilterValues) => void;
  onAddNew: () => void;
}

export interface FilterValues {
  searchText: string;
  statusFilter?: string;
  domainFilter?: string;
  dateRange?: [any, any] | null;
}

export const LeadFilterPanel: React.FC<LeadFilterPanelProps> = ({ onSearch, onAddNew }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [domainFilter, setDomainFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  const handleSearch = () => {
    onSearch({
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
    
    onSearch({
      searchText: '',
      statusFilter: undefined,
      domainFilter: undefined,
      dateRange: null,
    });
  };

  return (
    <Card className="mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex items-center mb-4 sm:mb-0">
          <FilterOutlined className="mr-2 text-blue-500" />
          <span className="text-lg font-medium">Search & Filter</span>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddNew}
          size="middle"
          className="self-end sm:self-auto"
        >
          Add New Lead
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder="Search leads..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
        <div>
          <Select
            placeholder="Status"
            style={{ width: '100%' }}
            value={statusFilter}
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
        </div>
        <div>
          <Select
            placeholder="Client Domain"
            style={{ width: '100%' }}
            value={domainFilter}
            onChange={setDomainFilter}
            allowClear
          >
            <Option value="Container Shipping">Container Shipping</Option>
            <Option value="Ecommerce">Ecommerce</Option>
            <Option value="Healthcare">Healthcare</Option>
            <Option value="Others">Others</Option>
          </Select>
        </div>
        <div>
          <RangePicker 
            style={{ width: '100%' }} 
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Space>
          <Button onClick={handleReset}>Reset</Button>
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </Space>
      </div>
    </Card>
  );
}; 