/**
 * UserService interface - Inbound port
 * Defines the contract for user-related operations that can be called from adapters
 */
export class UserService {
  /**
   * Creates a new user
   * @param {Object} userData - User creation data
   * @param {string} userData.email - User email
   * @param {string} userData.name - User name
   * @returns {Promise<Object>} Created user data
   * @throws {Error} If user creation fails
   */
  async createUser(userData) {
    throw new Error('Method createUser() must be implemented');
  }

  /**
   * Gets a user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User data if found, null otherwise
   */
  async getUserById(id) {
    throw new Error('Method getUserById() must be implemented');
  }

  /**
   * Gets a user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User data if found, null otherwise
   */
  async getUserByEmail(email) {
    throw new Error('Method getUserByEmail() must be implemented');
  }

  /**
   * Gets all users
   * @returns {Promise<Object[]>} Array of user data
   */
  async getAllUsers() {
    throw new Error('Method getAllUsers() must be implemented');
  }

  /**
   * Updates a user
   * @param {string} id - User ID
   * @param {Object} updates - Updates to apply
   * @param {string} [updates.email] - New email
   * @param {string} [updates.name] - New name
   * @returns {Promise<Object>} Updated user data
   * @throws {Error} If user update fails or user not found
   */
  async updateUser(id, updates) {
    throw new Error('Method updateUser() must be implemented');
  }

  /**
   * Deletes a user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if user was deleted, false if not found
   */
  async deleteUser(id) {
    throw new Error('Method deleteUser() must be implemented');
  }
}
