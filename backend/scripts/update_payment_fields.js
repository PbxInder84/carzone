// Script to update payment fields in Orders table
require('dotenv').config();
const { sequelize } = require('../config/db');

async function updatePaymentFields() {
  try {
    console.log('Starting migration: updating payment fields in Orders table...');
    
    // Check if columns exist
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Orders' 
      AND COLUMN_NAME IN ('payment_intent_id', 'payment_method', 'payment_details')
    `);
    
    const existingColumns = results.map(row => row.COLUMN_NAME);
    
    // Remove Stripe-specific column if exists
    if (existingColumns.includes('payment_intent_id')) {
      console.log('Removing payment_intent_id column...');
      await sequelize.query(`
        ALTER TABLE Orders
        DROP COLUMN payment_intent_id
      `);
      console.log('payment_intent_id column removed successfully');
    }
    
    // Add payment method column if not exists
    if (!existingColumns.includes('payment_method')) {
      console.log('Adding payment_method column...');
      await sequelize.query(`
        ALTER TABLE Orders
        ADD COLUMN payment_method ENUM('cod', 'upi', 'net_banking') NOT NULL DEFAULT 'cod'
      `);
      console.log('payment_method column added successfully');
    } else {
      console.log('payment_method column already exists');
    }
    
    // Add payment details column if not exists
    if (!existingColumns.includes('payment_details')) {
      console.log('Adding payment_details column...');
      await sequelize.query(`
        ALTER TABLE Orders
        ADD COLUMN payment_details TEXT NULL
      `);
      console.log('payment_details column added successfully');
    } else {
      console.log('payment_details column already exists');
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
updatePaymentFields(); 