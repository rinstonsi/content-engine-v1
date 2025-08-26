/**
 * UserController - REST inbound adapter
 * Handles HTTP requests and responses for user operations
 */
export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * Creates a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createUser(req, res) {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        return res.status(400).json({
          success: false,
          error: 'Email and name are required',
        });
      }

      const user = await this.userService.createUser({ email, name });

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const statusCode = this.getErrorStatusCode(error.message);
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Gets a user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await this.userService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const statusCode = this.getErrorStatusCode(error.message);
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Gets all users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      const statusCode = this.getErrorStatusCode(error.message);
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Updates a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one field must be provided for update',
        });
      }

      const user = await this.userService.updateUser(id, updates);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const statusCode = this.getErrorStatusCode(error.message);
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Deletes a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const deleted = await this.userService.deleteUser(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      const statusCode = this.getErrorStatusCode(error.message);
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Determines the appropriate HTTP status code based on error message
   * @param {string} errorMessage - Error message
   * @returns {number} HTTP status code
   */
  getErrorStatusCode(errorMessage) {
    if (errorMessage.includes('not found')) {
      return 404;
    }
    if (errorMessage.includes('already exists')) {
      return 409;
    }
    if (
      errorMessage.includes('required') ||
      errorMessage.includes('invalid') ||
      errorMessage.includes('must be')
    ) {
      return 400;
    }
    return 500;
  }
}
