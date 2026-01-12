import { Users, Clock, MapPin, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StreetFoodCardProps {
  areaName: string;
  stallCount: number;
  famousItems: string[];
  bestTime: string;
  crowdLevel: "low" | "medium" | "high";
  image: string;
}

export const StreetFoodCard = ({
  areaName,
  stallCount,
  famousItems,
  bestTime,
  crowdLevel,
  image,
}: StreetFoodCardProps) => {
  const crowdConfig = {
    low: { color: "bg-success/20 text-success", label: "Usually Empty" },
    medium: { color: "bg-warning/20 text-warning", label: "Moderate Crowd" },
    high: { color: "bg-accent/20 text-accent", label: "Usually Crowded" },
  };

  return (
    <div className="glass-card-hover overflow-hidden group">
      {/* Image with overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={areaName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        
        {/* Stall Count Badge */}
        <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-glow-accent">
          <Utensils className="w-4 h-4" />
          {stallCount}+ stalls
        </div>

        {/* Title on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-card-foreground drop-shadow-lg">
            🍜 {areaName}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Famous Items */}
        <div className="flex flex-wrap gap-1.5">
          {famousItems.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="bg-primary/10 text-primary border-0"
            >
              {item}
            </Badge>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Best: {bestTime}</span>
          </div>
          <Badge className={crowdConfig[crowdLevel].color}>
            <Users className="w-3 h-3 mr-1" />
            {crowdConfig[crowdLevel].label}
          </Badge>
        </div>

        {/* Action */}
        <Button className="w-full" variant="accent">
          <MapPin className="w-4 h-4 mr-2" />
          Explore Zone
        </Button>
      </div>
    </div>
  );
};
