import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// LEADS ENDPOINTS
// Get all leads
app.get('/api/leads', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        company:companies(name, industry)
      `);
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Get lead by ID
app.get('/api/leads/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        company:companies(name, industry)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// Create a new lead
app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const leadData = req.body;
    console.log('Attempting to create lead with data:', leadData);
    
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Update a lead
app.put('/api/leads/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const leadData = req.body;
    console.log('Attempting to update lead with data:', leadData);
    
    const { data, error } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Delete a lead
app.delete('/api/leads/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// COMPANIES ENDPOINTS
// Get all companies
app.get('/api/companies', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get company by ID
app.get('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create a new company
app.post('/api/companies', async (req: Request, res: Response) => {
  try {
    const companyData = req.body;
    
    const { data, error } = await supabase
      .from('companies')
      .insert(companyData)
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update a company
app.put('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyData = req.body;
    
    const { data, error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete a company
app.delete('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

// INTERACTIONS ENDPOINTS
// Get all interactions
app.get('/api/interactions', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('interactions')
      .select(`
        *,
        lead:leads(name, email)
      `);
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// Get interaction by ID
app.get('/api/interactions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('interactions')
      .select(`
        *,
        lead:leads(name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Interaction not found' });
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching interaction:', error);
    res.status(500).json({ error: 'Failed to fetch interaction' });
  }
});

// Create a new interaction
app.post('/api/interactions', async (req: Request, res: Response) => {
  try {
    const interactionData = req.body;
    
    const { data, error } = await supabase
      .from('interactions')
      .insert(interactionData)
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating interaction:', error);
    res.status(500).json({ error: 'Failed to create interaction' });
  }
});

// Update an interaction
app.put('/api/interactions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const interactionData = req.body;
    
    const { data, error } = await supabase
      .from('interactions')
      .update(interactionData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Interaction not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error updating interaction:', error);
    res.status(500).json({ error: 'Failed to update interaction' });
  }
});

// Delete an interaction
app.delete('/api/interactions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('interactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Interaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting interaction:', error);
    res.status(500).json({ error: 'Failed to delete interaction' });
  }
});

// DEALS ENDPOINTS
// Get all deals
app.get('/api/deals', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        lead:leads(name, email, company_id)
      `);
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get deal by ID
app.get('/api/deals/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        lead:leads(name, email, company_id)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

// Create a new deal
app.post('/api/deals', async (req: Request, res: Response) => {
  try {
    const dealData = req.body;
    
    const { data, error } = await supabase
      .from('deals')
      .insert(dealData)
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Update a deal
app.put('/api/deals/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dealData = req.body;
    
    const { data, error } = await supabase
      .from('deals')
      .update(dealData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// Delete a deal
app.delete('/api/deals/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// TASKS ENDPOINTS
// Get all tasks
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        lead:leads(name, email)
      `);
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get task by ID
app.get('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        lead:leads(name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
app.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const taskData = req.body;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskData = req.body;
    
    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 