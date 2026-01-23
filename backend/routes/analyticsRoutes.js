// ============================================
// ANALYTICS ROUTES
// ============================================
import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
    getMyStats,
    getPopularMoods,
    getTrendingPlaces,
    getPlatformStats
} from '../controllers/analyticsController.js';

const router = express.Router();

// Get user's personal statistics (protected)
router.get('/me', protect, getMyStats);

// Get popular moods (public)
router.get('/popular-moods', getPopularMoods);

// Get trending places (public)
router.get('/trending', getTrendingPlaces);

// Get platform statistics (protected - admin only in future)
router.get('/platform', protect, getPlatformStats);

export default router;
