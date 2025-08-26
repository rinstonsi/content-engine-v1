import dotenv from 'dotenv';
import { ENVIRONMENTS } from '../constants/index.js';

// Load environment variables
dotenv.config();

/**
 * Application configuration
 */
export const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT,
  },

  // Database configuration (for future use)
  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'hexagonal_app',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },

  // JWT configuration (for future authentication)
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
};

/**
 * Validates the configuration
 * @returns {Object} Validation result
 */
export function validateConfig() {
  const errors = [];

  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }

  if (!Object.values(ENVIRONMENTS).includes(config.server.environment)) {
    errors.push(`NODE_ENV must be one of: ${Object.values(ENVIRONMENTS).join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if the application is running in development mode
 * @returns {boolean} True if in development mode
 */
export function isDevelopment() {
  return config.server.environment === ENVIRONMENTS.DEVELOPMENT;
}

/**
 * Checks if the application is running in production mode
 * @returns {boolean} True if in production mode
 */
export function isProduction() {
  return config.server.environment === ENVIRONMENTS.PRODUCTION;
}

/**
 * Checks if the application is running in test mode
 * @returns {boolean} True if in test mode
 */
export function isTest() {
  return config.server.environment === ENVIRONMENTS.TEST;
}
