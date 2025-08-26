import { User } from '../../../../src/core/entities/User.js';

describe('User Entity', () => {
  describe('constructor', () => {
    test('should create a user with valid data', () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const user = new User(userData);

      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    test('should throw error for invalid email', () => {
      expect(() => {
        new User({ email: 'invalid-email', name: 'Test User' });
      }).toThrow('Invalid email format');
    });

    test('should throw error for invalid name', () => {
      expect(() => {
        new User({ email: 'test@example.com', name: 'A' });
      }).toThrow('Name must be at least 2 characters long');
    });

    test('should throw error for missing email', () => {
      expect(() => {
        new User({ name: 'Test User' });
      }).toThrow('Email is required and must be a string');
    });

    test('should throw error for missing name', () => {
      expect(() => {
        new User({ email: 'test@example.com' });
      }).toThrow('Name is required and must be a string');
    });
  });

  describe('create', () => {
    test('should create a new user instance', () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const user = User.create(userData);

      expect(user).toBeInstanceOf(User);
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
    });
  });

  describe('fromPersistence', () => {
    test('should recreate user from persistence data', () => {
      const persistenceData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      const user = User.fromPersistence(persistenceData);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(persistenceData.id);
      expect(user.email).toBe(persistenceData.email);
      expect(user.name).toBe(persistenceData.name);
      expect(user.createdAt).toEqual(new Date(persistenceData.createdAt));
      expect(user.updatedAt).toEqual(new Date(persistenceData.updatedAt));
    });
  });

  describe('update', () => {
    test('should update user email', () => {
      const user = User.create({
        email: 'old@example.com',
        name: 'Test User',
      });

      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure different timestamp
      setTimeout(() => {
        user.update({ email: 'new@example.com' });

        expect(user.email).toBe('new@example.com');
        expect(user.name).toBe('Test User');
        expect(user.updatedAt).not.toEqual(originalUpdatedAt);
      }, 1);
    });

    test('should update user name', () => {
      const user = User.create({
        email: 'test@example.com',
        name: 'Old Name',
      });

      user.update({ name: 'New Name' });

      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('New Name');
    });

    test('should throw error for invalid email update', () => {
      const user = User.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(() => {
        user.update({ email: 'invalid-email' });
      }).toThrow('Invalid email format');
    });
  });

  describe('toPersistence', () => {
    test('should convert user to persistence format', () => {
      const user = User.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      const persistence = user.toPersistence();

      expect(persistence).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    });
  });

  describe('toPresentation', () => {
    test('should convert user to presentation format', () => {
      const user = User.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      const presentation = user.toPresentation();

      expect(presentation).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    });
  });

  describe('equals', () => {
    test('should return true for users with same ID', () => {
      const userData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        name: 'Test User',
      };

      const user1 = new User(userData);
      const user2 = new User(userData);

      expect(user1.equals(user2)).toBe(true);
    });

    test('should return false for users with different IDs', () => {
      const user1 = User.create({
        email: 'test1@example.com',
        name: 'Test User 1',
      });

      const user2 = User.create({
        email: 'test2@example.com',
        name: 'Test User 2',
      });

      expect(user1.equals(user2)).toBe(false);
    });

    test('should return false for non-User objects', () => {
      const user = User.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(user.equals({})).toBe(false);
      expect(user.equals(null)).toBe(false);
      expect(user.equals('string')).toBe(false);
    });
  });
});
