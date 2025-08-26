/**
 * UserRepository interface - Outbound port
 * Defines the contract for user persistence operations
 */
export class UserRepository {
  /**
   * Saves a user
   * @param {User} user - User to save
   * @returns {Promise<User>} Saved user
   * @throws {Error} If user cannot be saved
   */
  async save(user) {
    throw new Error('Method save() must be implemented');
  }

  /**
   * Finds a user by ID
   * @param {string} id - User ID
   * @returns {Promise<User|null>} User if found, null otherwise
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Finds a user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} User if found, null otherwise
   */
  async findByEmail(email) {
    throw new Error('Method findByEmail() must be implemented');
  }

  /**
   * Finds all users
   * @returns {Promise<User[]>} Array of users
   */
  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  /**
   * Updates a user
   * @param {User} user - User to update
   * @returns {Promise<User>} Updated user
   * @throws {Error} If user cannot be updated or does not exist
   */
  async update(user) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Deletes a user by ID
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if user was deleted, false otherwise
   */
  async deleteById(id) {
    throw new Error('Method deleteById() must be implemented');
  }

  /**
   * Checks if a user exists by email
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if user exists, false otherwise
   */
  async existsByEmail(email) {
    throw new Error('Method existsByEmail() must be implemented');
  }
}
