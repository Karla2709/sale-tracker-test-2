import { supabase, supabaseAdmin } from '../config/supabase';

/**
 * Database Service - Provides methods for interacting with Supabase
 */
class DatabaseService {
  /**
   * Get all companies
   */
  async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  /**
   * Get a company by ID
   */
  async getCompanyById(id: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Create a new company
   */
  async createCompany(companyData: any) {
    const { data, error } = await supabaseAdmin
      .from('companies')
      .insert(companyData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Update a company
   */
  async updateCompany(id: string, companyData: any) {
    const { data, error } = await supabaseAdmin
      .from('companies')
      .update(companyData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Delete a company
   */
  async deleteCompany(id: string) {
    const { error } = await supabaseAdmin
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }

  /**
   * Get all leads
   */
  async getLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        company:companies(id, name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  /**
   * Get a lead by ID
   */
  async getLeadById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        company:companies(id, name, industry, website),
        interactions(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Create a new lead
   */
  async createLead(leadData: any) {
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Update a lead
   */
  async updateLead(id: string, leadData: any) {
    const { data, error } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Delete a lead
   */
  async deleteLead(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }

  /**
   * Get all deals
   */
  async getDeals() {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        lead:leads(id, name),
        user:users(id, full_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    // Get lead count by status
    const { data: leadsByStatus, error: leadsError } = await supabase
      .rpc('get_leads_by_status');
    
    if (leadsError) throw leadsError;

    // Get deal count by stage
    const { data: dealsByStage, error: dealsError } = await supabase
      .rpc('get_deals_by_stage');
    
    if (dealsError) throw dealsError;

    // Get recent interactions
    const { data: recentInteractions, error: interactionsError } = await supabase
      .from('interactions')
      .select(`
        *,
        lead:leads(id, name),
        user:users(id, full_name)
      `)
      .order('date', { ascending: false })
      .limit(5);
    
    if (interactionsError) throw interactionsError;

    return {
      leadsByStatus,
      dealsByStage,
      recentInteractions
    };
  }
}

export default new DatabaseService(); 