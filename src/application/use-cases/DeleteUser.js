/**
 * DeleteUser use case
 * Handles the business logic for deleting a user
 */
export class DeleteUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the delete user use case
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if user was deleted, false if not found
   * @throws {Error} If user deletion fails
   */
  async execute(id) {
    if (!id) {
      throw new Error('User ID is required');
    }

    // Check if user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      return false; // User not found, return false instead of throwing error
    }

    // Delete the user
    const deleted = await this.userRepository.deleteById(id);

    return deleted;
  }
}
