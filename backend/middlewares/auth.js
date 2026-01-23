// ============================================
// AUTH MIDDLEWARE - JWT Verification
// ============================================
import authService from '../services/authService.js';
import User from '../models/User.js';

/**
 * Protect routes - Verify JWT token
 */
export const protect = async (req, res, next) => {
    try {
        // Extract token from headers
        const token = authService.extractToken(req);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please provide a valid token.'
            });
        }

        // Verify token
        const decoded = authService.verifyToken(token);

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
            error: error.message
        });
    }
};

/**
 * Optional auth - User not required but attach if token provided
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const token = authService.extractToken(req);

        if (token) {
            const decoded = authService.verifyToken(token);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        // Continue without user if token is invalid
        next();
    }
};
