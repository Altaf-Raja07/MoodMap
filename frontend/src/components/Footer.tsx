import { Link } from "react-router-dom";
import { MapPin, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Mood</span>
                <span className="text-foreground">Map</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Discover the perfect places based on your mood. From cozy cafés to vibrant street food lanes, we help you find your next favorite spot.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-muted-foreground hover:text-primary transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/street-food" className="text-muted-foreground hover:text-primary transition-colors">
                  Street Food
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-muted-foreground hover:text-primary transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 MoodMap. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
