
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserLocation } from '@/hooks/useUserLocation';
import { toast } from '@/components/ui/use-toast';
import { useLocationSuggestions, MapboxFeature } from '@/hooks/useLocationSuggestions';
import { LocationSuggestions } from './LocationSuggestions';
import { useReverseGeocode } from './useReverseGeocode';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
  placeholder?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({ 
  value, 
  onChange, 
  onCoordinatesChange, 
  placeholder = "Enter a location..." 
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { latitude, longitude, loading: locationLoading, refreshLocation } = useUserLocation();

  const { suggestions, isLoading: suggestionsLoading } = useLocationSuggestions({
    query: inputValue,
    latitude,
    longitude
  });

  const { isLoading: reverseGeocodingLoading, getPlaceNameFromCoordinates } = useReverseGeocode({
    onSuccess: (placeName, lat, lng) => {
      setInputValue(placeName);
      onChange(placeName);
      onCoordinatesChange(lat, lng);
    }
  });

  const isLoading = suggestionsLoading || reverseGeocodingLoading;

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    setInputValue(suggestion.place_name);
    onChange(suggestion.place_name);
    
    // Extract and pass coordinates (convert from [lng, lat] to [lat, lng])
    const [lng, lat] = suggestion.center;
    onCoordinatesChange(lat, lng);
    
    setShowSuggestions(false);
  };

  const handleCurrentLocationClick = async () => {
    if (locationLoading) return;
    
    if (!latitude || !longitude) {
      await refreshLocation();
      return;
    }
    
    getPlaceNameFromCoordinates(latitude, longitude);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
        </div>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-10"
        />
        <Button 
          type="button"
          size="icon"
          variant="ghost" 
          onClick={handleCurrentLocationClick}
          disabled={isLoading || locationLoading}
          title="Use current location"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          {isLoading || locationLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>

      <LocationSuggestions
        isLoading={suggestionsLoading}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
        showSuggestions={showSuggestions}
        suggestionsRef={suggestionsRef}
      />
    </div>
  );
};
