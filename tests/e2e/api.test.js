import request from 'supertest';
import app from '../../src/adapters/inbound/rest/server.js';

describe('API End-to-End Tests', () => {
  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        environment: expect.any(String),
      });
    });
  });

  describe('Root Endpoint', () => {
    test('should return API information', async () => {
      const response = await request(app).get('/').expect(200);

      expect(response.body).toEqual({
        message: 'Hexagonal Architecture Node.js API',
        version: '1.0.0',
        endpoints: {
          users: '/api/users',
          health: '/health',
        },
      });
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for non-existent endpoints', async () => {
      const response = await request(app).get('/non-existent-endpoint').expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Endpoint not found',
        path: '/non-existent-endpoint',
      });
    });
  });

  describe('Complete User Workflow', () => {
    test('should handle complete CRUD operations', async () => {
      // 1. Create a user
      const userData = {
        email: 'workflow@example.com',
        name: 'Workflow User',
      };

      const createResponse = await request(app).post('/api/users').send(userData).expect(201);

      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data.email).toBe(userData.email);
      expect(createResponse.body.data.name).toBe(userData.name);

      const userId = createResponse.body.data.id;

      // 2. Get the user by ID
      const getResponse = await request(app).get(`/api/users/${userId}`).expect(200);

      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.data.id).toBe(userId);
      expect(getResponse.body.data.email).toBe(userData.email);

      // 3. Update the user
      const updates = {
        name: 'Updated Workflow User',
        email: 'updated-workflow@example.com',
      };

      const updateResponse = await request(app).put(`/api/users/${userId}`).send(updates).expect(200);

      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.name).toBe(updates.name);
      expect(updateResponse.body.data.email).toBe(updates.email);

      // 4. Verify the update persisted
      const getUpdatedResponse = await request(app).get(`/api/users/${userId}`).expect(200);

      expect(getUpdatedResponse.body.data.name).toBe(updates.name);
      expect(getUpdatedResponse.body.data.email).toBe(updates.email);

      // 5. Get all users (should include our user)
      const getAllResponse = await request(app).get('/api/users').expect(200);

      expect(getAllResponse.body.success).toBe(true);
      expect(getAllResponse.body.data).toBeInstanceOf(Array);
      expect(getAllResponse.body.count).toBeGreaterThan(0);

      const userIds = getAllResponse.body.data.map((user) => user.id);
      expect(userIds).toContain(userId);

      // 6. Delete the user
      const deleteResponse = await request(app).delete(`/api/users/${userId}`).expect(200);

      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('User deleted successfully');

      // 7. Verify user is deleted
      await request(app).get(`/api/users/${userId}`).expect(404);

      // 8. Verify user is not in the list anymore
      const getAllAfterDeleteResponse = await request(app).get('/api/users').expect(200);

      const userIdsAfterDelete = getAllAfterDeleteResponse.body.data.map((user) => user.id);
      expect(userIdsAfterDelete).not.toContain(userId);
    });

    test('should handle multiple users correctly', async () => {
      const users = [
        { email: 'user1@test.com', name: 'User One' },
        { email: 'user2@test.com', name: 'User Two' },
        { email: 'user3@test.com', name: 'User Three' },
      ];

      const createdUsers = [];

      // Create multiple users
      for (const userData of users) {
        const response = await request(app).post('/api/users').send(userData).expect(201);
        createdUsers.push(response.body.data);
      }

      // Verify all users exist
      const getAllResponse = await request(app).get('/api/users').expect(200);
      const allUserEmails = getAllResponse.body.data.map((user) => user.email);

      users.forEach((user) => {
        expect(allUserEmails).toContain(user.email);
      });

      // Clean up - delete all created users
      for (const user of createdUsers) {
        await request(app).delete(`/api/users/${user.id}`).expect(200);
      }
    });

    test('should validate business rules across the entire stack', async () => {
      // Test email uniqueness constraint
      const userData = {
        email: 'unique@example.com',
        name: 'First User',
      };

      // Create first user
      await request(app).post('/api/users').send(userData).expect(201);

      // Try to create another user with same email
      const duplicateUserData = {
        email: 'unique@example.com',
        name: 'Second User',
      };

      const duplicateResponse = await request(app).post('/api/users').send(duplicateUserData).expect(409);

      expect(duplicateResponse.body.success).toBe(false);
      expect(duplicateResponse.body.error).toContain('already exists');

      // Test validation rules
      const invalidUsers = [
        { email: 'invalid-email', name: 'Valid Name' },
        { email: 'valid@email.com', name: 'A' },
        { email: '', name: 'Valid Name' },
        { email: 'valid@email.com', name: '' },
      ];

      for (const invalidUser of invalidUsers) {
        await request(app).post('/api/users').send(invalidUser).expect(400);
      }
    });
  });
});
