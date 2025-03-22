import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';
import leadsRouter from './routes/leads';

// Load environment variables
dotenv.config();

// Debug: Show environment variables
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);

const app = express();
const port = process.env.PORT || 3002;

console.log('Server configured to use port:', port);

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Debug: Log CORS configuration
console.log('CORS configured with origins:', ['http://localhost:3000', 'http://localhost:3003']);

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