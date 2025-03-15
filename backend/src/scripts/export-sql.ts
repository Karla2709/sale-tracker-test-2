import fs from 'fs';
import path from 'path';

/**
 * Export SQL scripts to a file for manual execution in Supabase SQL editor
 */
async function exportSql() {
  try {
    console.log('Exporting SQL scripts...');
    
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Read the seed SQL file
    const seedPath = path.join(__dirname, '../db/seed-data.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    
    // Combine the SQL scripts
    const combinedSql = `-- Schema SQL\n${schemaSql}\n\n-- Seed SQL\n${seedSql}`;
    
    // Write the combined SQL to a file
    const outputPath = path.join(__dirname, '../db/combined-sql.sql');
    fs.writeFileSync(outputPath, combinedSql);
    
    console.log(`SQL scripts exported to ${outputPath}`);
    console.log('You can now copy and paste this SQL into the Supabase SQL editor.');
  } catch (error) {
    console.error('Error exporting SQL:', error);
    process.exit(1);
  }
}

// Run the export
exportSql(); 