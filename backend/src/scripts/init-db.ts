import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '../config/supabase';

/**
 * Initialize the database by running SQL scripts
 */
async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema SQL...');
    
    // Execute the SQL using the Supabase REST API
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      },
      body: JSON.stringify({
        query: schemaSql
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`SQL execution failed: ${JSON.stringify(errorData)}`);
    }
    
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 