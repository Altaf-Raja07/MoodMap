import { motion } from "framer-motion";
import { Heart, FolderPlus, Grid, List } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlaceCard } from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const savedPlaces = [
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
    name: "Rooftop Garden Bistro",
    category: "Restaurant",
    distance: "1.5 km",
    rating: 4.9,
    priceLevel: 3,
    isOpen: true,
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
    tags: ["Rooftop", "Date Night"],
  },
];

const collections = [
  { name: "Date Spots", count: 5, emoji: "❤️" },
  { name: "Work Cafés", count: 3, emoji: "💼" },
  { name: "Street Food Favorites", count: 8, emoji: "🍜" },
];

const Favorites = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Your <span className="gradient-text">Favorites</span>
              </h1>
              <p className="text-muted-foreground">
                {savedPlaces.length} saved places across {collections.length} collections
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Collection
              </Button>
              <div className="flex bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Collections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card-hover p-5 cursor-pointer flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-3xl">
                    {collection.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {collection.count} places
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Saved Places */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">All Saved</h2>
            {savedPlaces.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "flex flex-col gap-4"
                }
              >
                {savedPlaces.map((place, index) => (
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
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No saved places yet</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Start exploring and save your favorite spots!
                </p>
                <Button variant="default">Start Exploring</Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
