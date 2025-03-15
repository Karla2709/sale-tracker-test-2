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

// API routes
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 