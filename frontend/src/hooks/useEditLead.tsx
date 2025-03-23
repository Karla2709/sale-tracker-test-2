import React, { useState } from 'react';
import { Form, message } from 'antd';

interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  client_domain: string;
  contact_platform: string;
  location: string;
  note?: string;
  created_at?: string;
  last_contact_date?: string;
}

interface UseEditLeadProps {
  onSuccess?: () => void;
}

export const useEditLead = ({ onSuccess }: UseEditLeadProps = {}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [form] = Form.useForm<Lead>();

  const openModal = (lead: Lead) => {
    setCurrentLead(lead);
    form.setFieldsValue(lead);
    setModalOpen(true);
  };

  const closeModal = () => {
    form.resetFields();
    setModalOpen(false);
    setCurrentLead(null);
  };

  const handleSubmit = async (values: Lead) => {
    if (!currentLead?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/leads/${currentLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      message.success('Lead updated successfully');
      closeModal();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      message.error('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  return {
    modalOpen,
    currentLead,
    form,
    loading,
    handleSubmit,
    openModal,
    closeModal,
  };
}; 