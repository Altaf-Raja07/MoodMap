// ============================================
// MOODMAP BACKEND - COMPLETE API SERVER
// ============================================
// A complete mood-based place recommendation backend
// Features:
// - User authentication (JWT)
// - Google Places API integration
// - Favorites system
// - Search history tracking
// - Rate limiting & security
// ============================================

import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';

// Load environment variables first
dotenv.config();

// Import database connection
import connectDB from './config/database.js';

// Import custom middlewares
import { requestLogger } from './middlewares/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import corsMiddleware from './middlewares/cors.js';
import { apiLimiter, authLimiter, placesLimiter } from './middlewares/rateLimiter.js';
import { sanitize } from './middlewares/sanitization.js';
import { performanceMonitor, slowRequestWarning } from './middlewares/performanceMonitor.js';

// Import routes
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import placesRoutes from './routes/placesRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Create Express app
const app = express();

// ============================================
// DATABASE CONNECTION
// ============================================
connectDB();

// ============================================
// SECURITY MIDDLEWARES
// ============================================
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(corsMiddleware); // CORS with custom config

// ============================================
// BODY PARSING MIDDLEWARES
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// LOGGING
// ============================================
app.use(requestLogger);

// ============================================
// SANITIZATION & SECURITY
// ============================================
app.use(sanitize); // Sanitize all inputs

// ============================================
// PERFORMANCE MONITORING
// ============================================
app.use(performanceMonitor);
app.use(slowRequestWarning(2000)); // Warn if request takes > 2 seconds

// ============================================
// RATE LIMITING
// ============================================
app.use('/api/', apiLimiter); // General rate limit

// ============================================
// ROUTES
// ============================================

// Health & Status routes
app.use('/api', healthRoutes);

// Auth routes (with stricter rate limiting)
app.use('/api/auth', authLimiter, authRoutes);

// Places routes (with places-specific rate limiting)
app.use('/api/places', placesLimiter, placesRoutes);

// Favorites routes
app.use('/api/favorites', favoritesRoutes);

// Reviews routes
app.use('/api/reviews', reviewsRoutes);

// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// ============================================
// ERROR HANDLING
// ============================================
// These run AFTER all routes

// 404 Handler - Catches undefined routes
app.use(notFoundHandler);

// Global Error Handler - Catches all errors
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 MOODMAP BACKEND SERVER STARTED');
    console.log('='.repeat(60));
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🕐 Started: ${new Date().toLocaleString()}`);
    console.log('='.repeat(60));
    console.log('\n📌 Available Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   GET  http://localhost:${PORT}/api/status`);
    console.log(`   GET  http://localhost:${PORT}/api`);
    console.log('\n' + '='.repeat(60));
    console.log('✅ Ready to accept requests!');
    console.log('='.repeat(60) + '\n');
});