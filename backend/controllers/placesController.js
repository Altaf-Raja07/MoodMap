// ============================================
// PLACES CONTROLLER - Mood-based recommendations
// ============================================
import placesService from '../services/googlePlacesService.js';
import Place from '../models/Place.js';
import User from '../models/User.js';

/**
 * Get places by mood
 * @route GET /api/places/mood
 * @access Public (with optional auth)
 */
export const getPlacesByMood = async (req, res) => {
    try {
        const { mood, lat, lng, radius = 5000 } = req.query;

        // Get places from Foursquare API
        const places = await placesService.searchByMood(
            mood,
            parseFloat(lat),
            parseFloat(lng),
            parseInt(radius)
        );

        // Save search to user history if authenticated
        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    searchHistory: {
                        $each: [{
                            mood,
                            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
                            searchedAt: new Date()
                        }],
                        $slice: -50 // Keep only last 50 searches
                    }
                }
            });
        }

        res.json({
            success: true,
            mood,
            count: places.length,
            data: places
        });
    } catch (error) {
        console.error('Error in getPlacesByMood:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching places',
            error: error.message
        });
    }
};

/**
 * Get nearby places
 * @route GET /api/places/nearby
 * @access Public
 */
export const getNearbyPlaces = async (req, res) => {
    try {
        const { lat, lng, radius = 5000, type = 'restaurant' } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude (lat) and longitude (lng) are required'
            });
        }

        const places = await placesService.getNearbyPlaces(
            parseFloat(lat),
            parseFloat(lng),
            parseInt(radius),
            type
        );

        res.json({
            success: true,
            count: places.length,
            data: places
        });
    } catch (error) {
        console.error('Error in getNearbyPlaces:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching nearby places',
            error: error.message
        });
    }
};

/**
 * Get place details
 * @route GET /api/places/:placeId
 * @access Public
 */
export const getPlaceDetails = async (req, res) => {
    try {
        const { placeId } = req.params;

        // Try to get from cache/database first
        let place = await Place.findOne({ placeId });

        // If not in database, fetch from API
        if (!place) {
            const placeDetails = await placesService.getPlaceDetails(placeId);

            // Transform location from { lat, lng } to GeoJSON Point for MongoDB
            const placeDataForDB = {
                ...placeDetails,
                location: {
                    type: 'Point',
                    coordinates: [placeDetails.location.lng, placeDetails.location.lat]
                }
            };

            // Save to database for future requests
            place = await Place.findOneAndUpdate(
                { placeId },
                placeDataForDB,
                { upsert: true, new: true }
            );

            // Return the original formatted data (not GeoJSON) to the client
            return res.json({
                success: true,
                data: placeDetails
            });
        }

        res.json({
            success: true,
            data: {
                ...place.toObject(),
                location: {
                    lat: place.location?.coordinates?.[1] ?? 0,
                    lng: place.location?.coordinates?.[0] ?? 0
                }
            }
        });
    } catch (error) {
        console.error('Error in getPlaceDetails:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching place details',
            error: error.message
        });
    }
};

/**
 * Search places by text
 * @route GET /api/places/search
 * @access Public
 */
export const searchPlaces = async (req, res) => {
    try {
        const { query, lat, lng, radius = 5000 } = req.query;

        const places = await placesService.textSearch(
            query,
            parseFloat(lat),
            parseFloat(lng),
            parseInt(radius)
        );

        res.json({
            success: true,
            query,
            count: places.length,
            data: places
        });
    } catch (error) {
        console.error('Error in searchPlaces:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching places',
            error: error.message
        });
    }
};

/**
 * Get street food places
 * @route GET /api/places/street-food
 * @access Public
 */
export const getStreetFood = async (req, res) => {
    try {
        const { lat, lng, radius = 5000 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude (lat) and longitude (lng) are required'
            });
        }

        // Search for street food specifically
        const places = await placesService.textSearch(
            'street food',
            parseFloat(lat),
            parseFloat(lng),
            parseInt(radius)
        );

        res.json({
            success: true,
            count: places.length,
            data: places
        });
    } catch (error) {
        console.error('Error in getStreetFood:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching street food places',
            error: error.message
        });
    }
};
