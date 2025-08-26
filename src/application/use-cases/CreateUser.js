import { User } from '../../core/entities/User.js';

/**
 * CreateUser use case
 * Handles the business logic for creating a new user
 */
export class CreateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the create user use case
   * @param {Object} userData - User creation data
   * @param {string} userData.email - User email
   * @param {string} userData.name - User name
   * @returns {Promise<Object>} Created user data
   * @throws {Error} If user creation fails
   */
  async execute(userData) {
    const { email, name } = userData;

    // Validate input
    if (!email || !name) {
      throw new Error('Email and name are required');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    // Create domain entity
    const user = User.create({ email, name });

    // Save to repository
    const savedUser = await this.userRepository.save(user);

    // Return presentation data
    return savedUser.toPresentation();
  }
}
