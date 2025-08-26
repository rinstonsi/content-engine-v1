/**
 * GetUser use case
 * Handles the business logic for retrieving a user
 */
export class GetUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the get user by ID use case
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User data if found, null otherwise
   */
  async byId(id) {
    if (!id) {
      throw new Error('User ID is required');
    }

    const user = await this.userRepository.findById(id);
    return user ? user.toPresentation() : null;
  }

  /**
   * Executes the get user by email use case
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User data if found, null otherwise
   */
  async byEmail(email) {
    if (!email) {
      throw new Error('User email is required');
    }

    const user = await this.userRepository.findByEmail(email);
    return user ? user.toPresentation() : null;
  }

  /**
   * Executes the get all users use case
   * @returns {Promise<Object[]>} Array of user data
   */
  async all() {
    const users = await this.userRepository.findAll();
    return users.map((user) => user.toPresentation());
  }
}
