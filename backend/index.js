// ============================================
// MOODMAP BACKEND - PRODUCTION STRUCTURE
// ============================================
// Day 1: Professional Backend Setup
// - Organized folder structure
// - Separation of concerns (Routes, Controllers, Middlewares)
// - Clean and maintainable code
// ============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import custom middlewares
import { requestLogger } from './middlewares/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

// Import routes
import healthRoutes from './routes/healthRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// ============================================
// GLOBAL MIDDLEWARES
// ============================================
// These run for EVERY request

// 1. CORS - Allow frontend to communicate
app.use(cors());

// 2. JSON Parser - Parse incoming JSON data
app.use(express.json());

// 3. URL Encoded Parser - Parse form data
app.use(express.urlencoded({ extended: true }));

// 4. Custom Logger - Log all requests
app.use(requestLogger);

// ============================================
// ROUTES
// ============================================
// Mount routes on specific paths

// Health & Status routes
app.use('/api', healthRoutes);

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