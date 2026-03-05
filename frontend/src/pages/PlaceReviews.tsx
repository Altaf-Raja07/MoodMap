import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ThumbsUp, Flag, Edit2, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import reviewsService, { Review } from "@/services/reviewsService";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const PlaceReviews = () => {
  const { placeId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, review: "", mood: "" });
  const currentUser = authService.getUser();
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, [placeId]);

  const loadReviews = async () => {
    if (!placeId) return;
    try {
      const data = await reviewsService.getPlaceReviews(placeId);
      setReviews(data.data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!placeId) return;
    try {
      await reviewsService.createReview({
        placeId,
        placeName: "Place Name", // This should come from place details
        rating: newReview.rating,
        review: newReview.review,
        mood: newReview.mood || undefined,
      });
      toast({ title: "Review posted successfully!" });
      setShowReviewForm(false);
      setNewReview({ rating: 5, review: "", mood: "" });
      loadReviews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to post review",
        variant: "destructive",
      });
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await reviewsService.markHelpful(reviewId);
      loadReviews();
    } catch (error) {
      console.error("Error marking helpful:", error);
    }
  };

  const handleReport = async (reviewId: string) => {
    try {
      await reviewsService.reportReview(reviewId);
      toast({ title: "Review reported. Thank you for helping us maintain quality." });
    } catch (error) {
      console.error("Error reporting review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewsService.deleteReview(reviewId);
      toast({ title: "Review deleted successfully" });
      loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Reviews & Ratings</h1>
            {authService.isAuthenticated() && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                Write a Review
              </Button>
            )}
          </div>

          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 mb-6"
            >
              <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= newReview.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <Textarea
                    value={newReview.review}
                    onChange={(e) =>
                      setNewReview({ ...newReview, review: e.target.value })
                    }
                    placeholder="Share your experience..."
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {newReview.review.length}/500 characters
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSubmitReview}>Post Review</Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {review.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.user.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {currentUser?._id === review.user._id && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {review.mood && <Badge className="mb-2">{review.mood}</Badge>}
                    <p className="text-foreground mb-3">{review.review}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button
                        onClick={() => handleMarkHelpful(review._id)}
                        className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful.length})
                      </button>
                      {currentUser?._id !== review.user._id && (
                        <button
                          onClick={() => handleReport(review._id)}
                          className="flex items-center gap-1 text-muted-foreground hover:text-destructive"
                        >
                          <Flag className="w-4 h-4" />
                          Report
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {reviews.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              No reviews yet. Be the first to review this place!
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlaceReviews;
