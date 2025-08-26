import { CreateUser } from '../../../../src/application/use-cases/CreateUser.js';
import { InMemoryUserRepository } from '../../../../src/adapters/outbound/repositories/InMemoryUserRepository.js';
import { User } from '../../../../src/core/entities/User.js';

describe('CreateUser Use Case', () => {
  let createUser;
  let userRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUser = new CreateUser(userRepository);
  });

  describe('execute', () => {
    test('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = await createUser.execute(userData);

      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      // Verify user was saved to repository
      const savedUser = await userRepository.findByEmail(userData.email);
      expect(savedUser).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
    });

    test('should throw error if email is missing', async () => {
      const userData = {
        name: 'Test User',
      };

      await expect(createUser.execute(userData)).rejects.toThrow('Email and name are required');
    });

    test('should throw error if name is missing', async () => {
      const userData = {
        email: 'test@example.com',
      };

      await expect(createUser.execute(userData)).rejects.toThrow('Email and name are required');
    });

    test('should throw error if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      // Create user first time
      await createUser.execute(userData);

      // Try to create same user again
      await expect(createUser.execute(userData)).rejects.toThrow(
        'User with email test@example.com already exists'
      );
    });

    test('should throw error for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
      };

      await expect(createUser.execute(userData)).rejects.toThrow('Invalid email format');
    });

    test('should throw error for invalid name', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'A', // Too short
      };

      await expect(createUser.execute(userData)).rejects.toThrow(
        'Name must be at least 2 characters long'
      );
    });

    test('should handle repository errors', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      // Mock repository to throw error
      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Database error'));

      await expect(createUser.execute(userData)).rejects.toThrow('Database error');
    });

    test('should return presentation format', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = await createUser.execute(userData);

      // Verify it's a plain object (presentation format)
      expect(result).not.toBeInstanceOf(User);
      expect(typeof result).toBe('object');
      expect(result.id).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
    });
  });
});
