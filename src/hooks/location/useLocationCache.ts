
import { useState, useEffect } from 'react';

export interface LocationCacheResult {
  cachedLatitude: number | null;
  cachedLongitude: number | null;
  isCacheValid: boolean;
  updateCache: (latitude: number, longitude: number) => void;
  clearCache: () => void;
}

export function useLocationCache(cacheValidForMs = 30 * 60 * 1000): LocationCacheResult {
  // Initialize latitude and longitude from localStorage
  const [cachedLatitude, setCachedLatitude] = useState<number | null>(() => {
    const cachedLat = localStorage.getItem('user_lat');
    return cachedLat ? parseFloat(cachedLat) : null;
  });
  
  const [cachedLongitude, setCachedLongitude] = useState<number | null>(() => {
    const cachedLng = localStorage.getItem('user_lng');
    return cachedLng ? parseFloat(cachedLng) : null;
  });
  
  // Check if the cache is valid (less than 30 minutes old by default)
  const [isCacheValid, setIsCacheValid] = useState<boolean>(() => {
    const cacheTime = localStorage.getItem('location_cache_time');
    if (cachedLatitude && cachedLongitude && cacheTime) {
      const cacheAge = Date.now() - parseInt(cacheTime, 10);
      return cacheAge < cacheValidForMs;
    }
    return false;
  });
  
  // Update cache with new coordinates
  const updateCache = (latitude: number, longitude: number) => {
    // Validate the received coordinates
    if (latitude === null || longitude === null ||
        isNaN(latitude) || isNaN(longitude)) {
      console.error('Invalid location coordinates provided to cache');
      return;
    }
    
    // Cache the location
    localStorage.setItem('user_lat', latitude.toString());
    localStorage.setItem('user_lng', longitude.toString());
    localStorage.setItem('location_cache_time', Date.now().toString());
    
    setCachedLatitude(latitude);
    setCachedLongitude(longitude);
    setIsCacheValid(true);
  };
  
  // Clear the location cache
  const clearCache = () => {
    localStorage.removeItem('user_lat');
    localStorage.removeItem('user_lng');
    localStorage.removeItem('location_cache_time');
    
    setCachedLatitude(null);
    setCachedLongitude(null);
    setIsCacheValid(false);
  };
  
  // Periodically check cache validity
  useEffect(() => {
    const checkCacheValidity = () => {
      const cacheTime = localStorage.getItem('location_cache_time');
      if (cachedLatitude && cachedLongitude && cacheTime) {
        const cacheAge = Date.now() - parseInt(cacheTime, 10);
        setIsCacheValid(cacheAge < cacheValidForMs);
      } else {
        setIsCacheValid(false);
      }
    };
    
    // Check cache validity on mount
    checkCacheValidity();
    
    // Set up interval to periodically check cache validity
    const intervalId = setInterval(checkCacheValidity, 60000); // Check every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, [cacheValidForMs]);
  
  return {
    cachedLatitude,
    cachedLongitude,
    isCacheValid,
    updateCache,
    clearCache
  };
}
