
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Autocomplete } from '@react-google-maps/api';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  apiKey: string;
  userLocation?: {
    latitude: number | null;
    longitude: number | null;
  };
  searchRadius?: number;
}

export const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Enter a location...",
  apiKey,
  userLocation,
  searchRadius = 10000, // Default 10km radius
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Define autocomplete options with regional biasing
  const getAutocompleteOptions = (): google.maps.places.AutocompleteOptions => {
    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: 'ca' },
      fields: ['name', 'formatted_address', 'place_id', 'geometry'],
      types: ['establishment', 'geocode']
    };

    // We'll set bounds in the useEffect instead of using locationBias
    return options;
  };

  const handleLoad = (instance: google.maps.places.Autocomplete) => {
    console.log('✅ Google Places Autocomplete loaded');
    setAutocomplete(instance);
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log('📍 Place selected:', place);
      if (place.formatted_address) {
        onChange(place.formatted_address);
        onPlaceSelected(place);
      }
    }
  };

  // Update autocomplete options when user location changes
  useEffect(() => {
    if (autocomplete && userLocation?.latitude && userLocation?.longitude) {
      console.log('Setting location bounds for autocomplete:', userLocation);
      
      // Create a bias bound around the user's location
      // This creates a bounding box approximately 20km in each direction (0.1 degrees ~= 11km)
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          userLocation.latitude - 0.1, 
          userLocation.longitude - 0.1
        ),
        new google.maps.LatLng(
          userLocation.latitude + 0.1, 
          userLocation.longitude + 0.1
        )
      );
      
      // Apply the bounds to the autocomplete instance
      autocomplete.setBounds(bounds);
      
      // Optionally set the search bias (if available in the Google Maps API version)
      if (google.maps.places.RankBy && 'DISTANCE' in google.maps.places.RankBy) {
        try {
          // @ts-ignore - This is valid but might not be in the type definitions
          autocomplete.setOptions({ rankBy: google.maps.places.RankBy.DISTANCE });
        } catch (e) {
          console.warn('Unable to set rankBy option:', e);
        }
      }
    }
  }, [autocomplete, userLocation]);

  if (!apiKey || apiKey.trim() === '') {
    return (
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          placeholder="Google Maps API key is missing"
          disabled
        />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
      </div>
      <Autocomplete
        onLoad={handleLoad}
        onPlaceChanged={handlePlaceChanged}
        options={getAutocompleteOptions()}
      >
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          placeholder={placeholder}
        />
      </Autocomplete>
    </div>
  );
};
