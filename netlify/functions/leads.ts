import { Handler } from '@netlify/functions';
import { apiHandler, sendSuccess, sendError } from './utils/api';
import { supabase } from './utils/supabase';

const handler: Handler = apiHandler(async (event) => {
  // GET /api/leads
  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        company:companies(name, industry)
      `);
    
    if (error) {
      console.error('Error fetching leads:', error);
      return sendError(500, 'Failed to fetch leads');
    }
    
    return sendSuccess(data);
  }
  
  // POST /api/leads (create new lead)
  if (event.httpMethod === 'POST' && event.body) {
    const leadData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select();
      
    if (error) {
      console.error('Error creating lead:', error);
      return sendError(500, 'Failed to create lead');
    }
    
    return sendSuccess(data);
  }
  
  // PUT /api/leads/:id (update lead)
  if (event.httpMethod === 'PUT' && event.body) {
    const leadId = event.path.split('/').pop();
    const leadData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', leadId)
      .select();
      
    if (error) {
      console.error('Error updating lead:', error);
      return sendError(500, 'Failed to update lead');
    }
    
    return sendSuccess(data);
  }
  
  // DELETE /api/leads/:id
  if (event.httpMethod === 'DELETE') {
    const leadId = event.path.split('/').pop();
    
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);
      
    if (error) {
      console.error('Error deleting lead:', error);
      return sendError(500, 'Failed to delete lead');
    }
    
    return sendSuccess({ message: 'Lead deleted successfully' });
  }
  
  return sendError(405, 'Method Not Allowed');
});

export { handler }; 