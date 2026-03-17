import { Router } from 'express';
import { getMessages, postMessage } from '../controllers/messageController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/:userId', authenticate, getMessages);
router.post('/', authenticate, postMessage);

export default router;
