import { Star, MapPin, Clock, Heart, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface PlaceCardProps {
  name: string;
  address: string;
  rating?: number;
  priceLevel?: number;
  image?: string;
  types?: string[];
  openNow?: boolean;
  delay?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  placeId?: string;
}

export const PlaceCardEnhanced = ({
  name,
  address,
  rating = 0,
  priceLevel = 0,
  image,
  types = [],
  openNow,
  delay = 0,
  isFavorite = false,
  onToggleFavorite,
  placeId,
}: PlaceCardProps) => {
  const navigate = useNavigate();
  const priceIndicator = "₹".repeat(priceLevel || 1);

  const handleViewReviews = () => {
    if (placeId) {
      navigate(`/place/${placeId}/reviews`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card-hover overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Status Badge */}
        {openNow !== undefined && (
          <Badge
            className={`absolute top-3 left-3 ${
              openNow
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {openNow ? "Open Now" : "Closed"}
          </Badge>
        )}

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full transition-all ${
            isFavorite 
              ? "bg-red-500/90 text-white opacity-100" 
              : "bg-white/80 text-gray-700 opacity-0 group-hover:opacity-100"
          }`}
          onClick={onToggleFavorite}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
        
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {address}
          </p>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
            {priceLevel > 0 && (
              <span className="text-green-600 dark:text-green-400 font-medium">
                {priceIndicator}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {types.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {types.slice(0, 3).map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleViewReviews}
            className="flex-1"
            variant="default"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Reviews
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceCardEnhanced;
