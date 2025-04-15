
import React from 'react';
import { GooglePlacesAutocomplete } from './GooglePlacesAutocomplete';
import { toast } from '@/components/ui/use-toast';

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

  // Make sure we have a valid API key - directly setting it this way ensures it's not undefined
  const googleMapsApiKey = apiKey || '';
  
  console.log('Google Maps API Key available:', googleMapsApiKey ? 'yes' : 'no');

  return (
    <GooglePlacesAutocomplete
      value={value}
      onChange={onChange}
      onPlaceSelected={handlePlaceSelected}
      placeholder={placeholder}
      apiKey={googleMapsApiKey}
    />
  );
};
