// ============================================
// PERFORMANCE MONITORING MIDDLEWARE
// ============================================
import analyticsService from '../services/analyticsService.js';

/**
 * Track response time for all requests
 */
export const performanceMonitor = (req, res, next) => {
    const startTime = Date.now();

    // Capture the original end function
    const originalEnd = res.end;

    // Override res.end to track completion time
    res.end = function(...args) {
        const duration = Date.now() - startTime;
        
        // Add response time header
        res.setHeader('X-Response-Time', `${duration}ms`);

        // Log metrics
        analyticsService.logApiMetrics(req, res, duration);

        // Call original end function
        originalEnd.apply(res, args);
    };

    next();
};

/**
 * Slow request warning threshold (in ms)
 */
export const slowRequestWarning = (threshold = 1000) => {
    return (req, res, next) => {
        const startTime = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - startTime;
            if (duration > threshold) {
                console.warn(`⚠️  SLOW REQUEST: ${req.method} ${req.path} took ${duration}ms`);
            }
        });

        next();
    };
};
