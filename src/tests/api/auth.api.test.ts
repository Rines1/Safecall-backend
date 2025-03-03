import request from 'supertest';
import app from '../../app';
import { db } from '../../config/db';
import { users } from '../../models/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// Mock the database
jest.mock('../../config/db');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      // Arrange
      const userData = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Mock db.select to return no user (email doesn't exist)
      (db.select as jest.Mock).mockImplementationOnce(() => ({
        from: jest.fn().mockImplementationOnce(() => ({
          where: jest.fn().mockResolvedValueOnce([])
        }))
      }));
      
      // Mock bcrypt.hash
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed_password');
      
      // Mock db.insert to return created user
      (db.insert as jest.Mock).mockImplementationOnce(() => ({
        values: jest.fn().mockImplementationOnce(() => ({
          returning: jest.fn().mockResolvedValueOnce([{
            id: 1,
            fullname: userData.fullname,
            email: userData.email,
            password: 'hashed_password'
          }])
        }))
      }));
      
      // Act
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.user.fullname).toBe(userData.fullname);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should return 400 if email already exists', async () => {
      // Arrange
      const userData = {
        fullname: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      // Mock db.select to return existing user
      (db.select as jest.Mock).mockImplementationOnce(() => ({
        from: jest.fn().mockImplementationOnce(() => ({
          where: jest.fn().mockResolvedValueOnce([{
            id: 1,
            fullname: 'Existing User',
            email: userData.email
          }])
        }))
      }));
      
      // Act
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);
      
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User with this email already exists');
    });
  });

  // Additional tests for login and profile endpoints
});