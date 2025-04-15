
import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from 'lucide-react';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (
    place: google.maps.places.PlaceResult & { 
      geometry: { location: { lat: () => number; lng: () => number; }; }; 
    }
  ) => void;
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
  const [isScriptLoaded, setIsScriptLoaded] = React.useState(false);
  const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

  // Autocomplete options focused on Canada
  const autocompleteOptions: google.maps.places.AutocompleteOptions = {
    componentRestrictions: { country: 'ca' },
    fields: ['name', 'formatted_address', 'place_id', 'geometry'],
    types: ['establishment', 'geocode']
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
    setIsScriptLoaded(true);
  };

  const onPlaceChange = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
      if (place.geometry?.location) {
        onPlaceSelected(place as any);
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
        </div>
        
        {!isScriptLoaded ? (
          <>
            <Input
              value={value}
              className="pl-10 pr-10"
              placeholder={placeholder}
              disabled
            />
            <Loader2 className="absolute right-3 h-4 w-4 animate-spin" />
          </>
        ) : (
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChange}
            options={autocompleteOptions}
          >
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pl-10"
              placeholder={placeholder}
            />
          </Autocomplete>
        )}
      </div>
    </div>
  );
};
