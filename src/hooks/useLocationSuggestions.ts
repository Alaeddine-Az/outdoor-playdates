
import { useState, useEffect } from 'react';

// MapboxGeocoder types
export interface MapboxFeature {
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

interface UseLocationSuggestionsProps {
  query: string;
  latitude?: number | null;
  longitude?: number | null;
}

const MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9obmRvZXBhaWQiLCJhIjoiY2txNzN0aDdyMGZwMTJwbnhsYnI2NGQ4YiJ9.2XuGbuLGLzIeVA8YnLfgzQ'; // Public token for demo

export const useLocationSuggestions = ({ 
  query, 
  latitude, 
  longitude 
}: UseLocationSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
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
      } finally {
        setIsLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, latitude, longitude]);

  return {
    suggestions,
    isLoading
  };
};
