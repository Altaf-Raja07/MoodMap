import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, SlidersHorizontal, X, Clock, DollarSign, RefreshCw, AlertCircle, Map, Navigation, LocateFixed } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MoodCard } from "@/components/MoodCard";
import { PlaceCard } from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import placesService, { Place } from "@/services/placesService";
import favoritesService from "@/services/favoritesService";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { MapView } from "@/components/MapView";

const moods = [
  { emoji: "💼", label: "Work",        api: "work",        description: "Quiet cafes with WiFi" },
  { emoji: "🌹", label: "Date",        api: "date",        description: "Romantic ambience" },
  { emoji: "🍔", label: "Quick Bite",  api: "quick-bite",  description: "Fast & nearby" },
  { emoji: "💰", label: "Budget",      api: "budget",      description: "Cheap & good" },
  { emoji: "🍜", label: "Street Food", api: "street-food", description: "Local stalls & hubs" },
  { emoji: "☕", label: "Chill",       api: "chill",       description: "Relax & unwind" },
  { emoji: "🎉", label: "Hangout",     api: "hangout",     description: "Fun with friends" },
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
  "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
];

// Shown when user declines location — purely illustrative
const FAKE_PLACES: Record<string, Place[]> = {
  default: [
    { placeId: "fake-1", name: "The Cozy Corner Café", address: "12, Park Street", rating: 4.5, priceLevel: 2, photos: [FALLBACK_IMAGES[0]], types: ["cafe"], location: { lat: 0, lng: 0 } },
    { placeId: "fake-2", name: "Spice Garden Restaurant", address: "45, MG Road", rating: 4.2, priceLevel: 2, photos: [FALLBACK_IMAGES[1]], types: ["restaurant"], location: { lat: 0, lng: 0 } },
    { placeId: "fake-3", name: "Bites & Brews", address: "7, Cafe Lane", rating: 4.7, priceLevel: 1, photos: [FALLBACK_IMAGES[2]], types: ["fast_food"], location: { lat: 0, lng: 0 } },
    { placeId: "fake-4", name: "Urban Dhaba", address: "88, Street Food Bazaar", rating: 4.3, priceLevel: 1, photos: [FALLBACK_IMAGES[3]], types: ["restaurant"], location: { lat: 0, lng: 0 } },
    { placeId: "fake-5", name: "Sunset Lounge", address: "3, Hilltop Road", rating: 4.6, priceLevel: 3, photos: [FALLBACK_IMAGES[4]], types: ["bar"], location: { lat: 0, lng: 0 } },
    { placeId: "fake-6", name: "The Noodle House", address: "22, Food Court Plaza", rating: 4.1, priceLevel: 1, photos: [FALLBACK_IMAGES[5]], types: ["fast_food"], location: { lat: 0, lng: 0 } },
  ],
};

