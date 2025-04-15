
import React, { useState, useRef } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Autocomplete } from '@react-google-maps/api';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const autocompleteOptions: google.maps.places.AutocompleteOptions = {
    componentRestrictions: { country: 'ca' },
    fields: ['name', 'formatted_address', 'place_id', 'geometry'],
    types: ['establishment', 'geocode']
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
    </div>
  );
};
