
import { useState, useEffect } from 'react';
import { getUserLocation } from '@/utils/locationUtils';
import { toast } from '@/components/ui/use-toast';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export function useUserLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getUserLocation();
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setLocation({
          latitude: null,
          longitude: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to get location'
        });
        
        toast({
          title: 'Location Access Error',
          description: 'We couldn\'t access your location. Nearby playdate suggestions will not be available.',
          variant: 'destructive'
        });
      }
    };

    fetchLocation();
  }, []);

  return location;
}
