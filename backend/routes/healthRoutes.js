// ============================================
// HEALTH ROUTES
// ============================================
// What is a Route?
// - Routes define the URL paths for your API
// - They connect URLs to controller functions
// - Think of them as a "map" that tells Express where to go
// ============================================

import express from 'express';
import { getHealth, getStatus, getApiInfo } from '../controllers/healthController.js';

const router = express.Router();

// Define routes and connect them to controllers
router.get('/health', getHealth);
router.get('/status', getStatus);
router.get('/', getApiInfo);

export default router;
