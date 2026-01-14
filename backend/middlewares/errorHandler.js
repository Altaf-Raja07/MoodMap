// ============================================
// ERROR HANDLER MIDDLEWARE
// ============================================
// This catches all errors and sends proper responses
// It runs when something goes wrong in your app
// ============================================

export const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error('Error occurred:', err);

    // Get status code (default to 500 if not set)
    const statusCode = err.statusCode || 500;

    // Send error response
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

// 404 Not Found Handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: [
            'GET /api/health',
            'GET /api/status',
            'GET /api'
        ]
    });
};
