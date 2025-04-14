# Logging System Documentation

The CarZone backend application uses a comprehensive logging system built with Winston and Morgan to provide detailed logs for debugging, monitoring, and auditing purposes.

## Features

- Multi-level logging (error, warn, info, http, verbose, debug, silly)
- Daily rotating log files
- Separate error log files
- HTTP request logging via Morgan integration
- Configurable log levels and retention periods
- Database query logging (in development mode)
- Detailed request logging (optional, for debugging)

## Log File Location

Log files are stored in the `logs` directory at the root of the project. Two types of log files are created:

- `application-YYYY-MM-DD.log`: Contains all logs of configured level and above
- `error-YYYY-MM-DD.log`: Contains only error level logs

## Configuration

Logging can be configured through environment variables:

```
# Logging Configuration
LOG_LEVEL=debug             # Log level (error, warn, info, http, verbose, debug, silly)
LOG_MAX_FILES=14d           # Maximum log retention period (e.g., 14d = 14 days)
LOG_MAX_SIZE=20m            # Maximum log file size before rotation (e.g., 20m = 20 megabytes)
DETAILED_LOGGING=true       # Enable detailed request logging (true/false)
```

## Log Levels

The logger uses the following log levels (in order of importance):

1. **error**: Critical errors that require immediate attention
2. **warn**: Warnings that should be reviewed but don't stop the application
3. **info**: Important application events (startup, shutdown, etc.)
4. **http**: HTTP request logs (via Morgan)
5. **verbose**: Detailed operation information
6. **debug**: Development debugging information
7. **silly**: Extremely detailed debugging information

Setting `LOG_LEVEL` to a specific level will include all logs of that level and higher importance.

## Usage in Code

The logger can be used in any file by requiring it:

```javascript
const logger = require('../utils/logger');

// Log examples
logger.error('Critical error occurred', { error: err });
logger.warn('Something unusual happened');
logger.info('Application started');
logger.http('HTTP request received');
logger.verbose('Operation details');
logger.debug('Debugging information');
logger.silly('Very detailed debugging info');
```

## HTTP Request Logging

All HTTP requests are automatically logged using Morgan middleware integrated with Winston:

```javascript
// In server.js
app.use(morgan('combined', { stream: logger.stream }));
```

## Detailed Request Logging

For debugging purposes, detailed request logging can be enabled, which logs request headers, URL, method, query parameters, and body (in development mode):

```javascript
// Enable in .env file
DETAILED_LOGGING=true
```

This feature is automatically enabled in development mode and can be explicitly enabled in other environments.

## Database Query Logging

Sequelize database queries are logged at the debug level in development mode:

```javascript
// In db.js
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  // ...
  logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  // ...
});
``` 