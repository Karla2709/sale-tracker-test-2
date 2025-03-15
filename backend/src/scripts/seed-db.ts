import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '../config/supabase';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Read the seed SQL file
    const seedPath = path.join(__dirname, '../db/seed-data.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    
    console.log('Executing seed SQL...');
    
    // Execute the SQL using the Supabase REST API
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      },
      body: JSON.stringify({
        query: seedSql
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`SQL execution failed: ${JSON.stringify(errorData)}`);
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase(); 