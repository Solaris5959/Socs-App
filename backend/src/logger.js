// src/logger.js
import pino from 'pino'; // Import pino
// Use `info` as our standard log level if not specified
const options = { level: process.env.LOG_LEVEL || 'debug' };

// If we're doing `debug` logging, make the logs easier to read
if (options.level === 'debug') {
    // https://github.com/pinojs/pino-pretty
    options.transport = {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    };
}

// Create and export a Pino Logger instance
const logger = pino(options);
export default logger; // Export the logger instance
