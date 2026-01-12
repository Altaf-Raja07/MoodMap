import { Star, MapPin, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlaceCardProps {
  name: string;
  category: string;
  distance: string;
  rating: number;
  priceLevel: number;
  isOpen: boolean;
  image: string;
  tags?: string[];
  onViewMap?: () => void;
  onSave?: () => void;
}

export const PlaceCard = ({
  name,
  category,
  distance,
  rating,
  priceLevel,
  isOpen,
  image,
  tags = [],
  onViewMap,
  onSave,
}: PlaceCardProps) => {
  const priceIndicator = "₹".repeat(priceLevel);

  return (
    <div className="glass-card-hover overflow-hidden group">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <Badge
          className={`absolute top-3 left-3 ${
            isOpen
              ? "bg-success/90 text-success-foreground"
              : "bg-destructive/90 text-destructive-foreground"
          }`}
        >
          <Clock className="w-3 h-3 mr-1" />
          {isOpen ? "Open" : "Closed"}
        </Badge>
        <Button
          variant="glass"
          size="icon"
          className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onSave}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
          <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-lg shrink-0">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="font-semibold text-sm">{rating}</span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{distance}</span>
          </div>
          <span className="text-success font-medium">{priceIndicator}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1" onClick={onViewMap}>
            <MapPin className="w-4 h-4 mr-1" />
            View Map
          </Button>
          <Button variant="default" size="sm" className="flex-1">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};
