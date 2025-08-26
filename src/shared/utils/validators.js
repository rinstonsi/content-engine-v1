import { VALIDATION_RULES } from '../constants/index.js';

/**
 * Utility functions for validation
 */

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export function validateEmail(email) {
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else {
    const trimmedEmail = email.trim();

    if (trimmedEmail.length === 0) {
      errors.push('Email cannot be empty');
    } else if (trimmedEmail.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
      errors.push(`Email must be less than ${VALIDATION_RULES.EMAIL.MAX_LENGTH} characters`);
    } else if (!VALIDATION_RULES.EMAIL.PATTERN.test(trimmedEmail)) {
      errors.push('Invalid email format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a name
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
export function validateName(name) {
  const errors = [];

  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  } else {
    const trimmedName = name.trim();

    if (trimmedName.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
      errors.push(`Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters long`);
    } else if (trimmedName.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
      errors.push(`Name must be less than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters long`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates user data for creation
 * @param {Object} userData - User data to validate
 * @returns {Object} Validation result
 */
export function validateUserData(userData) {
  const errors = [];

  if (!userData || typeof userData !== 'object') {
    errors.push('User data is required and must be an object');
    return { isValid: false, errors };
  }

  const emailValidation = validateEmail(userData.email);
  const nameValidation = validateName(userData.name);

  errors.push(...emailValidation.errors);
  errors.push(...nameValidation.errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates UUID format
 * @param {string} id - ID to validate
 * @returns {Object} Validation result
 */
export function validateUUID(id) {
  const errors = [];

  if (!id || typeof id !== 'string') {
    errors.push('ID is required and must be a string');
  } else {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      errors.push('Invalid UUID format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
