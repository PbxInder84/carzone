const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Load environment variables
dotenv.config();

// Check if using test database
const isTest = process.env.NODE_ENV === 'test';

// Get database connection info from environment variables
const dbName = isTest ? process.env.DB_NAME_TEST : process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbDialect = process.env.DB_DIALECT || 'mysql';

// Create Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Function to connect to database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`Database connection established successfully [${dbDialect}:${dbHost}:${dbPort}/${dbName}]`);
    
    // Sync models with database (only in development)
    if (process.env.NODE_ENV === 'development' && process.env.SYNC_DB === 'true') {
      logger.info('Syncing database models...');
      await sequelize.sync({ alter: true });
      logger.info('Database models synced successfully');
    }
  } catch (error) {
    logger.error('Unable to connect to the database:', { error });
    // Exit with failure
    process.exit(1);
  }
};

// Export sequelize instance and connectDB function
module.exports = { sequelize, connectDB }; 