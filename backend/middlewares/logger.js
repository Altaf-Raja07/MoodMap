// ============================================
// REQUEST LOGGER MIDDLEWARE
// ============================================
// What is Middleware?
// - Functions that run BEFORE your controller
// - They can modify request/response objects
// - They can stop the request or pass it forward
// - Used for: logging, authentication, validation, etc.
// ============================================

export const requestLogger = (req, res, next) => {
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Get request method and URL
    const method = req.method;
    const url = req.url;
    
    // Log the request details
    console.log(`[${timestamp}] ${method} ${url}`);
    
    // If there's a body, log it (useful for POST/PUT requests)
    if (Object.keys(req.body).length > 0) {
        console.log('Request Body:', req.body);
    }
    
    // Pass control to next middleware or route handler
    next();
};
