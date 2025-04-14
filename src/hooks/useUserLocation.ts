import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLocationCache } from './location/useLocationCache';
import { useBrowserGeolocation } from './location/useBrowserGeolocation';

export function useUserLocation() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  const { 
    cachedLatitude, 
    cachedLongitude, 
    isCacheValid, 
    updateCache, 
    clearCache 
  } = useLocationCache();
  
  const { 
    loading, 
    error, 
    fetchLocation 
  } = useBrowserGeolocation();
  
  // Use refs to prevent unnecessary re-fetches
  const fetchAttemptedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Initialize from cache
  useEffect(() => {
    if (cachedLatitude && cachedLongitude && isCacheValid) {
      setLatitude(cachedLatitude);
      setLongitude(cachedLongitude);
    }
  }, [cachedLatitude, cachedLongitude, isCacheValid]);

  const fetchLocationAndUpdateCache = useCallback(async () => {
    if (fetchAttemptedRef.current || !isMountedRef.current) return;
    
    fetchAttemptedRef.current = true;
    
    // Use cached location if it's valid
    if (isCacheValid && cachedLatitude && cachedLongitude) {
      setLatitude(cachedLatitude);
      setLongitude(cachedLongitude);
      return;
    }
    
    // Otherwise get fresh location
    const result = await fetchLocation();
    
    // Only update state if the component is still mounted
    if (!isMountedRef.current) return;
    
    if (result) {
      updateCache(result.latitude, result.longitude);
      setLatitude(result.latitude);
      setLongitude(result.longitude);
    }
  }, [fetchLocation, isCacheValid, cachedLatitude, cachedLongitude, updateCache]);

  const refreshLocation = useCallback(async () => {
    // Reset fetch attempt flag to allow refetching
    fetchAttemptedRef.current = false;
    
    // Clear cache
    clearCache();
    
    // Fetch fresh location
    const result = await fetchLocation();
    
    if (isMountedRef.current && result) {
      updateCache(result.latitude, result.longitude);
      setLatitude(result.latitude);
      setLongitude(result.longitude);
      
      toast({
        title: 'Location Updated',
        description: 'Your location has been successfully refreshed.',
      });
    }
  }, [fetchLocation, clearCache, updateCache]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Only fetch if we don't have cached data
    if (!latitude || !longitude) {
      fetchLocationAndUpdateCache();
    }
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchLocationAndUpdateCache, latitude, longitude]);

  return {
    latitude,
    longitude,
    loading,
    error,
    refreshLocation
  };
}
