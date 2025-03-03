import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password } = req.body;
    const result = await authService.signup(fullname, email, password);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - we'll add userId to the request in the auth middleware
    const userId = req.userId;
    const user = await authService.getProfile(userId);
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};