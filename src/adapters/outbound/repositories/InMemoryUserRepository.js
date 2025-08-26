import { UserRepository } from '../../../application/ports/outbound/UserRepository.js';
import { User } from '../../../core/entities/User.js';

/**
 * In-memory implementation of UserRepository
 * This is an outbound adapter that implements the UserRepository port
 */
export class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.users = new Map(); // Map<string, User>
  }

  /**
   * Saves a user
   * @param {User} user - User to save
   * @returns {Promise<User>} Saved user
   */
  async save(user) {
    if (!(user instanceof User)) {
      throw new Error('Expected User instance');
    }

    this.users.set(user.id, user);
    return user;
  }

  /**
   * Finds a user by ID
   * @param {string} id - User ID
   * @returns {Promise<User|null>} User if found, null otherwise
   */
  async findById(id) {
    const user = this.users.get(id);
    return user || null;
  }

  /**
   * Finds a user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} User if found, null otherwise
   */
  async findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  /**
   * Finds all users
   * @returns {Promise<User[]>} Array of users
   */
  async findAll() {
    return Array.from(this.users.values());
  }

  /**
   * Updates a user
   * @param {User} user - User to update
   * @returns {Promise<User>} Updated user
   * @throws {Error} If user does not exist
   */
  async update(user) {
    if (!(user instanceof User)) {
      throw new Error('Expected User instance');
    }

    if (!this.users.has(user.id)) {
      throw new Error(`User with ID ${user.id} not found`);
    }

    this.users.set(user.id, user);
    return user;
  }

  /**
   * Deletes a user by ID
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if user was deleted, false otherwise
   */
  async deleteById(id) {
    return this.users.delete(id);
  }

  /**
   * Checks if a user exists by email
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if user exists, false otherwise
   */
  async existsByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return true;
      }
    }
    return false;
  }

  /**
   * Clears all users (useful for testing)
   * @returns {Promise<void>}
   */
  async clear() {
    this.users.clear();
  }

  /**
   * Gets the count of users
   * @returns {Promise<number>} Number of users
   */
  async count() {
    return this.users.size;
  }
}
