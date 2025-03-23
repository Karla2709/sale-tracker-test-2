"use client";

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Row, Col, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFilterPanel, FilterValues } from '@/components/leads/LeadFilterPanel';
import { useCreateLead } from '@/hooks/useCreateLead';

export default function LeadsPage() {
  const router = useRouter();
  const leadTableRef = useRef<{ fetchLeads: (filters?: FilterValues) => void }>(null);
  const { modalOpen, leadForm, loading, handleSubmit, openModal, closeModal } = useCreateLead({
    onSuccess: () => {
      if (leadTableRef.current) {
        leadTableRef.current.fetchLeads();
      }
    }
  });

  const handleFilter = (filters: FilterValues) => {
    if (leadTableRef.current) {
      leadTableRef.current.fetchLeads(filters);
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

      <div className="mx-6">
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