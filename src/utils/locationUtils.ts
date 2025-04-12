
/**
 * Calculate distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Validate inputs
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    console.warn('Invalid coordinates provided to getDistanceInKm', { lat1, lon1, lat2, lon2 });
    return Infinity;
  }
  
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get the user's current location
 * @returns Promise with coordinates or error
 */
export function getUserLocation(): Promise<GeolocationPosition> {
  console.log('Getting user location with browser geolocation API');
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      console.log('Calling getCurrentPosition...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Successfully got position:', position.coords);
          resolve(position);
        }, 
        (error) => {
          console.error('Geolocation error:', error.code, error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout for better reliability
          maximumAge: 5 * 60 * 1000 // Allow cached position up to 5 minutes
        }
      );
    }
  });
}

/**
 * Get nearby playdates based on user location and maximum distance
 * @param userLat User latitude
 * @param userLon User longitude
 * @param playdates Array of playdates
 * @param maxDistance Maximum distance in kilometers
 * @returns Array of nearby playdates with distance added
 */
export function getNearbyPlaydates(
  userLat: number, 
  userLon: number, 
  playdates: any[], 
  maxDistance: number = 10
): any[] {
  console.log(`Finding playdates near [${userLat}, ${userLon}] within ${maxDistance}km`, { 
    totalPlaydates: playdates?.length 
  });
  
  if (!userLat || !userLon) {
    console.warn('Missing user coordinates for getNearbyPlaydates');
    return [];
  }
  
  if (!playdates?.length) {
    console.warn('No playdates provided to getNearbyPlaydates');
    return [];
  }

  const results = [];
  let validCoordinates = 0;
  let invalidCoordinates = 0;

  for (const playdate of playdates) {
    // Skip playdates without coordinates, but log them
    if (playdate.latitude == null || playdate.longitude == null) {
      console.warn(`❌ Skipping playdate: ${playdate.title || 'Unnamed'} - missing coordinates`, playdate);
      invalidCoordinates++;
      continue;
    }
    
    validCoordinates++;
    try {
      const distance = getDistanceInKm(userLat, userLon, playdate.latitude, playdate.longitude);
      
      // Only add playdates within the specified distance
      if (distance <= maxDistance) {
        console.log(`✅ Nearby: ${playdate.title || 'Unnamed'} is ${distance.toFixed(2)} km away`);
        results.push({ ...playdate, distance });
      } else {
        console.log(`📏 Too far: ${playdate.title || 'Unnamed'} is ${distance.toFixed(2)} km away`);
      }
    } catch (error) {
      console.error(`Error calculating distance for playdate: ${playdate.title || 'Unnamed'}`, error);
    }
  }

  console.log(`Found ${results.length} playdates within ${maxDistance}km. Valid coords: ${validCoordinates}, Invalid: ${invalidCoordinates}`);
  
  // Sort by distance (closest first)
  results.sort((a, b) => a.distance - b.distance);
  return results;
}
