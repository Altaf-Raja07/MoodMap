// ============================================
// HEALTH CONTROLLER
// ============================================
// What is a Controller?
// - Controllers contain the business logic for your routes
// - They handle what happens when someone hits an API endpoint
// - They process data, make decisions, and send responses
// - Think of it as the "brain" of your API endpoint
// ============================================

// Health Check - Verify server is running
export const getHealth = (req, res) => {
    try {
        // Create response object
        const response = {
            success: true,
            message: 'MoodMap Backend is running! 🚀',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            status: 'healthy'
        };

        // Send 200 OK response with JSON data
        res.status(200).json(response);
        
    } catch (error) {
        // If something goes wrong, send error response
        res.status(500).json({
            success: false,
            message: 'Health check failed',
            error: error.message
        });
    }
};

// Server Status - Returns detailed server information
export const getStatus = (req, res) => {
    try {
        // Get server uptime in seconds
        const uptimeSeconds = process.uptime();
        
        // Convert to hours, minutes, seconds for readability
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);

        const response = {
            success: true,
            message: 'Server is healthy and running',
            data: {
                environment: process.env.NODE_ENV || 'development',
                uptime: {
                    seconds: uptimeSeconds,
                    formatted: `${hours}h ${minutes}m ${seconds}s`
                },
                timestamp: new Date().toLocaleString(),
                memoryUsage: {
                    // Memory usage in MB
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
                },
                nodeVersion: process.version
            }
        };

        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Status check failed',
            error: error.message
        });
    }
};

// API Information - Returns available endpoints
export const getApiInfo = (req, res) => {
    try {
        const response = {
            success: true,
            message: 'Welcome to MoodMap API',
            data: {
                name: 'MoodMap Backend API',
                version: '1.0.0',
                description: 'Smart Nearby Places & Street Food Recommender',
                endpoints: {
                    health: {
                        path: '/api/health',
                        method: 'GET',
                        description: 'Check if server is running'
                    },
                    status: {
                        path: '/api/status',
                        method: 'GET',
                        description: 'Get detailed server status'
                    },
                    info: {
                        path: '/api',
                        method: 'GET',
                        description: 'Get API information'
                    }
                }
            }
        };

        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch API info',
            error: error.message
        });
    }
};
