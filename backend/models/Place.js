// ============================================
// PLACE MODEL (Cached from Google Places API)
// ============================================
import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
    placeId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    address: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    types: [String],
    rating: Number,
    priceLevel: Number,
    photos: [String],
    openingHours: {
        openNow: Boolean,
        weekdayText: [String]
    },
    phoneNumber: String,
    website: String,
    // MoodMap specific data
    matchedMoods: [{
        type: String,
        enum: ['work', 'date', 'hangout', 'quick-bite', 'budget', 'street-food', 'chill']
    }],
    popularityScore: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create geospatial index for location-based queries
placeSchema.index({ location: '2dsphere' });
placeSchema.index({ placeId: 1 });
placeSchema.index({ matchedMoods: 1 });

export default mongoose.model('Place', placeSchema);
