"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFilterPanel, FilterValues } from '@/components/leads/LeadFilterPanel';
import { useCreateLead } from '@/hooks/useCreateLead';

// Extend Window interface to include our custom property
declare global {
  interface Window {
    _pendingFilters?: FilterValues;
  }
}

export default function LeadsPage() {
  // Reference to the lead table component
  const leadTableRef = useRef<{ fetchLeads: (filters?: FilterValues) => void } | null>(null);
  // Store pending filters locally as well
  const [pendingFilters, setPendingFilters] = useState<FilterValues | null>(null);
  
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

  // Function to handle filtration - defined before it's ever used by child components
  const handleFilter = (filters: FilterValues) => {
    if (!leadTableRef.current) {
      // Store filter values to apply once table is ready
      console.log('Table ref not ready, storing filters for later application');
      // Save the filter values in state and global for resilience
      setPendingFilters(filters);
      window._pendingFilters = filters;
      return;
    }
    
    try {
      console.log('Applying filters to table:', filters);
      // Normalize filter values
      const normalizedFilters = {
        searchText: filters.searchText || '',
        statusFilter: Array.isArray(filters.statusFilter) ? filters.statusFilter : [],
        domainFilter: Array.isArray(filters.domainFilter) ? filters.domainFilter : [],
        dateRange: filters.dateRange,
      };
      
      // Apply filters to the table
      leadTableRef.current.fetchLeads(normalizedFilters);
    } catch (error) {
      console.error('Error applying filters:', error);
      message.error('An error occurred while filtering leads');
    }
  };

  // Check if there are pending filters to apply once the ref is ready
  useEffect(() => {
    // Wait for the leadTableRef to be initialized
    if (leadTableRef.current) {
      // Check both local state and window storage
      const filtersToApply = pendingFilters || window._pendingFilters;
      if (filtersToApply) {
        console.log('Applying pending filters now that table is ready');
        handleFilter(filtersToApply);
        setPendingFilters(null);
        window._pendingFilters = undefined;
      }
    }
  }, [leadTableRef.current, pendingFilters]);

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