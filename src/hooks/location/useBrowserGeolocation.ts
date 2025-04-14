
import { useState, useCallback } from 'react';
import { getUserLocation } from '@/utils/locationUtils';
import { toast } from '@/components/ui/use-toast';

export interface BrowserGeolocationResult {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  fetchLocation: () => Promise<{latitude: number | null, longitude: number | null} | null>;
}

export function useBrowserGeolocation(): BrowserGeolocationResult {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get fresh location using the browser's geolocation API
      const position = await getUserLocation();
      
      // Validate the received coordinates
      if (position.coords.latitude === null || position.coords.longitude === null ||
          isNaN(position.coords.latitude) || isNaN(position.coords.longitude)) {
        throw new Error('Invalid location coordinates received from browser');
      }
      
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to get location';
      
      setError(errorMessage);
      
      toast({
        title: 'Location Access Error',
        description: 'We couldn\'t access your location. Some location features may not be available.',
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    latitude,
    longitude,
    loading,
    error,
    fetchLocation
  };
}
