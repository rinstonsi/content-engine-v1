/**
 * UpdateUser use case
 * Handles the business logic for updating an existing user
 */
export class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the update user use case
   * @param {string} id - User ID
   * @param {Object} updates - Updates to apply
   * @param {string} [updates.email] - New email
   * @param {string} [updates.name] - New name
   * @returns {Promise<Object>} Updated user data
   * @throws {Error} If user update fails or user not found
   */
  async execute(id, updates) {
    if (!id) {
      throw new Error('User ID is required');
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('At least one field must be provided for update');
    }

    // Find existing user
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (updates.email && updates.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updates.email);
      if (existingUser) {
        throw new Error(`User with email ${updates.email} already exists`);
      }
    }

    // Update the user entity
    user.update(updates);

    // Save updated user
    const updatedUser = await this.userRepository.update(user);

    // Return presentation data
    return updatedUser.toPresentation();
  }
}
