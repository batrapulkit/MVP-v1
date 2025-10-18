// routes/index.ts
import { Router } from 'express';
import userRoutes from './user.routes';
import chatRoutes from './chat.routes'; // ✅ import chat routes

const router = Router();

// User routes
router.use('/users', userRoutes);

// Chat routes
router.use('/chat', chatRoutes); // ✅ all chat endpoints under /chat

export default router;
