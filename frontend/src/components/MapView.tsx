import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import { Place } from "@/services/placesService";

// Fix default marker icon broken by Webpack/Vite bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const placeIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Auto-fit map bounds to all markers
function FitBounds({ places, userLocation }: { places: Place[]; userLocation: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngTuple[] = [[userLocation.lat, userLocation.lng]];
    places.forEach((p) => {
      if (p.location?.lat && p.location?.lng) {
        points.push([p.location.lat, p.location.lng]);
      }
    });
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
    } else {
      map.setView([userLocation.lat, userLocation.lng], 14);
    }
  }, [places, userLocation, map]);

  return null;
}

interface MapViewProps {
  places: Place[];
  userLocation: { lat: number; lng: number };
  className?: string;
}

export const MapView = ({ places, userLocation, className = "" }: MapViewProps) => {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={14}
      className={`w-full h-full ${className}`}
      style={{ minHeight: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location — blue dot */}
      <CircleMarker
        center={[userLocation.lat, userLocation.lng]}
        radius={10}
        pathOptions={{ color: "#6366f1", fillColor: "#6366f1", fillOpacity: 0.9, weight: 2 }}
      >
        <Popup>
          <div className="text-center">
            <p className="font-semibold text-sm">📍 You are here</p>
          </div>
        </Popup>
      </CircleMarker>

      {/* Place markers */}
      {places.map((place) =>
        place.location?.lat && place.location?.lng ? (
          <Marker
            key={place.placeId}
            position={[place.location.lat, place.location.lng]}
            icon={placeIcon}
          >
            <Popup>
              <div className="min-w-[150px]">
                <p className="font-semibold text-sm mb-1">{place.name}</p>
                {place.types?.[0] && (
                  <p className="text-xs text-gray-500 capitalize mb-1">
                    {place.types[0].replace(/_/g, " ")}
                  </p>
                )}
                {(place as any).distance && (
                  <p className="text-xs text-blue-600">{(place as any).distance} km away</p>
                )}
                {place.address && (
                  <p className="text-xs text-gray-400 mt-1">{place.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ) : null
      )}

      <FitBounds places={places} userLocation={userLocation} />
    </MapContainer>
  );
};
