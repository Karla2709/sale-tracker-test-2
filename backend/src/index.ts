import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase, supabaseAdmin } from './config/supabase';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration to allow requests from frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://sale-tracker-mvp.netlify.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Add frontend URL from env if it exists
if (process.env.FRONTEND_URL) {
  (corsOptions.origin as string[]).push(process.env.FRONTEND_URL);
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.get('/api/leads', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
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

app.get('/api/companies', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('companies')
      .select('*');
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

app.post('/api/companies', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('companies')
      .insert(req.body)
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

app.put('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('companies')
      .update(req.body)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

app.delete('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
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

app.get('/api/interactions', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
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

app.get('/api/deals', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 