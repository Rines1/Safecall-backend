import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../config/db';
import { join } from 'path';

// Path to the migration files
const migrationsFolder = join(__dirname, '../../drizzle');

async function runMigration() {
  console.log('Running migrations...');
  
  try {
    // This will run all migrations in the migrations folder
    await migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migrations failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

runMigration();