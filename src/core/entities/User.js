import { v4 as uuidv4 } from 'uuid';

/**
 * User entity representing a user in the domain
 * This is a pure domain entity with no external dependencies
 */
export class User {
  constructor({ id, email, name, createdAt, updatedAt }) {
    this.validateEmail(email);
    this.validateName(name);

    this.id = id || uuidv4();
    this.email = email;
    this.name = name;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  /**
   * Creates a new User instance
   * @param {Object} userData - User data
   * @param {string} userData.email - User email
   * @param {string} userData.name - User name
   * @returns {User} New User instance
   */
  static create({ email, name }) {
    return new User({ email, name });
  }

  /**
   * Recreates a User instance from persistence data
   * @param {Object} userData - User data from persistence
   * @returns {User} User instance
   */
  static fromPersistence(userData) {
    return new User({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      createdAt: new Date(userData.createdAt),
      updatedAt: new Date(userData.updatedAt),
    });
  }

  /**
   * Updates user information
   * @param {Object} updates - Updates to apply
   * @param {string} [updates.email] - New email
   * @param {string} [updates.name] - New name
   */
  update({ email, name }) {
    if (email !== undefined) {
      this.validateEmail(email);
      this.email = email;
    }

    if (name !== undefined) {
      this.validateName(name);
      this.name = name;
    }

    this.updatedAt = new Date();
  }

  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @throws {Error} If email is invalid
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  /**
   * Validates name
   * @param {string} name - Name to validate
   * @throws {Error} If name is invalid
   */
  validateName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Name is required and must be a string');
    }

    if (name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (name.trim().length > 100) {
      throw new Error('Name must be less than 100 characters long');
    }
  }

  /**
   * Converts the user to a plain object for persistence
   * @returns {Object} Plain object representation
   */
  toPersistence() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts the user to a plain object for presentation
   * @returns {Object} Plain object representation for API responses
   */
  toPresentation() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Checks if the user equals another user
   * @param {User} other - Other user to compare
   * @returns {boolean} True if users are equal
   */
  equals(other) {
    return other instanceof User && this.id === other.id;
  }
}
