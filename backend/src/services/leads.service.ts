import { supabase } from '../config/supabase';

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  client_domain: string;
  contact_platform: string;
  location: string;
  created_at?: string;
  last_contact_date?: string;
  note?: string;
}

export interface LeadFilters {
  search?: string;
  status?: string;
  client_domain?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export class LeadService {
  async getLeads(filters: LeadFilters) {
    try {
      const {
        search,
        status,
        client_domain,
        startDate,
        endDate,
        page = 1,
        pageSize = 10
      } = filters;

      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (client_domain) {
        query = query.eq('client_domain', client_domain);
      }
      if (startDate && endDate) {
        query = query.gte('created_at', startDate).lte('created_at', endDate);
      }

      // Apply pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);

      // Apply sorting
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data,
        total: count || 0,
        page,
        pageSize
      };
    } catch (error) {
      console.error('Error in getLeads:', error);
      throw error;
    }
  }

  async createLead(lead: Lead) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error in createLead:', error);
      throw error;
    }
  }

  async updateLead(id: string, lead: Partial<Lead>) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(lead)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error in updateLead:', error);
      throw error;
    }
  }

  async deleteLead(id: string) {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error in deleteLead:', error);
      throw error;
    }
  }

  async getLead(id: string) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error in getLead:', error);
      throw error;
    }
  }
} 