import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, MapPin, Heart, Star, Users, Activity } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import analyticsService, { UserStats, TrendingPlace } from "@/services/analyticsService";
import authService from "@/services/authService";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [trending, setTrending] = useState<TrendingPlace[]>([]);
  const [popularMoods, setPopularMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    loadAnalytics();
  }, [navigate]);

  const loadAnalytics = async () => {
    try {
      const [statsData, trendingData, moodsData] = await Promise.all([
        analyticsService.getMyStats(),
        analyticsService.getTrendingPlaces(5),
        analyticsService.getPopularMoods(),
      ]);
      setStats(statsData);
      setTrending(trendingData);
      setPopularMoods(moodsData);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-muted-foreground">
              Track your journey and discover insights
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.totalSearches || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Searches</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.totalFavorites || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Favorites</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.totalReviews || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Reviews Written</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.accountAge || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Days Active</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preferred Moods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Your Preferred Moods
              </h2>
              <div className="space-y-3">
                {stats?.preferredMoods.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium capitalize">{item.mood}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} searches
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{
                            width: `${(item.count / (stats?.totalSearches || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trending Places */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Trending Places
              </h2>
              <div className="space-y-3">
                {trending.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{place.placeName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {place.avgRating} • {place.reviewCount} reviews
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Popular Moods Platform-Wide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6 mt-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Popular Moods on MoodMap
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {popularMoods.slice(0, 7).map((mood, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <p className="text-3xl mb-2">
                    {mood.mood === "work"
                      ? "💼"
                      : mood.mood === "date"
                      ? "❤️"
                      : mood.mood === "hangout"
                      ? "🎉"
                      : mood.mood === "quick-bite"
                      ? "🍔"
                      : mood.mood === "budget"
                      ? "💸"
                      : mood.mood === "street-food"
                      ? "🍜"
                      : "☕"}
                  </p>
                  <p className="font-medium capitalize text-sm">{mood.mood}</p>
                  <p className="text-xs text-muted-foreground">{mood.count}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
