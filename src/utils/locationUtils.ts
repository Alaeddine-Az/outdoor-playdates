
/**
 * Calculate distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Validate inputs - fail early with descriptive errors
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    console.warn('Invalid coordinates provided to getDistanceInKm', { lat1, lon1, lat2, lon2 });
    return Infinity;
  }
  
  // Convert all inputs to numbers to ensure correct calculations
  const lat1Num = Number(lat1);
  const lon1Num = Number(lon1);
  const lat2Num = Number(lat2);
  const lon2Num = Number(lon2);
  
  // Check if any conversion resulted in NaN
  if (isNaN(lat1Num) || isNaN(lon1Num) || isNaN(lat2Num) || isNaN(lon2Num)) {
    console.warn('Coordinates could not be converted to numbers', { lat1, lon1, lat2, lon2 });
    return Infinity;
  }
  
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2Num - lat1Num);
  const dLon = deg2rad(lon2Num - lon1Num);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1Num)) * Math.cos(deg2rad(lat2Num)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
          timeout: 15000, // Increased timeout for better reliability
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
    // Skip playdates without coordinates
    if (playdate.latitude == null || playdate.longitude == null || 
        playdate.latitude === undefined || playdate.longitude === undefined) {
      console.warn(`❌ Skipping playdate: ${playdate.title || 'Unnamed'} - missing coordinates`, 
        { id: playdate.id, lat: playdate.latitude, lng: playdate.longitude });
      invalidCoordinates++;
      continue;
    }
    
    validCoordinates++;
    try {
      // Force conversion to number for latitude and longitude
      const latitude = Number(playdate.latitude);
      const longitude = Number(playdate.longitude);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        console.warn(`❌ Invalid coordinates for playdate: ${playdate.title || 'Unnamed'}`, 
          { id: playdate.id, lat: playdate.latitude, lng: playdate.longitude });
        invalidCoordinates++;
        continue;
      }
      
      const distance = getDistanceInKm(userLat, userLon, latitude, longitude);
      
      // Only add playdates within the specified distance
      if (distance <= maxDistance) {
        console.log(`✅ Nearby: ${playdate.title || 'Unnamed'} is ${distance.toFixed(2)} km away`);
        results.push({ ...playdate, distance });
      } else {
        console.log(`📏 Too far: ${playdate.title || 'Unnamed'} is ${distance.toFixed(2)} km away`);
      }
    } catch (error) {
      console.error(`Error calculating distance for playdate: ${playdate.title || 'Unnamed'}`, error);
      invalidCoordinates++;
    }
  }

  console.log(`Found ${results.length} playdates within ${maxDistance}km. Valid coords: ${validCoordinates}, Invalid: ${invalidCoordinates}`);
  
  // Sort by distance (closest first)
  results.sort((a, b) => a.distance - b.distance);
  return results;
}
