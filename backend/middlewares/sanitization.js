// ============================================
// SANITIZATION MIDDLEWARE - Clean user input
// ============================================

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Remove potential HTML tags
    return input
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
};

// Fields that must never be sanitized (passwords, tokens)
const SENSITIVE_FIELDS = new Set(['password', 'currentPassword', 'newPassword', 'confirmPassword', 'token']);

/**
 * Middleware to sanitize request body
 */
export const sanitizeBody = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach(key => {
            // Skip sensitive fields – never alter password values
            if (SENSITIVE_FIELDS.has(key)) return;
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeInput(req.body[key]);
            } else if (Array.isArray(req.body[key])) {
                req.body[key] = req.body[key].map(item => 
                    typeof item === 'string' ? sanitizeInput(item) : item
                );
            }
        });
    }
    next();
};

/**
 * Middleware to sanitize query parameters
 */
export const sanitizeQuery = (req, res, next) => {
    if (req.query && typeof req.query === 'object') {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeInput(req.query[key]);
            }
        });
    }
    next();
};

/**
 * Combined sanitization middleware
 */
export const sanitize = (req, res, next) => {
    sanitizeBody(req, res, () => {
        sanitizeQuery(req, res, next);
    });
};
