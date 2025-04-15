
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UseReverseGeocodeProps {
  onSuccess: (placeName: string, latitude: number, longitude: number) => void;
}

const MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9obmRvZXBhaWQiLCJhIjoiY2txNzN0aDdyMGZwMTJwbnhsYnI2NGQ4YiJ9.2XuGbuLGLzIeVA8YnLfgzQ'; // Public token for demo

export const useReverseGeocode = ({ onSuccess }: UseReverseGeocodeProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getPlaceNameFromCoordinates = async (latitude: number, longitude: number) => {
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
        onSuccess(placeName, latitude, longitude);
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
      onSuccess(genericName, latitude, longitude);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getPlaceNameFromCoordinates
  };
};
