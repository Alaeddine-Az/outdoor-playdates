
import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserLocation } from '@/utils/locationUtils';
import { toast } from '@/components/ui/use-toast';

export function useUserLocation() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to prevent unnecessary re-fetches
  const fetchAttempted = useRef(false);

  const fetchLocation = useCallback(async () => {
    if (fetchAttempted.current) return;
    
    try {
      setLoading(true);
      setError(null);
      fetchAttempted.current = true;
      
      // Check for cached location
      const cachedLat = localStorage.getItem('user_lat');
      const cachedLng = localStorage.getItem('user_lng');
      const cacheTime = localStorage.getItem('location_cache_time');
      
      // Use cached location if it's less than 30 minutes old
      const cacheValidForMs = 30 * 60 * 1000; // 30 minutes
      if (cachedLat && cachedLng && cacheTime) {
        const cacheAge = Date.now() - parseInt(cacheTime, 10);
        if (cacheAge < cacheValidForMs) {
          console.log('Using cached location data:', { cachedLat, cachedLng });
          setLatitude(parseFloat(cachedLat));
          setLongitude(parseFloat(cachedLng));
          setLoading(false);
          return;
        } else {
          console.log('Cached location expired, fetching fresh data');
        }
      }
      
      // Get fresh location
      console.log('Requesting fresh location from browser');
      const position = await getUserLocation();
      console.log('Received location from browser:', {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      
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
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to get location';
      
      setError(errorMessage);
      setLoading(false);
      
      toast({
        title: 'Location Access Error',
        description: 'We couldn\'t access your location. Nearby playdate suggestions will not be available.',
        variant: 'destructive'
      });
      
      // Attempt to get approximate location from IP if available
      try {
        if (navigator.geolocation === undefined) {
          // Only try IP geolocation if browser geolocation is not available
          console.log("Browser geolocation not available, would try IP geolocation in production");
        }
      } catch (ipError) {
        console.error('Fallback IP geolocation also failed:', ipError);
      }
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    // Reset fetch attempt flag to allow refetching
    fetchAttempted.current = false;
    
    // Clear cache
    localStorage.removeItem('user_lat');
    localStorage.removeItem('user_lng');
    localStorage.removeItem('location_cache_time');
    
    // Fetch fresh location
    await fetchLocation();
    
    toast({
      title: 'Location Refreshed',
      description: error 
        ? 'We couldn\'t refresh your location. Please check your location settings.' 
        : 'Your location has been successfully updated.',
      variant: error ? 'destructive' : 'default'
    });
  }, [error, fetchLocation]);

  useEffect(() => {
    fetchLocation();
    // We intentionally don't include fetchLocation in the dependency array
    // to prevent an infinite loop, since it's wrapped in useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    latitude,
    longitude,
    loading,
    error,
    refreshLocation
  };
}
