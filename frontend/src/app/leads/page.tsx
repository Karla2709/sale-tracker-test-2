"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFilterPanel, FilterValues } from '@/components/leads/LeadFilterPanel';
import { useCreateLead } from '@/hooks/useCreateLead';

export default function LeadsPage() {
  // Reference to the lead table component
  const leadTableRef = useRef<{ fetchLeads: (filters?: FilterValues) => void }>(null);
  
  // Create lead modal state and handlers
  const { 
    modalOpen, 
    leadForm, 
    loading, 
    handleSubmit, 
    openModal, 
    closeModal 
  } = useCreateLead({
    onSuccess: () => {
      if (leadTableRef.current) {
        leadTableRef.current.fetchLeads();
      }
    }
  });

  // Define filter handler function directly
  const handleFilter = (filters: FilterValues) => {
    console.log('Filter received in page:', filters);
    
    try {
      if (leadTableRef.current) {
        // Normalize filter values
        const normalizedFilters = {
          searchText: filters.searchText || '',
          statusFilter: Array.isArray(filters.statusFilter) ? filters.statusFilter : [],
          domainFilter: Array.isArray(filters.domainFilter) ? filters.domainFilter : [],
          dateRange: filters.dateRange,
        };
        
        console.log('Applying normalized filters:', normalizedFilters);
        leadTableRef.current.fetchLeads(normalizedFilters);
      } else {
        console.warn('LeadTable ref not available');
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      message.error('An error occurred while filtering leads');
    }
  };

  const handleAddNew = () => {
    openModal();
  };

  return (
    <main className="px-0" style={{ maxWidth: '100%' }}>
      <div className="mx-6 mb-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddNew}
          style={{ display: 'flex', alignItems: 'center' }}
          size="middle"
        >
          Add New
        </Button>
      </div>

      <div className="mx-6 mb-3">
        <LeadFilterPanel onFilter={handleFilter} />
      </div>

      <div className="px-0 w-full">
        <LeadTable ref={leadTableRef} onAddNew={handleAddNew} />
      </div>

      <Modal
        title="Add New Lead"
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width={700}
      >
        {leadForm}
      </Modal>
    </main>
  );
} 