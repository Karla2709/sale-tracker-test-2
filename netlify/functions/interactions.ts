import { Handler } from '@netlify/functions';
import { apiHandler, sendSuccess, sendError } from './utils/api';
import { supabase } from './utils/supabase';

const handler: Handler = apiHandler(async (event) => {
  // GET /api/interactions
  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase
      .from('interactions')
      .select(`
        *,
        lead:leads(name, email)
      `);
    
    if (error) {
      console.error('Error fetching interactions:', error);
      return sendError(500, 'Failed to fetch interactions');
    }
    
    return sendSuccess(data);
  }
  
  // POST /api/interactions (create new interaction)
  if (event.httpMethod === 'POST' && event.body) {
    const interactionData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('interactions')
      .insert(interactionData)
      .select();
      
    if (error) {
      console.error('Error creating interaction:', error);
      return sendError(500, 'Failed to create interaction');
    }
    
    return sendSuccess(data);
  }
  
  // PUT /api/interactions/:id (update interaction)
  if (event.httpMethod === 'PUT' && event.body) {
    const interactionId = event.path.split('/').pop();
    const interactionData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('interactions')
      .update(interactionData)
      .eq('id', interactionId)
      .select();
      
    if (error) {
      console.error('Error updating interaction:', error);
      return sendError(500, 'Failed to update interaction');
    }
    
    return sendSuccess(data);
  }
  
  // DELETE /api/interactions/:id
  if (event.httpMethod === 'DELETE') {
    const interactionId = event.path.split('/').pop();
    
    const { error } = await supabase
      .from('interactions')
      .delete()
      .eq('id', interactionId);
      
    if (error) {
      console.error('Error deleting interaction:', error);
      return sendError(500, 'Failed to delete interaction');
    }
    
    return sendSuccess({ message: 'Interaction deleted successfully' });
  }
  
  return sendError(405, 'Method Not Allowed');
});

export { handler }; 