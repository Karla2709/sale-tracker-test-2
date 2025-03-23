"use client";

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Row, Col, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFilterPanel, FilterValues } from '@/components/leads/LeadFilterPanel';
import { useCreateLead } from '@/hooks/useCreateLead';

export default function LeadsPage() {
  const router = useRouter();
  const leadTableRef = useRef<{ fetchLeads: (filters?: FilterValues) => void }>(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  
  const { modalOpen, leadForm, loading, handleSubmit, openModal, closeModal } = useCreateLead({
    onSuccess: () => {
      if (leadTableRef.current) {
        leadTableRef.current.fetchLeads();
      }
    }
  });

  // Set mounted flag to ensure we don't call methods before component is fully mounted
  useEffect(() => {
    setIsComponentMounted(true);
    return () => setIsComponentMounted(false);
  }, []);

  const handleFilter = useCallback((filters: FilterValues) => {
    console.log('Filter received in page:', filters);
    
    if (!isComponentMounted) {
      console.warn('Component not yet mounted, skipping filter application');
      return;
    }
    
    if (!leadTableRef.current) {
      console.warn('LeadTable ref not available, skipping filter application');
      return;
    }
    
    try {
      // Make sure to normalize arrays for multi-selects
      const normalizedFilters = {
        searchText: filters.searchText || '',
        statusFilter: Array.isArray(filters.statusFilter) ? filters.statusFilter : [],
        domainFilter: Array.isArray(filters.domainFilter) ? filters.domainFilter : [],
        dateRange: filters.dateRange,
      };
      
      console.log('Applying normalized filters:', normalizedFilters);
      leadTableRef.current.fetchLeads(normalizedFilters);
    } catch (error) {
      console.error('Error applying filters:', error);
      message.error('An error occurred while filtering leads');
    }
  }, [isComponentMounted]);

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