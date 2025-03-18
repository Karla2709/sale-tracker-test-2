import { Handler } from '@netlify/functions';
import { apiHandler, sendSuccess, sendError } from './utils/api';
import { supabase } from './utils/supabase';

const handler: Handler = apiHandler(async (event) => {
  // GET /api/companies
  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) {
      console.error('Error fetching companies:', error);
      return sendError(500, 'Failed to fetch companies');
    }
    
    return sendSuccess(data);
  }
  
  // POST /api/companies (create new company)
  if (event.httpMethod === 'POST' && event.body) {
    const companyData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('companies')
      .insert(companyData)
      .select();
      
    if (error) {
      console.error('Error creating company:', error);
      return sendError(500, 'Failed to create company');
    }
    
    return sendSuccess(data);
  }
  
  // PUT /api/companies/:id (update company)
  if (event.httpMethod === 'PUT' && event.body) {
    const companyId = event.path.split('/').pop();
    const companyData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('id', companyId)
      .select();
      
    if (error) {
      console.error('Error updating company:', error);
      return sendError(500, 'Failed to update company');
    }
    
    return sendSuccess(data);
  }
  
  // DELETE /api/companies/:id
  if (event.httpMethod === 'DELETE') {
    const companyId = event.path.split('/').pop();
    
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);
      
    if (error) {
      console.error('Error deleting company:', error);
      return sendError(500, 'Failed to delete company');
    }
    
    return sendSuccess({ message: 'Company deleted successfully' });
  }
  
  return sendError(405, 'Method Not Allowed');
});

export { handler }; 