import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';

interface LocationAutocompleteProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  error?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
  className = '',
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const autoCompleteRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);

  // Check for Google Maps API availability
  useEffect(() => {
    const checkApi = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsApiReady(true);
        return true;
      }
      return false;
    };

    if (checkApi()) return;

    const interval = setInterval(() => {
      if (checkApi()) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Initialize Autocomplete when API is ready
  useEffect(() => {
    if (!isApiReady || !inputRef.current) return;

    try {
      // Clear previous instance if any
      if (autoCompleteRef.current) {
        // clean up listeners if possible, though GMaps instance cleanup is tricky. 
        // Usually we just overwrite the ref.
      }

      autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
      });

      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current.getPlace();
        // Use formatted_address if available, otherwise name
        const address = place.formatted_address || place.name;
        if (address) {
          onChange(address);
        }
      });
    } catch (e) {
      console.warn("Google Maps Autocomplete failed to initialize", e);
    }
  }, [isApiReady]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    if (!window.google || !window.google.maps) {
      alert("Google Maps API is still loading. Please try again in a moment.");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {
          setIsLoadingLocation(false);
          if (status === "OK" && results[0]) {
            onChange(results[0].formatted_address);
          } else {
            console.error("Geocoder failed: " + status);
            // Fallback to coordinates if address fails
            onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
        });
      },
      (error) => {
        setIsLoadingLocation(false);
        console.error("Geolocation error:", error);
        alert("Unable to retrieve location. Please check permissions.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {label && <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>}
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full 
            bg-white/5 
            border 
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-brand-500'} 
            rounded-xl 
            px-4 py-3 
            ${icon ? 'pl-10' : 'pl-4'}
            pr-10
            text-white 
            placeholder-gray-500 
            outline-none 
            transition-all 
            duration-300
            focus:bg-white/10
            focus:shadow-[0_0_15px_rgba(45,212,191,0.1)]
          `}
          placeholder={placeholder}
        />
        
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-400 transition-colors pointer-events-none">
            {icon}
          </div>
        )}

        {/* Right Icon (Current Location Button) */}
        <button 
          type="button"
          onClick={handleCurrentLocation}
          disabled={isLoadingLocation}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-200 p-1.5 rounded-lg hover:bg-white/10 transition-colors z-10"
          title="Use Current Location"
        >
          {isLoadingLocation ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Crosshair size={18} />
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
};