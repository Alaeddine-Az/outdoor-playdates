
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { LoadScript, Autocomplete } from '@react-google-maps/api';

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Autocomplete options focused on Canada
  const autocompleteOptions: google.maps.places.AutocompleteOptions = {
    componentRestrictions: { country: 'ca' },
    fields: ['name', 'formatted_address', 'place_id', 'geometry'],
    types: ['establishment', 'geocode']
  };

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
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

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={['places']}
    >
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
        </div>
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
      </div>
    </LoadScript>
  );
};
