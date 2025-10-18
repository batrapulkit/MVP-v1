import { Router } from 'express';
import { saveChat, getChat } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Save chat (POST)
router.post('/save', authenticate, saveChat);

// Get chat by chatId (GET)
router.get('/:chatId', authenticate, getChat);

export default router;
