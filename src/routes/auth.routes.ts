import { Router } from 'express';
import { RequestHandler } from 'express';
import { login, signup, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Cast your controller functions to RequestHandler type
router.post('/signup', signup as unknown as RequestHandler);
router.post('/login', login as unknown as RequestHandler);
router.get('/profile', getProfile as unknown as RequestHandler);

export default router;