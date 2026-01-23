// ============================================
// GOOGLE PLACES API SERVICE
// ============================================
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

class GooglePlacesService {
    constructor() {
        this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
        this.baseUrl = 'https://maps.googleapis.com/maps/api';
    }

    // Mood to Google Places types mapping
    getMoodTypes(mood) {
        const moodMapping = {
            'work': ['cafe', 'restaurant'],
            'date': ['restaurant', 'bar', 'night_club'],
            'hangout': ['cafe', 'restaurant', 'bar', 'bowling_alley', 'amusement_park'],
            'quick-bite': ['fast_food', 'meal_takeaway', 'cafe'],
            'budget': ['meal_takeaway', 'fast_food', 'cafe'],
            'street-food': ['meal_takeaway', 'restaurant', 'food'],
            'chill': ['cafe', 'park', 'library', 'spa']
        };
        return moodMapping[mood] || ['restaurant'];
    }

    // Get mood-specific keywords
    getMoodKeywords(mood) {
        const keywords = {
            'work': 'wifi quiet workspace coffee',
            'date': 'romantic ambiance fine dining',
            'hangout': 'casual fun friends',
            'quick-bite': 'fast quick snack',
            'budget': 'cheap affordable budget',
            'street-food': 'street food local authentic',
            'chill': 'relaxing peaceful quiet'
        };
        return keywords[mood] || '';
    }

    /**
     * Search places by mood
     */
    async searchByMood(mood, latitude, longitude, radius = 5000) {
        const cacheKey = `mood_${mood}_${latitude}_${longitude}_${radius}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const types = this.getMoodTypes(mood);
        const keyword = this.getMoodKeywords(mood);

        try {
            const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
                params: {
                    location: `${latitude},${longitude}`,
                    radius,
                    type: types[0],
                    keyword,
                    key: this.apiKey
                }
            });

            const places = this.formatPlaces(response.data.results);
            cache.set(cacheKey, places);
            return places;
        } catch (error) {
            console.error('Google Places API Error:', error.message);
            throw new Error('Failed to fetch places from Google API');
        }
    }

    /**
     * Get nearby places (generic search)
     */
    async getNearbyPlaces(latitude, longitude, radius = 5000, type = 'restaurant') {
        const cacheKey = `nearby_${latitude}_${longitude}_${radius}_${type}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
                params: {
                    location: `${latitude},${longitude}`,
                    radius,
                    type,
                    key: this.apiKey
                }
            });

            const places = this.formatPlaces(response.data.results);
            cache.set(cacheKey, places);
            return places;
        } catch (error) {
            console.error('Google Places API Error:', error.message);
            throw new Error('Failed to fetch nearby places');
        }
    }

    /**
     * Get place details by ID
     */
    async getPlaceDetails(placeId) {
        const cacheKey = `details_${placeId}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(`${this.baseUrl}/place/details/json`, {
                params: {
                    place_id: placeId,
                    fields: 'name,rating,formatted_phone_number,formatted_address,geometry,opening_hours,photos,price_level,types,website,reviews',
                    key: this.apiKey
                }
            });

            const details = this.formatPlaceDetails(response.data.result);
            cache.set(cacheKey, details);
            return details;
        } catch (error) {
            console.error('Google Places API Error:', error.message);
            throw new Error('Failed to fetch place details');
        }
    }

    /**
     * Search places by text query
     */
    async textSearch(query, latitude, longitude, radius = 5000) {
        const cacheKey = `text_${query}_${latitude}_${longitude}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(`${this.baseUrl}/place/textsearch/json`, {
                params: {
                    query,
                    location: `${latitude},${longitude}`,
                    radius,
                    key: this.apiKey
                }
            });

            const places = this.formatPlaces(response.data.results);
            cache.set(cacheKey, places);
            return places;
        } catch (error) {
            console.error('Google Places API Error:', error.message);
            throw new Error('Failed to search places');
        }
    }

    /**
     * Get photo URL
     */
    getPhotoUrl(photoReference, maxWidth = 400) {
        return `${this.baseUrl}/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
    }

    /**
     * Format places data
     */
    formatPlaces(places) {
        return places.map(place => ({
            placeId: place.place_id,
            name: place.name,
            address: place.vicinity || place.formatted_address,
            location: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
            },
            rating: place.rating || 0,
            priceLevel: place.price_level || 0,
            types: place.types || [],
            openNow: place.opening_hours?.open_now,
            photos: place.photos?.slice(0, 3).map(photo => this.getPhotoUrl(photo.photo_reference)) || []
        }));
    }

    /**
     * Format place details
     */
    formatPlaceDetails(place) {
        return {
            placeId: place.place_id,
            name: place.name,
            address: place.formatted_address,
            location: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
            },
            rating: place.rating || 0,
            priceLevel: place.price_level || 0,
            types: place.types || [],
            phoneNumber: place.formatted_phone_number,
            website: place.website,
            openingHours: {
                openNow: place.opening_hours?.open_now,
                weekdayText: place.opening_hours?.weekday_text || []
            },
            photos: place.photos?.slice(0, 5).map(photo => this.getPhotoUrl(photo.photo_reference)) || [],
            reviews: place.reviews?.slice(0, 3).map(review => ({
                author: review.author_name,
                rating: review.rating,
                text: review.text,
                time: review.time
            })) || []
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        cache.flushAll();
    }
}

export default new GooglePlacesService();
