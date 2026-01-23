// ============================================
// REVIEWS CONTROLLER - User reviews for places
// ============================================
import Review from '../models/Review.js';
import User from '../models/User.js';

/**
 * Create a review
 * @route POST /api/reviews
 * @access Private
 */
export const createReview = async (req, res) => {
    try {
        const { placeId, placeName, rating, review, mood, photos } = req.body;

        // Check if user already reviewed this place
        const existingReview = await Review.findOne({
            user: req.user._id,
            placeId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this place. Please update your existing review instead.'
            });
        }

        // Create review
        const newReview = await Review.create({
            user: req.user._id,
            placeId,
            placeName,
            rating,
            review,
            mood,
            photos: photos || []
        });

        // Populate user info
        await newReview.populate('user', 'name');

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: newReview
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this place'
            });
        }
        
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
};

/**
 * Get reviews for a place
 * @route GET /api/reviews/place/:placeId
 * @access Public
 */
export const getPlaceReviews = async (req, res) => {
    try {
        const { placeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ placeId, reported: false })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await Review.countDocuments({ placeId, reported: false });

        // Get average rating
        const stats = await Review.getAverageRating(placeId);

        res.json({
            success: true,
            page,
            totalPages: Math.ceil(total / limit),
            total,
            averageRating: stats.averageRating,
            totalReviews: stats.totalReviews,
            data: reviews
        });
    } catch (error) {
        console.error('Get place reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

/**
 * Get user's reviews
 * @route GET /api/reviews/my-reviews
 * @access Private
 */
export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your reviews',
            error: error.message
        });
    }
};

/**
 * Update a review
 * @route PUT /api/reviews/:reviewId
 * @access Private
 */
export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, review, mood, photos } = req.body;

        const existingReview = await Review.findById(reviewId);

        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns this review
        if (existingReview.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        // Update fields
        if (rating !== undefined) existingReview.rating = rating;
        if (review !== undefined) existingReview.review = review;
        if (mood !== undefined) existingReview.mood = mood;
        if (photos !== undefined) existingReview.photos = photos;

        await existingReview.save();
        await existingReview.populate('user', 'name');

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: existingReview
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
};

/**
 * Delete a review
 * @route DELETE /api/reviews/:reviewId
 * @access Private
 */
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns this review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await review.deleteOne();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};

/**
 * Mark review as helpful
 * @route POST /api/reviews/:reviewId/helpful
 * @access Private
 */
export const markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user already marked as helpful
        const alreadyMarked = review.helpful.includes(req.user._id);

        if (alreadyMarked) {
            // Remove from helpful
            review.helpful = review.helpful.filter(
                id => id.toString() !== req.user._id.toString()
            );
        } else {
            // Add to helpful
            review.helpful.push(req.user._id);
        }

        await review.save();

        res.json({
            success: true,
            message: alreadyMarked ? 'Removed from helpful' : 'Marked as helpful',
            helpfulCount: review.helpful.length
        });
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing request',
            error: error.message
        });
    }
};

/**
 * Report a review
 * @route POST /api/reviews/:reviewId/report
 * @access Private
 */
export const reportReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.reported = true;
        await review.save();

        res.json({
            success: true,
            message: 'Review reported successfully. Thank you for helping us maintain quality.'
        });
    } catch (error) {
        console.error('Report review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error reporting review',
            error: error.message
        });
    }
};
