/**
 * Base domain error class
 * All domain-specific errors should extend this class
 */
export class DomainError extends Error {
  constructor(message, code = 'DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns a plain object representation of the error
   * @returns {Object} Error object
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Error thrown when a user is not found
 */
export class UserNotFoundError extends DomainError {
  constructor(identifier) {
    super(`User not found: ${identifier}`, 'USER_NOT_FOUND');
  }
}

/**
 * Error thrown when a user already exists
 */
export class UserAlreadyExistsError extends DomainError {
  constructor(email) {
    super(`User with email ${email} already exists`, 'USER_ALREADY_EXISTS');
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends DomainError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
    };
  }
}
