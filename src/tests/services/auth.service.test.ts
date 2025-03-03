import { AuthService } from '../../services/auth.service';
import { UserRepository } from '../../repositories/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock the UserRepository
jest.mock('../../repositories/user.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    authService = new AuthService(userRepository);
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user and return user with token', async () => {
      // Arrange
      const userData = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const hashedPassword = 'hashed_password';
      const userId = 1;
      const token = 'jwt_token';
      
      userRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue({
        id: userId,
        ...userData,
        password: hashedPassword
      });
      (jwt.sign as jest.Mock).mockReturnValue(token);
      
      // Act
      const result = await authService.signup(userData.fullname, userData.email, userData.password);
      
      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        fullname: userData.fullname,
        email: userData.email,
        password: hashedPassword
      });
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: userId,
          fullname: userData.fullname,
          email: userData.email
        },
        token
      });
    });

    it('should throw error if user already exists', async () => {
      // Arrange
      const userData = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      userRepository.findByEmail.mockResolvedValue({ id: 1, ...userData });
      
      // Act & Assert
      await expect(authService.signup(userData.fullname, userData.email, userData.password))
        .rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should return user with token on successful login', async () => {
      // Arrange
      const userData = {
        id: 1,
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password'
      };
      
      const token = 'jwt_token';
      
      userRepository.findByEmail.mockResolvedValue(userData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);
      
      // Act
      const result = await authService.login(userData.email, 'password123');
      
      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', userData.password);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: userData.id,
          fullname: userData.fullname,
          email: userData.email
        },
        token
      });
    });

    it('should throw error if user does not exist', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      
      // Act & Assert
      await expect(authService.login('test@example.com', 'password123'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw error if password is incorrect', async () => {
      // Arrange
      const userData = {
        id: 1,
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password'
      };
      
      userRepository.findByEmail.mockResolvedValue(userData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      // Act & Assert
      await expect(authService.login(userData.email, 'wrong_password'))
        .rejects.toThrow('Invalid email or password');
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      // Arrange
      const userData = {
        id: 1,
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password'
      };
      
      userRepository.findById.mockResolvedValue(userData);
      
      // Act
      const result = await authService.getProfile(userData.id);
      
      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userData.id);
      expect(result).toEqual({
        id: userData.id,
        fullname: userData.fullname,
        email: userData.email
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(authService.getProfile(1))
        .rejects.toThrow('User not found');
    });
  });
});