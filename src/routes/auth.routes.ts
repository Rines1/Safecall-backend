import { Router } from 'express';
import { login, signup, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateSignup, validateLogin } from '../middleware/validation.middleware';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);

export default router;