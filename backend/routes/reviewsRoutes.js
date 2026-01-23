// ============================================
// REVIEW ROUTES
// ============================================
import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
    createReview,
    getPlaceReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    markHelpful,
    reportReview
} from '../controllers/reviewsController.js';
import { validateReview, validateReviewUpdate, validate } from '../middlewares/validation.js';

const router = express.Router();

// Create a review (protected)
router.post('/', protect, validateReview, validate, createReview);

// Get reviews for a specific place (public)
router.get('/place/:placeId', getPlaceReviews);

// Get current user's reviews (protected)
router.get('/my-reviews', protect, getMyReviews);

// Update a review (protected)
router.put('/:reviewId', protect, validateReviewUpdate, validate, updateReview);

// Delete a review (protected)
router.delete('/:reviewId', protect, deleteReview);

// Mark review as helpful/unhelpful (protected)
router.post('/:reviewId/helpful', protect, markHelpful);

// Report a review (protected)
router.post('/:reviewId/report', protect, reportReview);

export default router;
