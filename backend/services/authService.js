// ============================================
// JWT AUTHENTICATION SERVICE
// ============================================
import jwt from 'jsonwebtoken';

class AuthService {
    /**
     * Generate JWT token
     */
    generateToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    }

    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Extract token from request headers
     */
    extractToken(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return null;
    }

    /**
     * Create token response
     */
    createTokenResponse(user, token) {
        return {
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                createdAt: user.createdAt
            }
        };
    }
}

export default new AuthService();
