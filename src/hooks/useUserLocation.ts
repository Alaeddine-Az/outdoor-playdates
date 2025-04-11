
import { useState, useEffect } from 'react';
import { getUserLocation } from '@/utils/locationUtils';
import { toast } from '@/components/ui/use-toast';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

// Cache storage key
const LOCATION_CACHE_KEY = 'user_location_cache';
const LOCATION_CACHE_EXPIRY_KEY = 'user_location_cache_expiry';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export function useUserLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        // Check for cached location data
        const cachedData = localStorage.getItem(LOCATION_CACHE_KEY);
        const cacheExpiry = localStorage.getItem(LOCATION_CACHE_EXPIRY_KEY);
        
        // Use cached data if it exists and isn't expired
        if (cachedData && cacheExpiry) {
          const expiryTime = parseInt(cacheExpiry, 10);
          if (Date.now() < expiryTime) {
            const parsedData = JSON.parse(cachedData);
            setLocation({
              latitude: parsedData.latitude,
              longitude: parsedData.longitude,
              loading: false,
              error: null
            });
            console.log('Using cached location data');
            return;
          } else {
            // Clear expired cache
            localStorage.removeItem(LOCATION_CACHE_KEY);
            localStorage.removeItem(LOCATION_CACHE_EXPIRY_KEY);
          }
        }
        
        // Fetch fresh location data
        const position = await getUserLocation();
        
        // Store in state
        const newLocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null
        };
        setLocation(newLocationData);
        
        // Cache the location data
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        localStorage.setItem(LOCATION_CACHE_EXPIRY_KEY, (Date.now() + CACHE_TTL).toString());
        console.log('Cached fresh location data');
        
      } catch (error) {
        console.error('Error getting location:', error);
        
        // Enhanced error handling with specific messages
        let errorMessage = 'Failed to get location';
        
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again later.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please check your connection and try again.';
              break;
          }
        }
        
        setLocation({
          latitude: null,
          longitude: null,
          loading: false,
          error: errorMessage
        });
        
        toast({
          title: 'Location Access Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    };

    loadLocationData();
  }, []);

  // Method to manually refresh location
  const refreshLocation = async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    // Clear cache
    localStorage.removeItem(LOCATION_CACHE_KEY);
    localStorage.removeItem(LOCATION_CACHE_EXPIRY_KEY);
    
    try {
      const position = await getUserLocation();
      
      const newLocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loading: false,
        error: null
      };
      
      setLocation(newLocationData);
      
      // Update cache
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }));
      localStorage.setItem(LOCATION_CACHE_EXPIRY_KEY, (Date.now() + CACHE_TTL).toString());
      
      toast({
        title: 'Location Updated',
        description: 'Your location has been successfully refreshed.',
      });
    } catch (error) {
      console.error('Error refreshing location:', error);
      
      let errorMessage = 'Failed to refresh location';
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again later.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please check your connection and try again.';
            break;
        }
      }
      
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      toast({
        title: 'Location Refresh Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  return {
    ...location,
    refreshLocation
  };
}
