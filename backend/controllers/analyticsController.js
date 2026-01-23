// ============================================
// ANALYTICS CONTROLLER
// ============================================
import analyticsService from '../services/analyticsService.js';

/**
 * Get user's personal statistics
 * @route GET /api/analytics/me
 * @access Private
 */
export const getMyStats = async (req, res) => {
    try {
        const stats = await analyticsService.getUserStats(req.user._id);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get my stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

/**
 * Get popular moods across platform
 * @route GET /api/analytics/popular-moods
 * @access Public
 */
export const getPopularMoods = async (req, res) => {
    try {
        const moods = await analyticsService.getPopularMoods();

        res.json({
            success: true,
            data: moods
        });
    } catch (error) {
        console.error('Get popular moods error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching popular moods',
            error: error.message
        });
    }
};

/**
 * Get trending places
 * @route GET /api/analytics/trending
 * @access Public
 */
export const getTrendingPlaces = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const places = await analyticsService.getTrendingPlaces(limit);

        res.json({
            success: true,
            count: places.length,
            data: places
        });
    } catch (error) {
        console.error('Get trending places error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trending places',
            error: error.message
        });
    }
};

/**
 * Get platform statistics (admin only - placeholder)
 * @route GET /api/analytics/platform
 * @access Private (Admin)
 */
export const getPlatformStats = async (req, res) => {
    try {
        // TODO: Add admin role check
        const stats = await analyticsService.getPlatformStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get platform stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching platform statistics',
            error: error.message
        });
    }
};
