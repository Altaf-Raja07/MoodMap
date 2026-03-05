import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, MapPin, Star } from 'lucide-react';
import analyticsService from '@/services/analyticsService';
import LoadingSpinner from './LoadingSpinner';

interface Recommendation {
  placeId: string;
  name: string;
  reason: string;
  mood: string;
  rating?: number;
  distance?: string;
}

export const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferredMood, setPreferredMood] = useState<string>('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      // Fetch user's preferred moods from analytics
      const stats = await analyticsService.getMyStats();
      
      // Get trending places
      const trending = await analyticsService.getTrendingPlaces();
      
      // Generate personalized recommendations based on user preferences
      const recs: Recommendation[] = [];
      
      // Example recommendations (in production, this would be more sophisticated)
      if (trending && Array.isArray(trending) && trending.length > 0) {
        trending.slice(0, 3).forEach((place: any) => {
          recs.push({
            placeId: place.placeId || place._id,
            name: place.name,
            reason: 'Trending in your area',
            mood: 'Popular',
            rating: place.averageRating || place.rating || 4.0,
            distance: place.distance || 'Unknown',
          });
        });
      }

      // Add mood-based recommendations
      const moods = ['Happy', 'Relaxed', 'Adventurous'];
      if (stats?.preferredMoods && stats.preferredMoods.length > 0) {
        setPreferredMood(stats.preferredMoods[0].mood);
      }

      setRecommendations(recs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const moodColors: Record<string, string> = {
    Happy: 'from-yellow-400 to-orange-400',
    Relaxed: 'from-blue-400 to-cyan-400',
    Adventurous: 'from-purple-400 to-pink-400',
    Romantic: 'from-pink-400 to-rose-400',
    Energetic: 'from-green-400 to-teal-400',
    Popular: 'from-indigo-400 to-purple-400',
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <LoadingSpinner text="Generating recommendations..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>
          {preferredMood 
            ? `Based on your preference for ${preferredMood} moods`
            : 'Discover places you might love'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No recommendations yet. Start exploring to get personalized suggestions!
            </p>
            <Button variant="default">
              Start Exploring
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.placeId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {rec.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{rec.distance || 'Near you'}</span>
                      {rec.rating && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{rec.rating.toFixed(1)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge 
                    className={`bg-gradient-to-r ${moodColors[rec.mood] || 'from-gray-400 to-gray-500'} text-white border-0`}
                  >
                    {rec.mood}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{rec.reason}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                The more you explore and save favorites, the better your recommendations become!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
