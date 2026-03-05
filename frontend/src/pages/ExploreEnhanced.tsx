import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MoodCard } from '@/components/MoodCard';
import { PlaceCard } from '@/components/PlaceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import placesService from '@/services/placesService';
import favoritesService from '@/services/favoritesService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, MapPin } from 'lucide-react';
import authService from '@/services/authService';
import { Place } from '@/services/placesService';

const moods = [
  { name: 'Happy', emoji: '😊', color: 'from-yellow-400 to-orange-400' },
  { name: 'Relaxed', emoji: '😌', color: 'from-blue-400 to-cyan-400' },
  { name: 'Adventurous', emoji: '🤩', color: 'from-purple-400 to-pink-400' },
  { name: 'Romantic', emoji: '😍', color: 'from-pink-400 to-rose-400' },
  { name: 'Energetic', emoji: '⚡', color: 'from-green-400 to-teal-400' },
  { name: 'Hungry', emoji: '😋', color: 'from-red-400 to-orange-400' },
];

const Explore = () => {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const isAuthenticated = authService.isAuthenticated();

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setLoading(true);

    try {
      const response = await placesService.searchByMood(mood, location || undefined);
      setPlaces(response || []);
      
      if (response && response.length > 0) {
        toast({
          title: 'Places Found!',
          description: `Found ${response.length} places matching your ${mood} mood`,
        });
      } else {
        toast({
          title: 'No places found',
          description: 'Try a different mood or location',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching places:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch places',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: 'Empty Search',
        description: 'Please enter a search query',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await placesService.searchPlaces(searchQuery, location || undefined);
      setPlaces(response || []);
      
      if (response && response.length > 0) {
        toast({
          title: 'Places Found!',
          description: `Found ${response.length} places`,
        });
      } else {
        toast({
          title: 'No places found',
          description: 'Try a different search query',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error searching places:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to search places',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetNearby = async () => {
    if (!location.trim()) {
      toast({
        title: 'Location Required',
        description: 'Please enter a location to find nearby places',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await placesService.getNearbyPlaces(location, 5000);
      setPlaces(response || []);
      
      if (response && response.length > 0) {
        toast({
          title: 'Nearby Places Found!',
          description: `Found ${response.length} places near you`,
        });
      } else {
        toast({
          title: 'No nearby places found',
          description: 'Try a different location',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching nearby places:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch nearby places',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (placeId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to add favorites',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (favorites.has(placeId)) {
        await favoritesService.removeFavorite(placeId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(placeId);
          return newSet;
        });
        toast({
          title: 'Removed from favorites',
        });
      } else {
        const place = places.find(p => p.placeId === placeId);
        if (place) {
          await favoritesService.addFavorite({
            placeId: place.placeId,
            placeName: place.name,
            address: place.address,
            rating: place.rating,
            priceLevel: place.priceLevel,
          });
          setFavorites(prev => new Set(prev).add(placeId));
          toast({
            title: 'Added to favorites',
          });
        }
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update favorites',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Explore Places
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Discover places that match your mood
          </p>

          {/* Search Section */}
          <div className="mb-12 space-y-4">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search for places, restaurants, cafes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Enter location (city, address, etc.)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>
            <Button
              onClick={handleGetNearby}
              disabled={loading}
              variant="outline"
              className="w-full md:w-auto"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Find Nearby Places
            </Button>
          </div>

          {/* Mood Selection */}
          <h2 className="text-2xl font-bold mb-6">How are you feeling?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {moods.map((mood, index) => (
              <MoodCard
                key={mood.name}
                emoji={mood.emoji}
                label={mood.name}
                description={`Find ${mood.name} places`}
                delay={index * 0.1}
                onClick={() => handleMoodSelect(mood.name)}
              />
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Finding perfect places for you...
              </span>
            </div>
          )}

          {/* Results */}
          {!loading && places.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {selectedMood ? `${selectedMood} Places` : 'Search Results'}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({places.length} found)
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place, index) => (
                  <PlaceCard
                    key={place.placeId}
                    name={place.name}
                    category={place.types?.[0] || 'restaurant'}
                    distance="Unknown"
                    rating={place.rating}
                    priceLevel={place.priceLevel}
                    image={place.photos?.[0] || '/placeholder.jpg'}
                    isOpen={place.openingHours?.openNow || false}
                    tags={place.types || []}
                    onSave={() => handleToggleFavorite(place.placeId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && places.length === 0 && selectedMood && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No places found. Try selecting a different mood or location.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
