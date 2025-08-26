import request from 'supertest';
import app from '../../src/adapters/inbound/rest/server.js';

describe('UserController Integration Tests', () => {
  describe('POST /api/users', () => {
    test('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const response = await request(app).post('/api/users').send(userData).expect(201);

      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id: expect.any(String),
          email: userData.email,
          name: userData.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      });
    });

    test('should return 400 for missing email', async () => {
      const userData = {
        name: 'Test User',
      };

      const response = await request(app).post('/api/users').send(userData).expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Email and name are required',
      });
    });

    test('should return 400 for missing name', async () => {
      const userData = {
        email: 'test@example.com',
      };

      const response = await request(app).post('/api/users').send(userData).expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Email and name are required',
      });
    });

    test('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        name: 'Test User',
      };

      // Create user first time
      await request(app).post('/api/users').send(userData).expect(201);

      // Try to create same user again
      const response = await request(app).post('/api/users').send(userData).expect(409);

      expect(response.body).toEqual({
        success: false,
        error: 'User with email duplicate@example.com already exists',
      });
    });
  });

  describe('GET /api/users/:id', () => {
    test('should get user by ID', async () => {
      // Create a user first
      const userData = {
        email: 'gettest@example.com',
        name: 'Get Test User',
      };

      const createResponse = await request(app).post('/api/users').send(userData).expect(201);

      const userId = createResponse.body.data.id;

      // Get the user
      const response = await request(app).get(`/api/users/${userId}`).expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id: userId,
          email: userData.email,
          name: userData.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      });
    });

    test('should return 404 for non-existent user', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app).get(`/api/users/${nonExistentId}`).expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'User not found',
      });
    });
  });

  describe('GET /api/users', () => {
    test('should get all users', async () => {
      // Create a few users first
      const users = [
        { email: 'user1@example.com', name: 'User 1' },
        { email: 'user2@example.com', name: 'User 2' },
      ];

      for (const user of users) {
        await request(app).post('/api/users').send(user).expect(201);
      }

      const response = await request(app).get('/api/users').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThanOrEqual(users.length);
      expect(response.body.data.length).toBe(response.body.count);

      // Check that our created users are in the response
      const emails = response.body.data.map((user) => user.email);
      users.forEach((user) => {
        expect(emails).toContain(user.email);
      });
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update user', async () => {
      // Create a user first
      const userData = {
        email: 'update@example.com',
        name: 'Original Name',
      };

      const createResponse = await request(app).post('/api/users').send(userData).expect(201);

      const userId = createResponse.body.data.id;

      // Update the user
      const updates = {
        name: 'Updated Name',
      };

      const response = await request(app).put(`/api/users/${userId}`).send(updates).expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id: userId,
          email: userData.email,
          name: updates.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      });
    });

    test('should return 404 for non-existent user', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
      const updates = { name: 'Updated Name' };

      const response = await request(app).put(`/api/users/${nonExistentId}`).send(updates).expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    test('should return 400 for empty updates', async () => {
      // Create a user first
      const userData = {
        email: 'update2@example.com',
        name: 'Test User',
      };

      const createResponse = await request(app).post('/api/users').send(userData).expect(201);

      const userId = createResponse.body.data.id;

      // Try to update with empty data
      const response = await request(app).put(`/api/users/${userId}`).send({}).expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'At least one field must be provided for update',
      });
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should delete user', async () => {
      // Create a user first
      const userData = {
        email: 'delete@example.com',
        name: 'Delete Test User',
      };

      const createResponse = await request(app).post('/api/users').send(userData).expect(201);

      const userId = createResponse.body.data.id;

      // Delete the user
      const response = await request(app).delete(`/api/users/${userId}`).expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'User deleted successfully',
      });

      // Verify user is deleted
      await request(app).get(`/api/users/${userId}`).expect(404);
    });

    test('should return 404 for non-existent user', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app).delete(`/api/users/${nonExistentId}`).expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'User not found',
      });
    });
  });
});
