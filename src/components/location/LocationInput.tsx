
import React, { useState } from 'react';
import { GooglePlacesAutocomplete } from './GooglePlacesAutocomplete';
import { toast } from '@/components/ui/use-toast';
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
  placeholder?: string;
  apiKey?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({ 
  value, 
  onChange, 
  onCoordinatesChange, 
  placeholder = "Enter a location...",
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
}) => {
  const [manualMode, setManualMode] = useState<boolean>(false);
  
  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      onCoordinatesChange(lat, lng);
      
      toast({
        title: "Location selected",
        description: "The location has been successfully set.",
      });
    }
  };

  // Check if we have an API key
  const hasApiKey = apiKey && apiKey.trim() !== '';
  
  // Enable manual mode if there's no API key
  React.useEffect(() => {
    if (!hasApiKey) {
      setManualMode(true);
    }
  }, [hasApiKey]);
  
  // Log for debugging
  console.log('Google Maps API Key available:', hasApiKey ? 'yes' : 'no');
  
  // Handle manual mode toggle
  const toggleManualMode = () => {
    setManualMode(!manualMode);
    if (!manualMode) {
      // If switching to manual mode, set default coordinates for Toronto
      onCoordinatesChange(43.6532, -79.3832); // Toronto coordinates
    }
  };

  if (manualMode || !hasApiKey) {
    return (
      <div className="space-y-2">
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
          </div>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
            placeholder={placeholder}
          />
        </div>
        {hasApiKey && (
          <button 
            type="button"
            onClick={toggleManualMode}
            className="text-xs text-blue-500 hover:text-blue-700 underline"
          >
            Switch to Google Places search
          </button>
        )}
        {!hasApiKey && (
          <p className="text-xs text-muted-foreground">
            Manual entry mode (Google Maps API key not available)
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <GooglePlacesAutocomplete
        value={value}
        onChange={onChange}
        onPlaceSelected={handlePlaceSelected}
        placeholder={placeholder}
        apiKey={apiKey || ''}
      />
      <button 
        type="button"
        onClick={toggleManualMode}
        className="text-xs text-blue-500 hover:text-blue-700 underline"
      >
        Switch to manual entry
      </button>
    </div>
  );
};
