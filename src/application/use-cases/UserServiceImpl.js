import { UserService } from '../ports/inbound/UserService.js';
import { CreateUser } from './CreateUser.js';
import { GetUser } from './GetUser.js';
import { UpdateUser } from './UpdateUser.js';
import { DeleteUser } from './DeleteUser.js';

/**
 * UserService implementation
 * Implements the inbound port and orchestrates use cases
 */
export class UserServiceImpl extends UserService {
  constructor(userRepository) {
    super();
    this.userRepository = userRepository;
    this.createUser = new CreateUser(userRepository);
    this.getUser = new GetUser(userRepository);
    this.updateUser = new UpdateUser(userRepository);
    this.deleteUser = new DeleteUser(userRepository);
  }

  /**
   * Creates a new user
   * @param {Object} userData - User creation data
   * @returns {Promise<Object>} Created user data
   */
  async createUser(userData) {
    return await this.createUser.execute(userData);
  }

  /**
   * Gets a user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User data if found, null otherwise
   */
  async getUserById(id) {
    return await this.getUser.byId(id);
  }

  /**
   * Gets a user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User data if found, null otherwise
   */
  async getUserByEmail(email) {
    return await this.getUser.byEmail(email);
  }

  /**
   * Gets all users
   * @returns {Promise<Object[]>} Array of user data
   */
  async getAllUsers() {
    return await this.getUser.all();
  }

  /**
   * Updates a user
   * @param {string} id - User ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated user data
   */
  async updateUser(id, updates) {
    return await this.updateUser.execute(id, updates);
  }

  /**
   * Deletes a user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if user was deleted, false if not found
   */
  async deleteUser(id) {
    return await this.deleteUser.execute(id);
  }
}
