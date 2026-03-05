import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, FolderPlus, Grid, List, Trash2, RefreshCw, AlertCircle, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import favoritesService, { Favorite } from "@/services/favoritesService";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const Favorites = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggedIn = !!authService.getUser();

  const fetchFavorites = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError(null);
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isLoggedIn]);

  const handleRemove = async (placeId: string, placeName: string) => {
    setRemovingId(placeId);
    try {
      await favoritesService.removeFavorite(placeId);
      setFavorites((prev) => prev.filter((f) => f.placeId !== placeId));
      toast({ title: `"${placeName}" removed from favorites` });
    } catch {
      toast({ title: "Could not remove favorite", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Your <span className="gradient-text">Favorites</span>
              </h1>
              <p className="text-muted-foreground">
                {isLoggedIn
                  ? `${favorites.length} saved place${favorites.length !== 1 ? "s" : ""}`
                  : "Log in to see your saved places"}
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchFavorites} disabled={loading || !isLoggedIn}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Collection
              </Button>
              <div className="flex bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Not logged in */}
          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-16 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <LogIn className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Sign in to see your favorites</h3>
              <p className="text-muted-foreground mb-6">
                Create an account or log in to save and manage your favorite spots.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/login")}>Log In</Button>
                <Button variant="outline" onClick={() => navigate("/register")}>Create Account</Button>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {isLoggedIn && loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading your favorites...</p>
            </div>
          )}

          {/* Error */}
          {isLoggedIn && !loading && error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="text-destructive font-medium mb-2">Failed to load favorites</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button onClick={fetchFavorites} variant="outline">Try Again</Button>
            </div>
          )}

          {/* Favorites list */}
          {isLoggedIn && !loading && !error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {favorites.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">No saved places yet</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Start exploring and save your favorite spots!
                  </p>
                  <Button onClick={() => navigate("/explore")}>Start Exploring</Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                      : "flex flex-col gap-3"
                  }
                >
                  {favorites.map((fav, index) => (
                    <motion.div
                      key={fav.placeId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card-hover p-5 flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{fav.placeName}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Saved on {formatDate(fav.savedAt)}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate opacity-50">
                          {fav.placeId}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(fav.placeId, fav.placeName)}
                        disabled={removingId === fav.placeId}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1"
                        title="Remove from favorites"
                      >
                        {removingId === fav.placeId ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
