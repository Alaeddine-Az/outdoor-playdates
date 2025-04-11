
import { Playdate } from '@/types/playdate';
import { getDistanceInKm } from '@/utils/locationUtils';

/**
 * Add distance information to playdates based on user location
 */
export const addDistanceToPlaydates = (
  playdates: Playdate[],
  userLatitude: number | null,
  userLongitude: number | null
): Playdate[] => {
  if (!userLatitude || !userLongitude) {
    return playdates;
  }

  return playdates.map(playdate => {
    if (
      playdate.latitude !== undefined && 
      playdate.longitude !== undefined && 
      playdate.latitude !== null && 
      playdate.longitude !== null
    ) {
      const distance = getDistanceInKm(
        userLatitude,
        userLongitude,
        playdate.latitude,
        playdate.longitude
      );
      return { ...playdate, distance };
    }
    return playdate;
  });
};

/**
 * Find nearby playdates within a specified distance
 */
export const findNearbyPlaydates = (
  playdates: Playdate[],
  maxDistance: number
): Playdate[] => {
  const playdatesWithCoords = playdates.filter(
    p => p.latitude !== undefined && 
         p.longitude !== undefined && 
         p.latitude !== null && 
         p.longitude !== null &&
         p.distance !== undefined
  );
  
  if (playdatesWithCoords.length === 0) {
    console.log("No playdates found with valid coordinates");
    return [];
  }
  
  const nearby = playdatesWithCoords
    .filter(p => p.distance !== undefined && p.distance <= maxDistance)
    .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
  
  return nearby;
};
