// ============================================
// INPUT VALIDATION MIDDLEWARE
// ============================================
import { body, param, query, validationResult } from 'express-validator';

/**
 * Handle validation errors
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * User Registration Validation
 */
export const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * User Login Validation
 */
export const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

/**
 * Mood Query Validation
 */
export const validateMoodQuery = [
    query('mood')
        .notEmpty().withMessage('Mood is required')
        .isIn(['work', 'date', 'hangout', 'quick-bite', 'budget', 'street-food', 'chill'])
        .withMessage('Invalid mood type'),
    query('lat')
        .notEmpty().withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    query('lng')
        .notEmpty().withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
    query('radius')
        .optional()
        .isInt({ min: 100, max: 50000 }).withMessage('Radius must be between 100 and 50000 meters')
];

/**
 * Place ID Validation
 */
export const validatePlaceId = [
    param('placeId')
        .notEmpty().withMessage('Place ID is required')
        .trim()
];

/**
 * Text Search Validation
 */
export const validateTextSearch = [
    query('query')
        .notEmpty().withMessage('Search query is required')
        .trim()
        .isLength({ min: 2 }).withMessage('Query must be at least 2 characters'),
    query('lat')
        .notEmpty().withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    query('lng')
        .notEmpty().withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];

/**
 * Add Favorite Validation
 */
export const validateAddFavorite = [
    body('placeId')
        .notEmpty().withMessage('Place ID is required')
        .trim(),
    body('placeName')
        .notEmpty().withMessage('Place name is required')
        .trim()
];

/**
 * Review Validation
 */
export const validateReview = [
    body('placeId')
        .notEmpty().withMessage('Place ID is required')
        .trim(),
    body('placeName')
        .notEmpty().withMessage('Place name is required')
        .trim(),
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review')
        .optional()
        .isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters'),
    body('mood')
        .optional()
        .isIn(['work', 'date', 'hangout', 'quick-bite', 'budget', 'street-food', 'chill'])
        .withMessage('Invalid mood type')
];

/**
 * Review Update Validation
 */
export const validateReviewUpdate = [
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review')
        .optional()
        .isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters'),
    body('mood')
        .optional()
        .isIn(['work', 'date', 'hangout', 'quick-bite', 'budget', 'street-food', 'chill'])
        .withMessage('Invalid mood type')
];

/**
 * Email Validation (for forgot password)
 */
export const validateEmail = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
];

/**
 * Password Reset Validation
 */
export const validatePasswordReset = [
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * Profile Update Validation
 */
export const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
];

/**
 * Password Change Validation
 */
export const validatePasswordChange = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        })
];

/**
 * Preferences Validation
 */
export const validatePreferences = [
    body('favoriteMoods')
        .optional()
        .isArray().withMessage('Favorite moods must be an array'),
    body('favoriteMoods.*')
        .optional()
        .isIn(['work', 'date', 'hangout', 'quick-bite', 'budget', 'street-food', 'chill'])
        .withMessage('Invalid mood type'),
    body('dietaryRestrictions')
        .optional()
        .isArray().withMessage('Dietary restrictions must be an array'),
    body('budgetRange')
        .optional()
        .isIn(['budget', 'moderate', 'expensive']).withMessage('Invalid budget range')
];