const mapToCardProps = (place: Place, index: number) => ({
  name: place.name,
  category: place.types?.[0]
    ? place.types[0].replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Restaurant",
  distance: (place as any).distance
    ? `${(place as any).distance} km`
    : place.address
    ? place.address.split(",").pop()?.trim() || ""
    : "",
  rating: place.rating || 0,
  priceLevel: place.priceLevel || 1,
  isOpen: (place as any).openNow ?? true,
  image: place.photos?.[0] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
  tags: place.types?.slice(0, 3).map((t) => t.replace(/_/g, " ")) || [],
  placeId: place.placeId,
});

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialMood = searchParams.get("mood");
  const [selectedMood, setSelectedMood] = useState<string | null>(initialMood);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [distance, setDistance] = useState([5]);
  const [budget, setBudget] = useState([2]);
  const [openNow, setOpenNow] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "blocked">("idle");
  const [locationErrMsg, setLocationErrMsg] = useState("");
  const { toast } = useToast();
  const isLoggedIn = !!authService.getUser();

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationErrMsg("Your browser does not support location. Showing sample places.");
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("requesting");
    setLocationErrMsg("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("granted");
      },
      (err) => {
        if (err.code === 1) {
          // PERMISSION_DENIED — browser blocked it (may have remembered a previous deny)
          setLocationStatus("blocked");
          setLocationErrMsg("");
        } else {
          // TIMEOUT or POSITION_UNAVAILABLE — failed to get fix, just use sample
          setLocationErrMsg("Could not determine your location. Showing sample places.");
          setLocationStatus("denied");
        }
      },
      // No enableHighAccuracy — uses WiFi/IP which is instant. Timeout 30s.
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 60000 }
    );
  }, []);

  const useDefaultLocation = useCallback(() => {
    setLocationStatus("denied");
    // Do NOT set userLocation — fake places will be used instead
  }, []);

  const fetchPlaces = useCallback(async () => {
    // Only hit the real API when we have the user's actual GPS location
    if (!selectedMood || !userLocation || locationStatus !== "granted") return;
    setLoading(true);
    setError(null);
    try {
      const radiusMeters = distance[0] * 1000;
      const data = await placesService.searchByMood(
        selectedMood,
        `${userLocation.lat},${userLocation.lng}`,
        radiusMeters
      );
      const results = data || [];
      setPlaces(results.length > 0 ? results : FAKE_PLACES.default);
    } catch (err: any) {
      console.error("Places fetch error:", err);
      setPlaces(FAKE_PLACES.default);
      setError("Could not reach the server — showing sample places. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [selectedMood, userLocation, locationStatus, distance]);

  // When mood is picked and location is denied → instantly show fake places
  useEffect(() => {
    if (selectedMood && (locationStatus === "denied" || locationStatus === "blocked")) {
      setPlaces(FAKE_PLACES.default);
    }
  }, [selectedMood, locationStatus]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleSaveFavorite = async (place: Place) => {
    if (!isLoggedIn) {
      toast({ title: "Please log in to save favorites", variant: "destructive" });
      return;
    }
    try {
      await favoritesService.addFavorite({
        placeId: place.placeId,
        placeName: place.name,
        address: place.address,
        rating: place.rating,
      });
      toast({ title: `"${place.name}" saved to favorites!` });
    } catch {
      toast({ title: "Could not save favorite", variant: "destructive" });
    }
  };

  const filteredPlaces = places.filter((p) => {
    if (openNow && (p as any).openNow === false) return false;
    if (budget[0] < 3 && p.priceLevel > budget[0]) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">

          {/* ── Step 1: Ask for location ────────────────────────────── */}
          {locationStatus === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="glass-card p-10 max-w-md w-full">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <LocateFixed className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Find Places Near You</h2>
                <p className="text-muted-foreground mb-8">
                  MoodMap uses your location to show cafés, restaurants, and hangout spots nearby.
                  Your location is never stored or shared.
                </p>
                <Button className="w-full mb-3" size="lg" onClick={requestLocation}>
                  <Navigation className="w-4 h-4 mr-2" />
                  Share My Location
                </Button>
                <Button variant="ghost" className="w-full text-muted-foreground" size="sm" onClick={useDefaultLocation}>
                  Skip — show sample places instead
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Waiting for browser prompt ─────────────────── */}
          {locationStatus === "requesting" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="glass-card p-10 max-w-sm w-full">
                <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Detecting Your Location…</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Allow location access when your browser asks.
                </p>
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={useDefaultLocation}>
                  Skip — show sample places instead
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Location resolved — show mood picker + places ─ */}
          {(locationStatus === "granted" || locationStatus === "denied" || locationStatus === "blocked") && (
            <>
              {/* Banner: location was blocked by browser settings */}
              {locationStatus === "blocked" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-4"
                >
                  <p className="font-semibold text-foreground mb-1">📍 Location Blocked</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your browser blocked location access. To fix: click the <strong>🔒 lock icon</strong> in the
                    address bar → set <strong>Location</strong> to <strong>Allow</strong> → reload and try again.
                  </p>
                  <span className="text-sm text-amber-600 dark:text-amber-400">
                    Showing <strong>sample places</strong> for now.{" "}
                    <button className="underline" onClick={() => { setLocationStatus("idle"); setPlaces([]); setSelectedMood(null); }}>
                      Try again →
                    </button>
                  </span>
                </motion.div>
              )}

              {/* Banner: user skipped / geolocation failed */}
              {locationStatus === "denied" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl px-5 py-4"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm flex-1">
                    {locationErrMsg || "Location not shared"} — showing <strong>sample places</strong> for preview.{" "}
                    <button
                      className="underline font-medium"
                      onClick={() => { setLocationStatus("idle"); setUserLocation(null); setPlaces([]); setSelectedMood(null); }}
                    >
                      Share location for real results →
                    </button>
                  </span>
                </motion.div>
              )}

              {/* Banner: location granted, show coords confirmation */}
              {locationStatus === "granted" && userLocation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-xl px-5 py-3"
                >
                  <LocateFixed className="w-4 h-4 shrink-0" />
                  <span className="text-sm">
                    📍 Using your real location — places shown are near you.
                  </span>
                </motion.div>
              )}

              {/* Heading */}
              <div className="mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold text-foreground mb-2"
                >
                  {selectedMood ? (
                    <>
                      Results for{" "}
                      <span className="gradient-text capitalize">
                        {moods.find((m) => m.api === selectedMood)?.label || selectedMood}
                      </span>
                    </>
                  ) : (
                    <>Hi there! <span className="gradient-text">How are you feeling?</span></>
                  )}
                </motion.h1>
                <p className="text-muted-foreground">
                  {selectedMood
                    ? locationStatus === "granted"
                      ? "Here are places near your current location."
                      : "Here are sample places for this mood."
                    : "Select your mood to get personalized recommendations."}
                </p>
              </div>

              {/* Mood picker */}
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
                        onClick={() => setSelectedMood(mood.api)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Selected mood controls */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap items-center gap-3 mb-8"
                >
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                    <span className="text-xl">{moods.find((m) => m.api === selectedMood)?.emoji}</span>
                    <span className="font-medium capitalize">
                      {moods.find((m) => m.api === selectedMood)?.label || selectedMood}
                    </span>
                    <button
                      onClick={() => { setSelectedMood(null); setPlaces([]); }}
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
                  {locationStatus === "granted" && (
                    <Button variant="outline" size="sm" onClick={fetchPlaces} disabled={loading}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Filters panel */}
              {showFilters && selectedMood && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="glass-card p-6 mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Distance: {distance[0]} km
                      </Label>
                      <Slider value={distance} onValueChange={setDistance} max={10} min={1} step={0.5} className="w-full" />
                    </div>
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-success" />
                        Budget: {"₹".repeat(budget[0])}
                      </Label>
                      <Slider value={budget} onValueChange={setBudget} max={3} min={1} step={1} className="w-full" />
                    </div>
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

              {/* Places grid + map */}
              {selectedMood && (
                <>
                  {/* Mobile map toggle */}
                  <div className="flex justify-end mb-4 lg:hidden">
                    <Button variant="outline" size="sm" onClick={() => setShowMap(v => !v)}>
                      <Map className="w-4 h-4 mr-2" />
                      {showMap ? "Hide Map" : "Show Map"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                          <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
                          <p className="text-muted-foreground">Finding places near you…</p>
                        </div>
                      )}
                      {!loading && error && (
                        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl px-4 py-3 mb-5 text-sm">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{error}</span>
                          <Button size="sm" variant="ghost" className="ml-auto" onClick={fetchPlaces}>Retry</Button>
                        </div>
                      )}
                      {!loading && (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg text-foreground">
                              {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"} found
                              {locationStatus !== "granted" && (
                                <span className="text-sm font-normal text-muted-foreground ml-2">(sample)</span>
                              )}
                            </h2>
                          </div>
                          {filteredPlaces.length === 0 ? (
                            <div className="text-center py-16">
                              <div className="text-5xl mb-4">🔍</div>
                              <h3 className="font-semibold text-foreground mb-2">No places found</h3>
                              <p className="text-muted-foreground text-sm mb-4">
                                Try increasing the distance or changing filters
                              </p>
                              <Button onClick={() => setDistance([10])} variant="outline">
                                Expand to 10 km
                              </Button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {filteredPlaces.map((place, index) => (
                                <motion.div
                                  key={place.placeId}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.07 }}
                                >
                                  <PlaceCard
                                    {...mapToCardProps(place, index)}
                                    onSave={() => handleSaveFavorite(place)}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className={`lg:col-span-1 ${showMap ? "block" : "hidden"} lg:block`}>
                      <div className="sticky top-24">
                        <div className="glass-card overflow-hidden h-64 lg:h-[500px]">
                          {userLocation ? (
                            <MapView
                              places={filteredPlaces}
                              userLocation={userLocation}
                              className="h-full w-full"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <div className="text-center p-6">
                                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                                <p className="text-muted-foreground text-sm">Map unavailable without location</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
