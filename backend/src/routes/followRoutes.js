import { Router } from 'express';
import { follow, unfollow } from '../controllers/followController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/:id', authenticate, follow);
router.delete('/:id', authenticate, unfollow);

export default router;
