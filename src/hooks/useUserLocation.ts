
import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserLocation } from '@/utils/locationUtils';
import { toast } from '@/components/ui/use-toast';

export function useUserLocation() {
  const [latitude, setLatitude] = useState<number | null>(() => {
    const cachedLat = localStorage.getItem('user_lat');
    return cachedLat ? parseFloat(cachedLat) : null;
  });
  
  const [longitude, setLongitude] = useState<number | null>(() => {
    const cachedLng = localStorage.getItem('user_lng');
    return cachedLng ? parseFloat(cachedLng) : null;
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to prevent unnecessary re-fetches
  const fetchAttemptedRef = useRef(false);
  const isMountedRef = useRef(true);

  const fetchLocation = useCallback(async () => {
    if (fetchAttemptedRef.current || !isMountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      fetchAttemptedRef.current = true;
      
      // Check for cached location
      const cachedLat = localStorage.getItem('user_lat');
      const cachedLng = localStorage.getItem('user_lng');
      const cacheTime = localStorage.getItem('location_cache_time');
      
      // Use cached location if it's less than 30 minutes old
      const cacheValidForMs = 30 * 60 * 1000; // 30 minutes
      if (cachedLat && cachedLng && cacheTime) {
        const cacheAge = Date.now() - parseInt(cacheTime, 10);
        if (cacheAge < cacheValidForMs) {
          setLatitude(parseFloat(cachedLat));
          setLongitude(parseFloat(cachedLng));
          setLoading(false);
          return;
        }
      }
      
      // Get fresh location
      const position = await getUserLocation();
      
      // Only update state if the component is still mounted
      if (!isMountedRef.current) return;
      
      // Validate the received coordinates
      if (position.coords.latitude === null || position.coords.longitude === null ||
          isNaN(position.coords.latitude) || isNaN(position.coords.longitude)) {
        throw new Error('Invalid location coordinates received from browser');
      }
      
      // Cache the location
      localStorage.setItem('user_lat', position.coords.latitude.toString());
      localStorage.setItem('user_lng', position.coords.longitude.toString());
      localStorage.setItem('location_cache_time', Date.now().toString());
      
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    } catch (error) {
      if (!isMountedRef.current) return;
      
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
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    // Reset fetch attempt flag to allow refetching
    fetchAttemptedRef.current = false;
    
    // Clear cache
    localStorage.removeItem('user_lat');
    localStorage.removeItem('user_lng');
    localStorage.removeItem('location_cache_time');
    
    // Fetch fresh location
    await fetchLocation();
    
    if (isMountedRef.current && !error) {
      toast({
        title: 'Location Updated',
        description: 'Your location has been successfully refreshed.',
      });
    }
  }, [error, fetchLocation]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Only fetch if we don't have cached data
    if (!latitude || !longitude) {
      fetchLocation();
    }
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchLocation, latitude, longitude]);

  return {
    latitude,
    longitude,
    loading,
    error,
    refreshLocation
  };
}
