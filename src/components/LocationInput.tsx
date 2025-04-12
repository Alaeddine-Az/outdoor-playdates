
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserLocation } from '@/hooks/useUserLocation';
import { toast } from '@/components/ui/use-toast';

// MapboxGeocoder types
interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    accuracy?: string;
  };
}

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
  placeholder?: string;
}

const MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9obmRvZXBhaWQiLCJhIjoiY2txNzN0aDdyMGZwMTJwbnhsYnI2NGQ4YiJ9.2XuGbuLGLzIeVA8YnLfgzQ'; // Public token for demo

export const LocationInput: React.FC<LocationInputProps> = ({ 
  value, 
  onChange, 
  onCoordinatesChange, 
  placeholder = "Enter a location..." 
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { latitude, longitude, loading: locationLoading, refreshLocation } = useUserLocation();

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

  // Fetch suggestions from Mapbox
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      // Bias towards current location if available
      const proximityParam = latitude && longitude 
        ? `&proximity=${longitude},${latitude}` 
        : '';
      
      const response = await fetch(
        `${MAPBOX_API_URL}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&types=place,address,poi${proximityParam}&limit=5`
      );
      
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      toast({
        title: "Error loading suggestions",
        description: "Please try typing a more specific location",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

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
    
    try {
      setIsLoading(true);
      // Reverse geocode to get address from coordinates
      const response = await fetch(
        `${MAPBOX_API_URL}/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&types=place,address`
      );
      
      if (!response.ok) throw new Error('Failed to fetch location name');
      
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const placeName = data.features[0].place_name;
        setInputValue(placeName);
        onChange(placeName);
        onCoordinatesChange(latitude, longitude);
      } else {
        throw new Error('No location found for your coordinates');
      }
    } catch (error) {
      console.error('Error getting current location name:', error);
      toast({
        title: "Could not get your location name",
        description: "We've got your coordinates, but couldn't find an address.",
        variant: "destructive",
      });
      
      // Use generic name with coordinates as fallback
      const genericName = `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
      setInputValue(genericName);
      onChange(genericName);
      onCoordinatesChange(latitude, longitude);
    } finally {
      setIsLoading(false);
    }
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

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-input max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Loading suggestions...</span>
            </div>
          ) : (
            <ul>
              {suggestions.map((suggestion) => (
                <li 
                  key={suggestion.id}
                  className="px-3 py-2 hover:bg-muted cursor-pointer text-sm flex items-start"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{suggestion.place_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
