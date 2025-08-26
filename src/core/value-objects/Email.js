/**
 * Email value object
 * Represents an email address as an immutable value object
 */
export class Email {
  constructor(value) {
    this.validate(value);
    this._value = value.toLowerCase().trim();
  }

  /**
   * Creates a new Email instance
   * @param {string} value - Email address
   * @returns {Email} New Email instance
   */
  static create(value) {
    return new Email(value);
  }

  /**
   * Gets the email value
   * @returns {string} Email address
   */
  get value() {
    return this._value;
  }

  /**
   * Gets the domain part of the email
   * @returns {string} Domain part
   */
  get domain() {
    return this._value.split('@')[1];
  }

  /**
   * Gets the local part of the email
   * @returns {string} Local part
   */
  get localPart() {
    return this._value.split('@')[0];
  }

  /**
   * Validates the email format
   * @param {string} value - Email to validate
   * @throws {Error} If email is invalid
   */
  validate(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedValue)) {
      throw new Error('Invalid email format');
    }

    if (trimmedValue.length > 254) {
      throw new Error('Email is too long');
    }
  }

  /**
   * Checks if this email equals another email
   * @param {Email} other - Other email to compare
   * @returns {boolean} True if emails are equal
   */
  equals(other) {
    return other instanceof Email && this._value === other._value;
  }

  /**
   * Returns string representation of the email
   * @returns {string} Email address
   */
  toString() {
    return this._value;
  }

  /**
   * Returns JSON representation of the email
   * @returns {string} Email address
   */
  toJSON() {
    return this._value;
  }
}
