// ============================================
// PLACES CONTROLLER
// ============================================
// Handles all place-related operations
// - Get places based on mood
// - Search nearby places
// - Get place details
// ============================================

// Get places based on mood
export const getPlacesByMood = (req, res) => {
    try {
        // Get mood from query parameter (e.g., /api/places?mood=work)
        const { mood } = req.query;

        // Validate mood parameter
        if (!mood) {
            return res.status(400).json({
                success: false,
                message: 'Mood parameter is required'
            });
        }

        // Mock data - Later we'll fetch from database or external API
        const moodPlaces = {
            work: [
                { id: 1, name: 'Cafe Coffee Day', type: 'Cafe', wifi: true, quiet: true },
                { id: 2, name: 'Starbucks', type: 'Cafe', wifi: true, quiet: true }
            ],
            date: [
                { id: 3, name: 'The Romantic Garden', type: 'Restaurant', ambience: 'romantic' },
                { id: 4, name: 'Rooftop Lounge', type: 'Lounge', ambience: 'romantic' }
            ],
            hangout: [
                { id: 5, name: 'Fun Zone Arcade', type: 'Entertainment', crowd: 'medium' },
                { id: 6, name: 'Sports Bar', type: 'Bar', crowd: 'high' }
            ]
        };

        // Get places for the requested mood
        const places = moodPlaces[mood.toLowerCase()] || [];

        res.status(200).json({
            success: true,
            message: `Found ${places.length} places for ${mood} mood`,
            mood: mood,
            count: places.length,
            data: places
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch places',
            error: error.message
        });
    }
};

// Get nearby places based on location
export const getNearbyPlaces = (req, res) => {
    try {
        // Get latitude and longitude from query params
        const { lat, lng, radius } = req.query;

        // Validate required parameters
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        // Mock nearby places data
        const nearbyPlaces = [
            { id: 1, name: 'Cafe Near You', distance: '0.5 km', rating: 4.5 },
            { id: 2, name: 'Street Food Hub', distance: '1.2 km', rating: 4.8 },
            { id: 3, name: 'Local Restaurant', distance: '2.0 km', rating: 4.2 }
        ];

        res.status(200).json({
            success: true,
            message: 'Nearby places found',
            location: { latitude: lat, longitude: lng },
            radius: radius || '5 km',
            count: nearbyPlaces.length,
            data: nearbyPlaces
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch nearby places',
            error: error.message
        });
    }
};

// Get details of a specific place
export const getPlaceDetails = (req, res) => {
    try {
        // Get place ID from URL parameter
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Place ID is required'
            });
        }

        // Mock place details
        const placeDetails = {
            id: id,
            name: 'Sample Place',
            type: 'Restaurant',
            rating: 4.5,
            reviews: 245,
            address: '123 Main Street, City',
            openNow: true,
            hours: '9:00 AM - 10:00 PM',
            priceLevel: 2,
            features: ['WiFi', 'Parking', 'Outdoor Seating'],
            images: ['image1.jpg', 'image2.jpg']
        };

        res.status(200).json({
            success: true,
            message: 'Place details retrieved',
            data: placeDetails
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch place details',
            error: error.message
        });
    }
};

// Search places by name or type
export const searchPlaces = (req, res) => {
    try {
        // Get search query from query parameter
        const { query } = req.query;

        // Validate query
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Mock search results
        const searchResults = [
            { id: 1, name: 'Pizza Place', type: 'Restaurant', match: 'name' },
            { id: 2, name: 'Burger Joint', type: 'Fast Food', match: 'name' }
        ];

        res.status(200).json({
            success: true,
            message: `Found ${searchResults.length} results for "${query}"`,
            query: query,
            count: searchResults.length,
            data: searchResults
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};
