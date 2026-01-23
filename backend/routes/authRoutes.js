// ============================================
// AUTH ROUTES
// ============================================
import express from 'express';
import {
    register,
    login,
    getMe,
    updatePreferences,
    getSearchHistory,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import {
    validateRegister,
    validateLogin,
    validatePreferences,
    validateEmail,
    validatePasswordReset,
    validateProfileUpdate,
    validatePasswordChange,
    validate
} from '../middlewares/validation.js';

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', validateRegister, validate, register);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, validate, login);

// POST /api/auth/verify-email/:token - Verify email address
router.post('/verify-email/:token', verifyEmail);

// POST /api/auth/forgot-password - Send password reset email
router.post('/forgot-password', validateEmail, validate, forgotPassword);

// POST /api/auth/reset-password/:token - Reset password with token
router.post('/reset-password/:token', validatePasswordReset, validate, resetPassword);

// GET /api/auth/me - Get current user profile
router.get('/me', protect, getMe);

// PUT /api/auth/profile - Update user profile
router.put('/profile', protect, validateProfileUpdate, validate, updateProfile);

// PUT /api/auth/change-password - Change password
router.put('/change-password', protect, validatePasswordChange, validate, changePassword);

// PUT /api/auth/preferences - Update user preferences
router.put('/preferences', protect, validatePreferences, validate, updatePreferences);

// GET /api/auth/history - Get search history
router.get('/history', protect, getSearchHistory);

export default router;
