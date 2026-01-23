// ============================================
// FAVORITES ROUTES
// ============================================
import express from 'express';
import {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite
} from '../controllers/favoritesController.js';
import { protect } from '../middlewares/auth.js';
import { validateAddFavorite, validate } from '../middlewares/validation.js';

const router = express.Router();

// All routes are protected (require authentication)

// GET /api/favorites - Get all favorites
router.get('/', protect, getFavorites);

// POST /api/favorites - Add to favorites
router.post('/', protect, validateAddFavorite, validate, addFavorite);

// DELETE /api/favorites/:placeId - Remove from favorites
router.delete('/:placeId', protect, removeFavorite);

// GET /api/favorites/check/:placeId - Check if favorited
router.get('/check/:placeId', protect, checkFavorite);

export default router;
