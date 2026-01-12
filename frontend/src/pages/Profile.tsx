import { motion } from "framer-motion";
import { User, Settings, MapPin, Heart, TrendingUp, Edit2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const userStats = [
  { label: "Places Visited", value: 24, icon: MapPin },
  { label: "Favorites Saved", value: 12, icon: Heart },
  { label: "Moods Explored", value: 5, icon: TrendingUp },
];

const preferences = [
  { label: "Diet Preference", value: "Vegetarian" },
  { label: "Budget Range", value: "₹ - ₹₹" },
  { label: "Street Food Lover", value: "Yes" },
  { label: "Preferred Cuisine", value: "Indian, Continental" },
];

const recentMoods = [
  { emoji: "💼", label: "Work", count: 8 },
  { emoji: "🍜", label: "Street Food", count: 6 },
  { emoji: "☕", label: "Chill", count: 5 },
];

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl text-primary-foreground">
                  <User className="w-12 h-12" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-secondary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">John Doe</h1>
                <p className="text-muted-foreground mb-3">john.doe@email.com</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge variant="secondary">🍽️ Food Explorer</Badge>
                  <Badge variant="secondary">📍 Local Guide</Badge>
                  <Badge className="bg-accent/20 text-accent border-0">⭐ Premium Member</Badge>
                </div>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Your Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {userStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-5 text-center"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Most Used Moods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Your Favorite Moods
                </h2>
                <div className="glass-card p-6">
                  <div className="space-y-4">
                    {recentMoods.map((mood, index) => (
                      <div key={mood.label} className="flex items-center gap-4">
                        <span className="text-3xl">{mood.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-foreground">
                              {mood.label}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {mood.count} times
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(mood.count / 10) * 100}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
              <div className="glass-card p-6">
                <div className="space-y-4">
                  {preferences.map((pref) => (
                    <div
                      key={pref.label}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-muted-foreground">{pref.label}</span>
                      <span className="font-medium text-foreground">{pref.value}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Preferences
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
