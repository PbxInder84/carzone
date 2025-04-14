require('dotenv').config();
const migration = require('../migrations/createCartTable');

async function runMigration() {
  try {
    console.log('Running Cart table migration...');
    await migration.up();
    console.log('Cart table migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Cart table migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 