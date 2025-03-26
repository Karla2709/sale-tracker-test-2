"use client";

import React, { useRef } from 'react';
import { Modal, Button } from 'antd';
import { PlusOutlined, ImportOutlined } from '@ant-design/icons';
import { LeadTable } from '@/components/leads/LeadTable';
import { useCreateLead } from '@/hooks/useCreateLead';

export default function LeadsPage() {
  // Reference to the lead table component
  const leadTableRef = useRef<{ fetchLeads: () => void } | null>(null);
  
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

  const handleAddNew = () => {
    openModal();
  };

  return (
    <main className="px-0" style={{ maxWidth: '100%' }}>
      <div className="mx-6 mb-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={handleAddNew}
            icon={<PlusOutlined />}
          >
            Add New
          </Button>
          <Button
            type="default"
            disabled
            icon={<ImportOutlined />}
          >
            Import from n8n
          </Button>
        </div>
      </div>

      <div className="w-full px-0" style={{ width: '100%', maxWidth: '100vw', overflow: 'visible' }}>
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