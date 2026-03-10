// ============================================
// REQUEST LOGGER MIDDLEWARE
// ============================================
// What is Middleware?
// - Functions that run BEFORE your controller
// - They can modify request/response objects
// - They can stop the request or pass it forward
// - Used for: logging, authentication, validation, etc.
// ============================================

// Fields whose values should never appear in logs
const SENSITIVE_FIELDS = new Set(['password', 'currentPassword', 'newPassword', 'confirmPassword', 'token']);

/**
 * Return a copy of the body with sensitive values replaced by '***'
 */
const maskSensitiveFields = (body) => {
    if (!body || typeof body !== 'object') return body;
    const masked = { ...body };
    Object.keys(masked).forEach(key => {
        if (SENSITIVE_FIELDS.has(key)) {
            masked[key] = '***';
        }
    });
    return masked;
};

export const requestLogger = (req, res, next) => {
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Get request method and URL
    const method = req.method;
    const url = req.url;
    
    // Log the request details
    console.log(`[${timestamp}] ${method} ${url}`);
    
    // If there's a body, log it with sensitive fields masked
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', maskSensitiveFields(req.body));
    }
    
    // Pass control to next middleware or route handler
    next();
};
