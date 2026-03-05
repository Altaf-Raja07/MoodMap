// ============================================
// PLACES SERVICE - OpenStreetMap (Overpass API)
// 100% Free | No API key | No billing | No sign-up
// Uses OpenStreetMap community data
// ============================================
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

// Overpass API public mirrors (tried in order, falls back on failure)
const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass.openstreetmap.ru/api/interpreter',
];

class PlacesService {
    constructor() {
        this.nominatimUrl = 'https://nominatim.openstreetmap.org';
        // No API key needed!
    }

    /**
     * Query Overpass API with automatic failover across mirrors
     */
    async queryOverpass(query) {
        let lastError;
        for (const endpoint of OVERPASS_ENDPOINTS) {
            try {
                const response = await axios.post(endpoint, query, {
                    headers: { 'Content-Type': 'text/plain' },
                    timeout: 30000
                });
                // Overpass returns HTML on error even with 200 — check for JSON
                if (typeof response.data !== 'object') {
                    throw new Error('Non-JSON response from Overpass');
                }
                return response.data;
            } catch (error) {
                console.warn(`Overpass mirror failed (${endpoint}): ${error.message}`);
                lastError = error;
            }
        }
        throw new Error(`All Overpass mirrors failed: ${lastError?.message}`);
    }

    // Mood to OSM amenity/tag mapping
    getMoodTags(mood) {
        const moodMapping = {
            'work':        [['amenity', 'cafe'], ['amenity', 'coworking_space'], ['amenity', 'library']],
            'date':        [['amenity', 'restaurant'], ['amenity', 'bar'], ['tourism', 'attraction']],
            'hangout':     [['amenity', 'cafe'], ['amenity', 'bar'], ['amenity', 'food_court']],
            'quick-bite':  [['amenity', 'fast_food'], ['amenity', 'food_court'], ['amenity', 'cafe']],
            'budget':      [['amenity', 'fast_food'], ['amenity', 'food_court'], ['amenity', 'restaurant']],
            'street-food': [['amenity', 'fast_food'], ['amenity', 'food_court'], ['shop', 'deli']],
            'chill':       [['amenity', 'cafe'], ['leisure', 'park'], ['amenity', 'spa']],
        };
        return moodMapping[mood] || [['amenity', 'restaurant']];
    }

    /**
     * Build an Overpass QL query for nearby places
     */
    buildOverpassQuery(tags, latitude, longitude, radius) {
        const unionParts = tags.map(([key, value]) =>
            `node["${key}"="${value}"](around:${radius},${latitude},${longitude});` +
            `way["${key}"="${value}"](around:${radius},${latitude},${longitude});`
        ).join('\n');

        return `[out:json][timeout:25];
(\n${unionParts}\n);
out center 20;`;
    }

    /**
     * Search places by mood using Overpass
     */
    async searchByMood(mood, latitude, longitude, radius = 5000) {
        const cacheKey = `mood_${mood}_${latitude}_${longitude}_${radius}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const tags = this.getMoodTags(mood);
        const query = this.buildOverpassQuery(tags, latitude, longitude, radius);

        try {
            const data = await this.queryOverpass(query);
            const places = this.formatPlaces(data.elements, latitude, longitude);
            cache.set(cacheKey, places);
            return places;
        } catch (error) {
            console.error('Overpass API Error:', error.message);
            throw new Error('Failed to fetch places');
        }
    }

    /**
     * Get nearby places (generic)
     */
    async getNearbyPlaces(latitude, longitude, radius = 5000, type = 'restaurant') {
        const cacheKey = `nearby_${latitude}_${longitude}_${radius}_${type}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        // Map common type names to OSM tags
        const typeToTag = {
            restaurant: ['amenity', 'restaurant'],
            cafe:       ['amenity', 'cafe'],
            bar:        ['amenity', 'bar'],
            park:       ['leisure', 'park'],
            hotel:      ['tourism', 'hotel'],
        };
        const tag = typeToTag[type] || ['amenity', type];
        const query = this.buildOverpassQuery([tag], latitude, longitude, radius);

        try {
            const data = await this.queryOverpass(query);
            const places = this.formatPlaces(data.elements, latitude, longitude);
            cache.set(cacheKey, places);
            return places;
        } catch (error) {
            console.error('Overpass API Error:', error.message);
            throw new Error('Failed to fetch nearby places');
        }
    }

