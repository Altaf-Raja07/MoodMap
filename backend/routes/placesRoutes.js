// ============================================
// PLACES ROUTES
// ============================================
import express from 'express';
import {
    getPlacesByMood,
    getNearbyPlaces,
    getPlaceDetails,
    searchPlaces,
    getStreetFood
} from '../controllers/placesController.js';
import { optionalAuth } from '../middlewares/auth.js';
import {
    validateMoodQuery,
    validatePlaceId,
    validateTextSearch,
    validate
} from '../middlewares/validation.js';

const router = express.Router();

// GET /api/places/mood - Get places by mood
router.get('/mood', optionalAuth, validateMoodQuery, validate, getPlacesByMood);

// GET /api/places/nearby - Get nearby places
router.get('/nearby', getNearbyPlaces);

// GET /api/places/street-food - Get street food places
router.get('/street-food', getStreetFood);

// GET /api/places/search - Search places by text
router.get('/search', validateTextSearch, validate, searchPlaces);

// GET /api/places/:placeId - Get place details
router.get('/:placeId', validatePlaceId, validate, getPlaceDetails);

export default router;
