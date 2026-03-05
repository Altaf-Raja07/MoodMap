import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Flame, Clock, Users, RefreshCw, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StreetFoodCard } from "@/components/StreetFoodCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import placesService, { Place } from "@/services/placesService";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
  "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
];

const FAMOUS_ITEMS_BY_TYPE: Record<string, string[]> = {
  fast_food: ["Burgers", "Fries", "Wraps"],
  restaurant: ["Local Specials", "Rice Dishes", "Curries"],
  cafe: ["Chai", "Snacks", "Sandwiches"],
  bakery: ["Bread", "Pastries", "Sweets"],
  street_food: ["Chaat", "Pav Bhaji", "Vada Pav"],
  default: ["Local Dishes", "Street Snacks", "Beverages"],
};

const CROWD_LEVELS: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];

const mapToStreetFoodCard = (place: Place, index: number) => {
  const primaryType = place.types?.[0]?.toLowerCase().replace(/ /g, "_") || "default";
  const famousItems =
    FAMOUS_ITEMS_BY_TYPE[primaryType] || FAMOUS_ITEMS_BY_TYPE.default;

  const crowdLevel = CROWD_LEVELS[index % 3];
  const stallCount = 5 + (index * 7 + 3) % 36;
  const bestTimes = ["After 6 PM", "4 PM - 9 PM", "After 7 PM", "Morning & Evening", "All Day", "After 8 PM"];
  const bestTime = bestTimes[index % bestTimes.length];

  return {
    areaName: place.name,
    stallCount,
    famousItems,
    bestTime,
    crowdLevel,
    image: place.photos?.[0] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
  };
};

const StreetFood = () => {
  const [zones, setZones] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setUsingFallback(false);
        },
        () => {
          setUserLocation({ lat: 28.6139, lng: 77.209 });
          setUsingFallback(true);
        }
      );
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.209 });
      setUsingFallback(true);
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    const fetchZones = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await placesService.getStreetFood(userLocation.lat, userLocation.lng, 5000);
        setZones(data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load street food zones.");
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, [userLocation]);

  const retry = () => {
    if (userLocation) {
      setUserLocation({ ...userLocation });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
                <Flame className="w-4 h-4" />
                Street Food Discovery Mode
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Discover <span className="gradient-text-accent">Street Food Zones</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explore the best street food areas near you. We show you vendors, famous dishes, and the perfect time to visit.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Crowd Levels
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Best Timings
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Zone Discovery
                </Badge>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Zones Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {usingFallback && (
              <div className="mb-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl px-4 py-3 text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Location access was denied — showing results near <strong>New Delhi</strong> as a demo.
                  Enable location in your browser for nearby results.
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {usingFallback ? "Street Food in New Delhi" : "Street Food Near You"}
                </h2>
                <p className="text-muted-foreground">
                  {loading ? "Searching..." : `${zones.length} zones found`}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={retry} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-muted-foreground">Finding street food zones near you...</p>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-10 h-10 text-destructive mb-4" />
                <p className="text-destructive font-medium mb-2">Could not load zones</p>
                <p className="text-muted-foreground text-sm mb-4">{error}</p>
                <Button onClick={retry} variant="outline">Try Again</Button>
              </div>
            )}

            {!loading && !error && zones.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4"></div>
                <h3 className="font-semibold text-foreground mb-2">No zones found nearby</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Try expanding your search radius
                </p>
              </div>
            )}

            {!loading && !error && zones.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map((zone, index) => (
                  <motion.div
                    key={zone.placeId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StreetFoodCard {...mapToStreetFoodCard(zone, index)} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="glass-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Street Food Heatmap</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                View all street food zones on an interactive map with heatmap visualization.
              </p>
              <Button variant="accent" size="lg">
                <MapPin className="w-5 h-5 mr-2" />
                Open Map View
              </Button>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Street Food Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { emoji: "", title: "Timing Matters", description: "Most street food spots are best after 6 PM when fresh batches are made." },
                { emoji: "", title: "Carry Cash", description: "Most street vendors prefer cash. Keep small denominations handy." },
                { emoji: "", title: "Walk & Explore", description: "The best finds are often a few steps away from the main crowd." },
              ].map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 text-center"
                >
                  <span className="text-4xl mb-4 block">{tip.emoji}</span>
                  <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StreetFood;