    /**
     * Get place details by OSM node/way ID
     */
    async getPlaceDetails(placeId) {
        const cacheKey = `details_${placeId}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            // placeId format: "node/123456" or "way/123456"
            const [type, id] = placeId.includes('/') ? placeId.split('/') : ['node', placeId];
            const query = `[out:json][timeout:25];${type}(${id});out body;`;

            const data = await this.queryOverpass(query);
            const element = data.elements[0];
            if (!element) throw new Error('Place not found');

            const details = this.formatPlaceDetails(element);
            cache.set(cacheKey, details);
            return details;
        } catch (error) {
            console.error('Overpass API Error:', error.message);
            throw new Error('Failed to fetch place details');
        }
    }

    /**
     * Search places by text using Nominatim
     */
    async textSearch(query, latitude, longitude, radius = 5000) {
        const cacheKey = `text_${query}_${latitude}_${longitude}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(`${this.nominatimUrl}/search`, {
                params: {
                    q: query,
                    format: 'json',
                    limit: 20,
                    addressdetails: 1,
                    extratags: 1,
                    viewbox: this.buildViewbox(latitude, longitude, radius),
                    bounded: 1,
                },
                headers: { 'User-Agent': 'MoodMap/1.0 (contact@moodmap.app)' },
                timeout: 15000
            });

            const places = response.data.map(place => ({
                placeId: `nominatim/${place.place_id}`,
                name: place.display_name.split(',')[0],
                address: place.display_name,
                location: {
                    lat: parseFloat(place.lat),
                    lng: parseFloat(place.lon)
                },
                rating: 0,
                priceLevel: 0,
                types: [place.type, place.class].filter(Boolean),
                openNow: null,
                photos: []
            }));

            cache.set(cacheKey, places);
            return places;
        } catch (error) {
            console.error('Nominatim API Error:', error.message);
            throw new Error('Failed to search places');
        }
    }

    /**
     * Build a bounding box viewbox string for Nominatim
     */
    buildViewbox(lat, lng, radiusMeters) {
        const deg = radiusMeters / 111320;
        return `${lng - deg},${lat + deg},${lng + deg},${lat - deg}`;
    }

    /**
     * Calculate distance (km) between two lat/lng points
     */
    calcDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) ** 2 +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    /**
     * Format a list of OSM elements into our standard place shape
     */
    formatPlaces(elements, originLat, originLng) {
        return elements
            .filter(el => el.tags?.name) // Only named places
            .map(el => {
                const lat = el.lat ?? el.center?.lat ?? 0;
                const lng = el.lon ?? el.center?.lon ?? 0;
                const tags = el.tags || {};
                const distance = originLat && originLng
                    ? this.calcDistance(originLat, originLng, lat, lng)
                    : null;

                return {
                    placeId: `${el.type}/${el.id}`,
                    name: tags.name,
                    address: [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
                        .filter(Boolean).join(', ') || tags['addr:full'] || '',
                    location: { lat, lng },
                    rating: 0,
                    priceLevel: this.parsePriceLevel(tags.price),
                    types: [tags.amenity, tags.cuisine, tags.leisure, tags.shop, tags.tourism]
                        .filter(Boolean),
                    openNow: null,
                    photos: [],
                    phone: tags.phone || tags['contact:phone'] || null,
                    website: tags.website || tags['contact:website'] || null,
                    distance: distance ? parseFloat(distance.toFixed(2)) : null
                };
            })
            .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999)) // Nearest first
            .slice(0, 20);
    }

    /**
     * Format a single OSM element into place details
     */
    formatPlaceDetails(element) {
        const tags = element.tags || {};
        const lat = element.lat ?? element.center?.lat ?? 0;
        const lng = element.lon ?? element.center?.lon ?? 0;

        return {
            placeId: `${element.type}/${element.id}`,
            name: tags.name || 'Unknown Place',
            address: [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
                .filter(Boolean).join(', ') || tags['addr:full'] || '',
            location: { lat, lng },
            rating: 0,
            priceLevel: this.parsePriceLevel(tags.price),
            types: [tags.amenity, tags.cuisine, tags.leisure, tags.shop, tags.tourism]
                .filter(Boolean),
            phoneNumber: tags.phone || tags['contact:phone'] || null,
            website: tags.website || tags['contact:website'] || null,
            openingHours: {
                openNow: null,
                weekdayText: tags.opening_hours ? [tags.opening_hours] : []
            },
            photos: [],
            reviews: []
        };
    }

    /**
     * Parse OSM price tag into 0-4 price level
     */
    parsePriceLevel(price) {
        const map = { cheap: 1, moderate: 2, expensive: 3, 'very expensive': 4 };
        return map[price?.toLowerCase()] || 0;
    }

    /**
     * Clear cache
     */
    clearCache() {
        cache.flushAll();
    }
}

export default new PlacesService();
