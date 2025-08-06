import express from 'express';
import { loginUser, saveUser } from '../controllers/userController.js';
import verifyJWT from '../middleware/auth.js';

const userRouter = express.Router();

// ✅ Public routes (no authentication required)
userRouter.post('/login', loginUser);
userRouter.post('/', saveUser);  // Registration - though you might want to protect admin creation

// ✅ Protected routes (authentication required)
// userRouter.get('/profile', verifyJWT, getUserProfile);
// userRouter.put('/profile', verifyJWT, updateUserProfile);
// userRouter.get('/', verifyJWT, getAllUsers);  // Admin only route

export default userRouter;