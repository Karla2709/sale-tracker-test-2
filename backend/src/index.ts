import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';
import leadsRouter from './routes/leads';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Test Supabase connection
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('leads').select('id').limit(1);
    if (error) throw error;
    res.json({ 
      status: 'ok',
      database: 'connected',
      message: 'API is running and database is connected'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Routes
app.use('/api/leads', leadsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 