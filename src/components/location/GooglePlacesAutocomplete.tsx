
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { LoadScript, Autocomplete } from '@react-google-maps/api';

// Define libraries as a static constant outside of the component
// This prevents the warning about reloading the script unnecessarily
const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places'];

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  apiKey: string;
}

export const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Enter a location...",
  apiKey
}) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isScriptLoading, setIsScriptLoading] = useState(true);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if API key is available
  useEffect(() => {
    const keyStatus = apiKey && apiKey.trim() !== '' ? 'available' : 'missing';
    console.log(`GooglePlacesAutocomplete - API key ${keyStatus} (length: ${apiKey?.length || 0})`);
    
    if (!apiKey || apiKey.trim() === '') {
      console.error('Google Maps API key is missing or empty');
      setScriptError('Google Maps API key is missing');
      setIsScriptLoading(false);
    } else {
      console.log('Google Maps API key is available and will be used');
      setScriptError(null);
    }
  }, [apiKey]);

  // Autocomplete options focused on Canada
  const autocompleteOptions: google.maps.places.AutocompleteOptions = {
    componentRestrictions: { country: 'ca' },
    fields: ['name', 'formatted_address', 'place_id', 'geometry'],
    types: ['establishment', 'geocode']
  };

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    console.log('Google Places Autocomplete loaded successfully');
    setAutocomplete(autocompleteInstance);
    setIsScriptLoading(false);
  };

  const onError = (error: Error) => {
    console.error('Error loading Google Places:', error);
    setScriptError('Failed to load location search. Please try again.');
    setIsScriptLoading(false);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
        onPlaceSelected(place);
      }
    }
  };

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
          placeholder="Google Maps API key is required"
          disabled
        />
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      onLoad={() => console.log('Google Maps script loaded')}
      onError={onError}
    >
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
        </div>
        
        {isScriptLoading ? (
          <div className="relative">
            <Input
              value={value}
              className="pl-10"
              placeholder="Loading location search..."
              disabled
            />
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
          </div>
        ) : scriptError ? (
          <Input
            value={value}
            className="pl-10"
            placeholder={scriptError}
            disabled
          />
        ) : (
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            options={autocompleteOptions}
          >
            <Input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pl-10"
              placeholder={placeholder}
            />
          </Autocomplete>
        )}
      </div>
    </LoadScript>
  );
};
