/**
 * Application constants
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const VALIDATION_RULES = {
  EMAIL: {
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
};

export const ERROR_CODES = {
  DOMAIN_ERROR: 'DOMAIN_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};
