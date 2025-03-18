import { Handler } from '@netlify/functions';
import { apiHandler, sendSuccess, sendError } from './utils/api';
import { supabase } from './utils/supabase';

const handler: Handler = apiHandler(async (event) => {
  // GET /api/tasks
  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        lead:leads(name, email)
      `);
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return sendError(500, 'Failed to fetch tasks');
    }
    
    return sendSuccess(data);
  }
  
  // POST /api/tasks (create new task)
  if (event.httpMethod === 'POST' && event.body) {
    const taskData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select();
      
    if (error) {
      console.error('Error creating task:', error);
      return sendError(500, 'Failed to create task');
    }
    
    return sendSuccess(data);
  }
  
  // PUT /api/tasks/:id (update task)
  if (event.httpMethod === 'PUT' && event.body) {
    const taskId = event.path.split('/').pop();
    const taskData = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', taskId)
      .select();
      
    if (error) {
      console.error('Error updating task:', error);
      return sendError(500, 'Failed to update task');
    }
    
    return sendSuccess(data);
  }
  
  // DELETE /api/tasks/:id
  if (event.httpMethod === 'DELETE') {
    const taskId = event.path.split('/').pop();
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) {
      console.error('Error deleting task:', error);
      return sendError(500, 'Failed to delete task');
    }
    
    return sendSuccess({ message: 'Task deleted successfully' });
  }
  
  return sendError(405, 'Method Not Allowed');
});

export { handler }; 