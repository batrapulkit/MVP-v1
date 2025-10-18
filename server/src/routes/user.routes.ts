import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  loginUser,
  logoutUser,
  googleLoginUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
} from '../controllers/user.controller';

import { authenticate } from '../middleware/auth'; // ✅ add this

const router = Router();

router.get('/', getAllUsers);
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);  // logout route
router.post('/auth/google', googleLoginUser); // Google auth route



// ✅ Add this protected route
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateUserProfile); // ✅ new endpoint
router.post('/change-password', authenticate, changePassword);


export default router;
