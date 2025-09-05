// routes/authroutes.js
import express from 'express';
import { 
  register, 
  login, 
  logout, 
  sendVerifyOtp, 
  verifyEmail, 
  sendResetOtp, 
  resetPassword, 
  isAuthenticated 
} from '../controllers/authController.js';
import { userAuth } from '../middleware/userAuth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);

// Protected routes (require valid token)
router.get('/logout', userAuth, logout);
router.get('/me', userAuth, isAuthenticated); // ✅ frontend auth check
router.get('/is-auth', userAuth, isAuthenticated); // ✅ optional alias
router.post('/send-verify-otp', userAuth, sendVerifyOtp);
router.post('/verify-email', userAuth, verifyEmail);

export default router;
