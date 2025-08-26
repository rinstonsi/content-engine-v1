import express from 'express';

/**
 * Creates user routes
 * @param {UserController} userController - User controller instance
 * @returns {express.Router} Express router
 */
export function createUserRoutes(userController) {
  const router = express.Router();

  // Create user
  router.post('/', (req, res) => userController.createUser(req, res));

  // Get all users
  router.get('/', (req, res) => userController.getAllUsers(req, res));

  // Get user by ID
  router.get('/:id', (req, res) => userController.getUserById(req, res));

  // Update user
  router.put('/:id', (req, res) => userController.updateUser(req, res));

  // Delete user
  router.delete('/:id', (req, res) => userController.deleteUser(req, res));

  return router;
}
