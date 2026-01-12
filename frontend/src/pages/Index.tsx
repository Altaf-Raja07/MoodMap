import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Sparkles, Clock, Heart, Navigation, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoodCard } from "@/components/MoodCard";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";

const moods = [
  { emoji: "💼", label: "Work", description: "Quiet cafés with WiFi" },
  { emoji: "❤️", label: "Date", description: "Romantic ambience" },
  { emoji: "🍔", label: "Quick Bite", description: "Fast & nearby" },
  { emoji: "💸", label: "Budget", description: "Cheap & good" },
  { emoji: "🍜", label: "Street Food", description: "Local stalls & hubs" },
  { emoji: "🎉", label: "Hangout", description: "Fun with friends" },
];

const features = [
  {
    icon: Sparkles,
    title: "Mood-Based Discovery",
    description: "Tell us how you feel, we'll find the perfect spot for you.",
  },
  {
    icon: Utensils,
    title: "Street Food Intelligence",
    description: "Discover hidden gems and famous local food zones.",
  },
  {
    icon: Clock,
    title: "Real-Time Info",
    description: "Know what's open, crowd levels, and best visiting times.",
  },
  {
    icon: Heart,
    title: "Personalized For You",
    description: "Recommendations that match your taste and preferences.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-32 left-[10%] text-5xl opacity-60"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🍜
        </motion.div>
        <motion.div
          className="absolute top-48 right-[15%] text-4xl opacity-60"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          ☕
        </motion.div>
        <motion.div
          className="absolute bottom-48 left-[20%] text-4xl opacity-60"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          🍕
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-[10%] text-5xl opacity-60"
          animate={{ y: [0, -22, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          🍔
        </motion.div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Smart Mood-Based Discovery
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Not sure where to go?{" "}
              <span className="gradient-text">Tell us your mood.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              MoodMap helps you discover nearby places, cafés, restaurants, and street food hubs based on how you feel, your budget, and your time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/explore">
                <Button variant="hero" size="xl">
                  <Navigation className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link to="/street-food">
                <Button variant="hero-outline" size="xl">
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Nearby
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mood Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <p className="text-center text-muted-foreground mb-6 text-sm font-medium">
              Quick picks based on mood
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {moods.map((mood, index) => (
                <Link key={mood.label} to={`/explore?mood=${mood.label.toLowerCase()}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex items-center gap-2 bg-card/80 backdrop-blur-xl border border-border/50 px-4 py-2.5 rounded-full cursor-pointer hover:border-primary/30 transition-all duration-300"
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="font-medium text-foreground">{mood.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2"
          >
            <div className="w-1.5 h-2.5 bg-muted-foreground/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Why MoodMap is <span className="gradient-text-accent">Different</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              We don't just show you places. We understand what you're looking for.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mood Selection Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              How are you <span className="gradient-text">feeling today?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Select your mood and we'll curate the perfect places for you.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {moods.map((mood, index) => (
              <Link key={mood.label} to={`/explore?mood=${mood.label.toLowerCase()}`}>
                <MoodCard
                  emoji={mood.emoji}
                  label={mood.label}
                  description={mood.description}
                  delay={index * 0.1}
                />
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link to="/explore">
              <Button variant="accent" size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Surprise Me
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Ready to discover your next favorite spot?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mb-8 max-w-xl mx-auto"
            >
              Join thousands of food lovers who use MoodMap to find amazing places every day.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/explore">
                <Button variant="hero" size="lg">
                  Start Exploring
                </Button>
              </Link>
              <Link to="/street-food">
                <Button variant="accent" size="lg">
                  🍜 Street Food Mode
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
