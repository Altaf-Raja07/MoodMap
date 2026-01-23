// ============================================
// FAVORITES CONTROLLER
// ============================================
import User from '../models/User.js';

/**
 * Get all favorites
 * @route GET /api/favorites
 * @access Private
 */
export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            count: user.favorites.length,
            data: user.favorites.reverse() // Most recent first
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching favorites',
            error: error.message
        });
    }
};

/**
 * Add place to favorites
 * @route POST /api/favorites
 * @access Private
 */
export const addFavorite = async (req, res) => {
    try {
        const { placeId, placeName } = req.body;

        const user = await User.findById(req.user._id);

        // Check if already favorited
        const alreadyFavorited = user.favorites.some(fav => fav.placeId === placeId);

        if (alreadyFavorited) {
            return res.status(400).json({
                success: false,
                message: 'Place already in favorites'
            });
        }

        // Add to favorites
        user.favorites.push({
            placeId,
            placeName,
            savedAt: new Date()
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Place added to favorites',
            data: user.favorites[user.favorites.length - 1]
        });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding favorite',
            error: error.message
        });
    }
};

/**
 * Remove place from favorites
 * @route DELETE /api/favorites/:placeId
 * @access Private
 */
export const removeFavorite = async (req, res) => {
    try {
        const { placeId } = req.params;

        const user = await User.findById(req.user._id);

        // Filter out the place
        const initialLength = user.favorites.length;
        user.favorites = user.favorites.filter(fav => fav.placeId !== placeId);

        if (user.favorites.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: 'Place not found in favorites'
            });
        }

        await user.save();

        res.json({
            success: true,
            message: 'Place removed from favorites'
        });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing favorite',
            error: error.message
        });
    }
};

/**
 * Check if place is favorited
 * @route GET /api/favorites/check/:placeId
 * @access Private
 */
export const checkFavorite = async (req, res) => {
    try {
        const { placeId } = req.params;
        const user = await User.findById(req.user._id);

        const isFavorited = user.favorites.some(fav => fav.placeId === placeId);

        res.json({
            success: true,
            isFavorited
        });
    } catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking favorite status',
            error: error.message
        });
    }
};
