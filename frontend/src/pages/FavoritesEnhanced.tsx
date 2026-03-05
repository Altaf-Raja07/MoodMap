import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import favoritesService from '@/services/favoritesService';
import authService from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Star, MapPin, ExternalLink } from 'lucide-react';
import PlaceCardEnhanced from '@/components/PlaceCardEnhanced';
import { Favorite } from '@/services/favoritesService';

interface ExtendedFavorite extends Favorite {
  _id: string;
  name?: string;
  address?: string;
  rating?: number;
  priceLevel?: number;
  photoUrl?: string;
  types?: string[];
  createdAt?: string;
}

const FavoritesEnhanced = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<ExtendedFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchFavorites();
  }, [navigate]);

  const fetchFavorites = async () => {
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data as ExtendedFavorite[] || []);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch favorites',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (placeId: string) => {
    try {
      await favoritesService.removeFavorite(placeId);
      setFavorites(favorites.filter(fav => fav.placeId !== placeId));
      toast({
        title: 'Removed from favorites',
      });
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove favorite',
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
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your saved places and favorite spots
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Loading your favorites...
              </span>
            </div>
          ) : favorites.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <div className="mb-4">
                  <Star className="h-16 w-16 mx-auto text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Start exploring and save your favorite places
                </p>
                <Button onClick={() => navigate('/explore')}>
                  Explore Places
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                {favorites.length} {favorites.length === 1 ? 'place' : 'places'} saved
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite, index) => (
                  <PlaceCardEnhanced
                    key={favorite._id}
                    name={favorite.name}
                    address={favorite.address}
                    rating={favorite.rating}
                    priceLevel={favorite.priceLevel}
                    image={favorite.photoUrl}
                    types={favorite.types}
                    delay={index * 0.1}
                    isFavorite={true}
                    onToggleFavorite={() => handleRemoveFavorite(favorite.placeId)}
                    placeId={favorite.placeId}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default FavoritesEnhanced;
