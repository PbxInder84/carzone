const winston = require('winston');
const { createLogger, format, transports } = winston;
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get logging configuration from environment variables
const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const LOG_MAX_FILES = process.env.LOG_MAX_FILES || '14d';
const LOG_MAX_SIZE = process.env.LOG_MAX_SIZE || '20m';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define common log format
const commonFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat()
);

// Define environment-specific formats
const formatProduction = format.combine(
  commonFormat,
  format.json()
);

const formatDevelopment = format.combine(
  commonFormat,
  format.json()
);

// Use appropriate format based on environment
const logFormat = NODE_ENV === 'production' ? formatProduction : formatDevelopment;

// Configure the Daily Rotate File transport
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: LOG_MAX_FILES,
  maxSize: LOG_MAX_SIZE,
  level: LOG_LEVEL
});

// Create separate transport for error logs
const errorFileRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: LOG_MAX_FILES,
  maxSize: LOG_MAX_SIZE,
  level: 'error'
});

// Define console formats based on environment
const consoleFormatProduction = format.combine(
  format.colorize(),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const consoleFormatDevelopment = format.combine(
  format.colorize(),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''}`
  )
);

// Create winston logger instance
const logger = createLogger({
  level: LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'carzone-api' },
  transports: [
    // Console transport (colorized for better readability)
    new transports.Console({
      format: NODE_ENV === 'production' ? consoleFormatProduction : consoleFormatDevelopment
    }),
    fileRotateTransport,
    errorFileRotateTransport
  ],
  exitOnError: false
});

// Create stream for Morgan integration
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

module.exports = logger; 