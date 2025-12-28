import React, { useEffect, useRef, useState } from 'react';
import { Truck } from '../types';
import { Map3D } from './Map3D';

// Declare global google types and auth handler
declare global {
  interface Window {
    google: any;
    gm_authFailure: () => void;
  }
}

interface RealTimeMapProps {
  trucks?: Truck[];
  showRoute?: boolean;
  destination?: string;
}

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export const RealTimeMap: React.FC<RealTimeMapProps> = ({ trucks = [], showRoute = false, destination }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any | null>(null);
  const directionsRendererRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapError, setIsMapError] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  // 1. Handle API Loading & Errors (Fallback Logic)
  useEffect(() => {
    // Define the auth failure handler globally
    window.gm_authFailure = () => {
      console.error("Google Maps Authentication Failed. Switching to fallback.");
      setIsMapError(true);
    };

    // Check if API loads within 2 seconds, otherwise fallback might be needed
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps) {
        setIsApiLoaded(true);
        clearInterval(checkInterval);
      }
    }, 500);

    // Timeout safety net
    const timeout = setTimeout(() => {
      if (!window.google) {
        console.warn("Google Maps API failed to load in time.");
        setIsMapError(true);
      }
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
      // Clean up global handler
      window.gm_authFailure = () => {};
    };
  }, []);

  // 2. Initialize Map
  useEffect(() => {
    if (!isApiLoaded || isMapError || !mapRef.current) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 77.5946 }, // Default Bangalore
        zoom: 13,
        styles: DARK_MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: false,
      });

      googleMapRef.current = map;

      // Initialize Directions Renderer
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#2dd4bf", // Brand color
          strokeWeight: 5,
        }
      });
    } catch (e) {
      console.error("Map initialization error:", e);
      setIsMapError(true);
    }
  }, [isApiLoaded, isMapError]);

  // 3. User Location Tracking
  useEffect(() => {
    if (!navigator.geolocation) return;
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => console.log("Geolocation error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 4. Update User Marker
  useEffect(() => {
    if (!googleMapRef.current || !userLocation || isMapError) return;

    try {
      // Clean existing user marker if we stored it (not stored in ref here for simplicity, just re-rendering creates new one usually, 
      // but in this effect structure we should be careful. For simplicity of the fix, we assume this is fine or add a cleanup).
      // Ideally we track the user marker instance.
      
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: googleMapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#2dd4bf",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: "You are here",
      });

      return () => userMarker.setMap(null);
    } catch (e) {
      console.error("Error updating user marker", e);
    }
  }, [userLocation, isMapError]);

  // 5. Update Truck Markers
  useEffect(() => {
    if (!googleMapRef.current || isMapError) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    trucks.forEach(truck => {
      try {
        const marker = new window.google.maps.Marker({
          position: { lat: truck.location.lat, lng: truck.location.lng },
          map: googleMapRef.current,
          icon: {
            // Simple truck icon path
            path: "M17 6h-2V4c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h1c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h1c1.1 0 2-.9 2-2V9l-3-3z",
            fillColor: truck.status === 'AVAILABLE' ? '#2dd4bf' : '#fb923c',
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 1.5,
            anchor: new window.google.maps.Point(10, 10)
          },
          title: truck.plate,
        });
        markersRef.current.push(marker);
      } catch (e) {
        console.error("Error adding truck marker", e);
      }
    });
  }, [trucks, isMapError]);

  // 6. Handle Routing (Directions)
  useEffect(() => {
    if (!googleMapRef.current || !directionsRendererRef.current || isMapError) return;

    if (showRoute && userLocation && destination) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: userLocation,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result: any, status: any) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
             // FIX: Ensure result is valid
             directionsRendererRef.current?.setDirections(result);
          } else {
             console.warn(`Directions request failed: ${status}`);
          }
        }
      );
    } else {
      // FIX: Use { routes: [] } to clear map instead of null to avoid InvalidValueError
      try {
        directionsRendererRef.current?.setDirections({ routes: [] });
      } catch (e) {
        console.warn("Error clearing directions", e);
      }
    }
  }, [showRoute, userLocation, destination, isMapError]);

  // RENDER: Fallback to Map3D if Google Maps fails (API Key issue)
  if (isMapError) {
    return (
      <div className="w-full h-full relative">
        <Map3D 
          showTrucks={true} 
          showRoute={showRoute} 
          trucks={trucks} 
          interactive={true} 
        />
        {/* Optional Error Toast */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full z-50 pointer-events-none">
          Live Map Unavailable (API Key Error) - Using 3D Fallback
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Loading State */}
      {!isApiLoaded && !isMapError && (
         <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10">
            <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full"></div>
         </div>
      )}
    </div>
  );
};