import { Router } from 'express';
import { getUsers } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', authenticate, getUsers);

export default router;
