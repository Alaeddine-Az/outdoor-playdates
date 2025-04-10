
/**
 * Calculate distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
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
  if (!userLat || !userLon || !playdates?.length) return [];

  const results = [];

  for (const playdate of playdates) {
    if (playdate.latitude == null || playdate.longitude == null) {
      console.warn(`❌ Skipping ${playdate.title} - missing coordinates`);
      continue;
    }

    const distance = getDistanceInKm(userLat, userLon, playdate.latitude, playdate.longitude);
    console.log(`📏 ${playdate.title}: ${distance.toFixed(2)} km`);

    if (distance <= maxDistance) {
      results.push({ ...playdate, distance });
    }
  }

  results.sort((a, b) => a.distance - b.distance);
  return results;
}
