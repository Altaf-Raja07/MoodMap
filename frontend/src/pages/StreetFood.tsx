import { motion } from "framer-motion";
import { MapPin, Flame, Clock, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StreetFoodCard } from "@/components/StreetFoodCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const streetFoodZones = [
  {
    areaName: "FC Road Street Food Lane",
    stallCount: 25,
    famousItems: ["Pav Bhaji", "Vada Pav", "Misal Pav"],
    bestTime: "After 6 PM",
    crowdLevel: "high" as const,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600",
  },
  {
    areaName: "Camp Chaat Corner",
    stallCount: 15,
    famousItems: ["Bhel Puri", "Pani Puri", "Sev Puri"],
    bestTime: "4 PM - 9 PM",
    crowdLevel: "medium" as const,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600",
  },
  {
    areaName: "JM Road Food Street",
    stallCount: 30,
    famousItems: ["Kebabs", "Rolls", "Biryani"],
    bestTime: "After 7 PM",
    crowdLevel: "high" as const,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
  },
  {
    areaName: "Station Road Snacks",
    stallCount: 12,
    famousItems: ["Samosa", "Kachori", "Jalebi"],
    bestTime: "Morning & Evening",
    crowdLevel: "low" as const,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600",
  },
  {
    areaName: "University Road Eateries",
    stallCount: 20,
    famousItems: ["Frankie", "Burgers", "Momos"],
    bestTime: "All Day",
    crowdLevel: "medium" as const,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600",
  },
  {
    areaName: "Market Yard Night Bazaar",
    stallCount: 40,
    famousItems: ["Everything!", "Local Specials", "Sweet Treats"],
    bestTime: "After 8 PM",
    crowdLevel: "high" as const,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
  },
];

const StreetFood = () => {
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
                Explore the best street food areas, not just individual stalls. We show you entire zones with multiple vendors, famous dishes, and the perfect time to visit.
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Popular Street Food Zones
                </h2>
                <p className="text-muted-foreground">
                  {streetFoodZones.length} zones near you
                </p>
              </div>
              <select className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm border-0">
                <option>All Zones</option>
                <option>Open Now</option>
                <option>Least Crowded</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {streetFoodZones.map((zone, index) => (
                <motion.div
                  key={zone.areaName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StreetFoodCard {...zone} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="glass-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Street Food Heatmap
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                View all street food zones on an interactive map with heatmap visualization showing popular areas.
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
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Street Food Tips 🍜
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  emoji: "⏰",
                  title: "Timing Matters",
                  description: "Most street food spots are best after 6 PM when fresh batches are made.",
                },
                {
                  emoji: "💰",
                  title: "Carry Cash",
                  description: "Most street vendors prefer cash. Keep small denominations handy.",
                },
                {
                  emoji: "🚶",
                  title: "Walk & Explore",
                  description: "The best finds are often a few steps away from the main crowd.",
                },
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
