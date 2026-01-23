// ============================================
// ANALYTICS SERVICE - Track user behavior and app metrics
// ============================================
import User from '../models/User.js';
import Review from '../models/Review.js';
import Place from '../models/Place.js';

class AnalyticsService {
    /**
     * Get user statistics
     */
    async getUserStats(userId) {
        const user = await User.findById(userId);
        const reviews = await Review.find({ user: userId });
        
        return {
            totalSearches: user.searchHistory.length,
            totalFavorites: user.favorites.length,
            totalReviews: reviews.length,
            accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)), // days
            lastLogin: user.lastLogin,
            isEmailVerified: user.isEmailVerified,
            preferredMoods: this.getMostUsedMoods(user.searchHistory),
            averageRatingGiven: this.calculateAverageRating(reviews)
        };
    }

    /**
     * Get platform statistics (admin)
     */
    async getPlatformStats() {
        const [
            totalUsers,
            activeUsers,
            totalReviews,
            totalPlaces,
            verifiedUsers
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
            Review.countDocuments(),
            Place.countDocuments(),
            User.countDocuments({ isEmailVerified: true })
        ]);

        return {
            totalUsers,
            activeUsers,
            totalReviews,
            totalPlaces,
            verifiedUsers,
            verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) : 0
        };
    }

    /**
     * Get most searched moods
     */
    async getPopularMoods() {
        const users = await User.find({}, 'searchHistory');
        const moodCounts = {};

        users.forEach(user => {
            user.searchHistory.forEach(search => {
                if (search.mood) {
                    moodCounts[search.mood] = (moodCounts[search.mood] || 0) + 1;
                }
            });
        });

        return Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([mood, count]) => ({ mood, count }));
    }

    /**
     * Get trending places (most reviewed/favorited)
     */
    async getTrendingPlaces(limit = 10) {
        const reviews = await Review.aggregate([
            {
                $group: {
                    _id: { placeId: '$placeId', placeName: '$placeName' },
                    reviewCount: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            },
            { $sort: { reviewCount: -1 } },
            { $limit: limit }
        ]);

        return reviews.map(r => ({
            placeId: r._id.placeId,
            placeName: r._id.placeName,
            reviewCount: r.reviewCount,
            avgRating: r.avgRating.toFixed(1)
        }));
    }

    /**
     * Helper: Get most used moods from search history
     */
    getMostUsedMoods(searchHistory) {
        const moodCounts = {};
        searchHistory.forEach(search => {
            if (search.mood) {
                moodCounts[search.mood] = (moodCounts[search.mood] || 0) + 1;
            }
        });

        return Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([mood, count]) => ({ mood, count }));
    }

    /**
     * Helper: Calculate average rating
     */
    calculateAverageRating(reviews) {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }

    /**
     * Track API performance metrics
     */
    logApiMetrics(req, res, duration) {
        const metrics = {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            userAgent: req.get('user-agent'),
            ip: req.ip
        };

        // In production, send to monitoring service
        if (process.env.NODE_ENV === 'development') {
            if (duration > 1000) { // Log slow requests
                console.log('⚠️  SLOW REQUEST:', metrics);
            }
        }

        return metrics;
    }
}

export default new AnalyticsService();
