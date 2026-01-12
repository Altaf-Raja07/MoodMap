import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, SlidersHorizontal, X, Star, Clock, DollarSign } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MoodCard } from "@/components/MoodCard";
import { PlaceCard } from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const moods = [
  { emoji: "💼", label: "Work", description: "Quiet cafés with WiFi" },
  { emoji: "❤️", label: "Date", description: "Romantic ambience" },
  { emoji: "🍔", label: "Quick Bite", description: "Fast & nearby" },
  { emoji: "💸", label: "Budget", description: "Cheap & good" },
  { emoji: "🍜", label: "Street Food", description: "Local stalls & hubs" },
  { emoji: "☕", label: "Chill", description: "Relax & unwind" },
  { emoji: "🎲", label: "Surprise Me", description: "Random adventure" },
];

const mockPlaces = [
  {
    name: "The Cozy Corner Café",
    category: "Café",
    distance: "0.5 km",
    rating: 4.8,
    priceLevel: 2,
    isOpen: true,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    tags: ["WiFi", "Quiet", "Coffee"],
  },
  {
    name: "Spice Route Restaurant",
    category: "Restaurant",
    distance: "1.2 km",
    rating: 4.5,
    priceLevel: 3,
    isOpen: true,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    tags: ["Indian", "Fine Dining"],
  },
  {
    name: "Street Bites Hub",
    category: "Street Food",
    distance: "0.3 km",
    rating: 4.6,
    priceLevel: 1,
    isOpen: true,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    tags: ["Fast Food", "Local"],
  },
  {
    name: "The Reading Room",
    category: "Café & Library",
    distance: "0.8 km",
    rating: 4.7,
    priceLevel: 2,
    isOpen: false,
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400",
    tags: ["Books", "Quiet", "Tea"],
  },
  {
    name: "Rooftop Garden Bistro",
    category: "Restaurant",
    distance: "1.5 km",
    rating: 4.9,
    priceLevel: 3,
    isOpen: true,
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
    tags: ["Rooftop", "Date Night"],
  },
  {
    name: "Chai & Chatter",
    category: "Tea House",
    distance: "0.4 km",
    rating: 4.4,
    priceLevel: 1,
    isOpen: true,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
    tags: ["Chai", "Budget", "Snacks"],
  },
];

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialMood = searchParams.get("mood");
  const [selectedMood, setSelectedMood] = useState<string | null>(initialMood);
  const [showFilters, setShowFilters] = useState(false);
  const [distance, setDistance] = useState([5]);
  const [budget, setBudget] = useState([2]);
  const [openNow, setOpenNow] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-2"
            >
              {selectedMood ? (
                <>
                  Showing results for{" "}
                  <span className="gradient-text capitalize">{selectedMood}</span>
                </>
              ) : (
                <>
                  Hi there! 👋{" "}
                  <span className="gradient-text">How are you feeling?</span>
                </>
              )}
            </motion.h1>
            <p className="text-muted-foreground">
              {selectedMood
                ? "Here are the best places that match your mood."
                : "Select your mood to get personalized recommendations."}
            </p>
          </div>

          {/* Mood Selection */}
          {!selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {moods.map((mood, index) => (
                  <MoodCard
                    key={mood.label}
                    emoji={mood.emoji}
                    label={mood.label}
                    description={mood.description}
                    delay={index * 0.05}
                    onClick={() => setSelectedMood(mood.label.toLowerCase())}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Selected Mood Badge + Filters */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <span className="text-xl">
                  {moods.find((m) => m.label.toLowerCase() === selectedMood)?.emoji}
                </span>
                <span className="font-medium capitalize">{selectedMood}</span>
                <button
                  onClick={() => setSelectedMood(null)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </motion.div>
          )}

          {/* Filters Panel */}
          {showFilters && selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Distance */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Distance: {distance[0]} km
                  </Label>
                  <Slider
                    value={distance}
                    onValueChange={setDistance}
                    max={10}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Budget */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    Budget: {"₹".repeat(budget[0])}
                  </Label>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    max={3}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Open Now */}
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    Open Now Only
                  </Label>
                  <Switch checked={openNow} onCheckedChange={setOpenNow} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Grid */}
          {selectedMood && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Places List */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg text-foreground">
                    {mockPlaces.length} places found
                  </h2>
                  <select className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm border-0">
                    <option>Nearest First</option>
                    <option>Best Rated</option>
                    <option>Budget Friendly</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockPlaces
                    .filter((place) => !openNow || place.isOpen)
                    .map((place, index) => (
                      <motion.div
                        key={place.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <PlaceCard {...place} />
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="glass-card h-[500px] flex items-center justify-center overflow-hidden">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Interactive Map
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Map view will be available when connected to a maps API
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
