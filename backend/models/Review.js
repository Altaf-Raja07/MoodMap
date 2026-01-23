// ============================================
// REVIEW MODEL - User reviews for places
// ============================================
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    placeId: {
        type: String,
        required: [true, 'Place ID is required']
    },
    placeName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    review: {
        type: String,
        maxlength: [500, 'Review cannot be more than 500 characters']
    },
    mood: {
        type: String,
        enum: ['work', 'date', 'hangout', 'quick-bite', 'budget', 'street-food', 'chill']
    },
    photos: [{
        type: String // URLs to user-uploaded photos
    }],
    helpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reported: {
        type: Boolean,
        default: false
    },
    isVerifiedVisit: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create indexes
reviewSchema.index({ placeId: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });

// Prevent duplicate reviews from same user for same place
reviewSchema.index({ user: 1, placeId: 1 }, { unique: true });

// Static method to get average rating for a place
reviewSchema.statics.getAverageRating = async function(placeId) {
    const result = await this.aggregate([
        { $match: { placeId } },
        {
            $group: {
                _id: '$placeId',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);
    
    return result[0] || { averageRating: 0, totalReviews: 0 };
};

export default mongoose.model('Review', reviewSchema);
