const { sequelize } = require('../config/db');
const logger = require('../utils/logger');

async function showTableStructure() {
  try {
    logger.info('Fetching product_categories table structure...');
    
    const [results] = await sequelize.query(`
      DESCRIBE product_categories
    `);
    
    console.table(results);
    logger.info('Table structure fetched successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to fetch table structure:', { error: error.message });
    process.exit(1);
  }
}

// Run the check
showTableStructure(); 