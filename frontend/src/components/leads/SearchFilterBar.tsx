'use client'

import { useState } from 'react'
import { Input, Select, Button, Card, Row, Col, Space } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { useLeads } from '@/lib/contexts/LeadContext'
import { LeadStatus, FocusDomain, ContactPlatform } from '@/lib/types/lead'

const { Option } = Select

const SearchFilterBar = () => {
  const { filter, setFilter } = useLeads()
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value: string) => {
    setFilter({ ...filter, search: value })
  }

  const handleStatusChange = (value: LeadStatus[]) => {
    setFilter({ ...filter, status: value })
  }

  const handleDomainChange = (value: FocusDomain[]) => {
    setFilter({ ...filter, focusDomain: value })
  }

  const handlePlatformChange = (value: ContactPlatform[]) => {
    setFilter({ ...filter, contactPlatform: value })
  }

  const handleLocationChange = (value: string) => {
    setFilter({ ...filter, location: value })
  }

  const clearFilters = () => {
    setFilter({})
  }

  return (
    <Card className="mb-6">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Input
            placeholder="Search by name, company, or location..."
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            value={filter.search || ''}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={24} md={12} className="flex justify-end">
          <Button 
            type="default" 
            icon={<FilterOutlined />} 
            onClick={() => setShowFilters(!showFilters)}
            size="large"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Col>
      </Row>

      {showFilters && (
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} md={6}>
            <div className="mb-2 font-medium">Status</div>
            <Select
              mode="multiple"
              placeholder="Select status"
              style={{ width: '100%' }}
              onChange={handleStatusChange}
              value={filter.status || []}
              allowClear
            >
              <Option value="New">New</Option>
              <Option value="In Contact">In Contact</Option>
              <Option value="Interested">Interested</Option>
              <Option value="Closed">Closed</Option>
              <Option value="Not Interested">Not Interested</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <div className="mb-2 font-medium">Focus Domain</div>
            <Select
              mode="multiple"
              placeholder="Select domain"
              style={{ width: '100%' }}
              onChange={handleDomainChange}
              value={filter.focusDomain || []}
              allowClear
            >
              <Option value="Container Shipping">Container Shipping</Option>
              <Option value="Drop Shipping">Drop Shipping</Option>
              <Option value="Ecommerce">Ecommerce</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <div className="mb-2 font-medium">Contact Platform</div>
            <Select
              mode="multiple"
              placeholder="Select platform"
              style={{ width: '100%' }}
              onChange={handlePlatformChange}
              value={filter.contactPlatform || []}
              allowClear
            >
              <Option value="LinkedIn">LinkedIn</Option>
              <Option value="Email">Email</Option>
              <Option value="Referral">Referral</Option>
              <Option value="Conference">Conference</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <div className="mb-2 font-medium">Location</div>
            <Input
              placeholder="Filter by location"
              onChange={(e) => handleLocationChange(e.target.value)}
              value={filter.location || ''}
              allowClear
            />
          </Col>
          <Col xs={24} className="flex justify-end mt-2">
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </Col>
        </Row>
      )}
    </Card>
  )
}

export default SearchFilterBar 