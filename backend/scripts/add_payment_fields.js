// Script to add payment fields to Orders table
require('dotenv').config();
const { sequelize } = require('../config/db');

async function addPaymentFieldsToOrders() {
  try {
    console.log('Starting migration: adding payment fields to Orders table...');
    
    // Check if columns already exist
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Orders' 
      AND COLUMN_NAME IN ('payment_intent_id', 'payment_date')
    `);
    
    const existingColumns = results.map(row => row.COLUMN_NAME);
    
    if (!existingColumns.includes('payment_intent_id')) {
      console.log('Adding payment_intent_id column...');
      await sequelize.query(`
        ALTER TABLE Orders
        ADD COLUMN payment_intent_id VARCHAR(255) NULL
      `);
      console.log('payment_intent_id column added successfully');
    } else {
      console.log('payment_intent_id column already exists');
    }
    
    if (!existingColumns.includes('payment_date')) {
      console.log('Adding payment_date column...');
      await sequelize.query(`
        ALTER TABLE Orders
        ADD COLUMN payment_date DATETIME NULL
      `);
      console.log('payment_date column added successfully');
    } else {
      console.log('payment_date column already exists');
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
addPaymentFieldsToOrders(); 