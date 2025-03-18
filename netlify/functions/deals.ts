import { Handler } from '@netlify/functions';
import { apiHandler, sendSuccess, sendError } from './utils/api';
import { supabase } from './utils/supabase';

const handler: Handler = apiHandler(async (event) => {
  // GET /api/deals
  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        lead:leads(name, email, company_id)
      `);
    
    if (error) {
      console.error('Error fetching deals:', error);
      return sendError(500, 'Failed to fetch deals');
    }
    
    return sendSuccess(data);
  }
  
  // POST /api/deals (create new deal)
  if (event.httpMethod === 'POST' && event.body) {
    const dealData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('deals')
      .insert(dealData)
      .select();
      
    if (error) {
      console.error('Error creating deal:', error);
      return sendError(500, 'Failed to create deal');
    }
    
    return sendSuccess(data);
  }
  
  // PUT /api/deals/:id (update deal)
  if (event.httpMethod === 'PUT' && event.body) {
    const dealId = event.path.split('/').pop();
    const dealData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('deals')
      .update(dealData)
      .eq('id', dealId)
      .select();
      
    if (error) {
      console.error('Error updating deal:', error);
      return sendError(500, 'Failed to update deal');
    }
    
    return sendSuccess(data);
  }
  
  // DELETE /api/deals/:id
  if (event.httpMethod === 'DELETE') {
    const dealId = event.path.split('/').pop();
    
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', dealId);
      
    if (error) {
      console.error('Error deleting deal:', error);
      return sendError(500, 'Failed to delete deal');
    }
    
    return sendSuccess({ message: 'Deal deleted successfully' });
  }
  
  return sendError(405, 'Method Not Allowed');
});

export { handler }; 