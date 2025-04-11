
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Playdate, UsePlaydatesOptions, UsePlaydatesResult } from '@/types/playdate';
import { fetchPlaydatesData, fetchCreatorProfiles, fetchPlaydateParticipants, formatPlaydate } from '@/services/playdatesService';
import { addDistanceToPlaydates, findNearbyPlaydates } from '@/utils/playdateLocationUtils';

export type { Playdate } from '@/types/playdate';

export const usePlaydates = (options: UsePlaydatesOptions = {}): UsePlaydatesResult => {
  const { user } = useAuth();
  const [allPlaydates, setAllPlaydates] = useState<Playdate[]>([]);
  const [myPlaydates, setMyPlaydates] = useState<Playdate[]>([]);
  const [pastPlaydates, setPastPlaydates] = useState<Playdate[]>([]);
  const [nearbyPlaydates, setNearbyPlaydates] = useState<Playdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const { userLocation, maxDistance = 10 } = options;

  useEffect(() => {
    const fetchPlaydates = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch all playdate data
        const { upcomingPlaydates, pastPlaydatesData, hasLocationColumns } = await fetchPlaydatesData(user.id);
        
        const allPlaydatesData = [...upcomingPlaydates, ...pastPlaydatesData];
        const playdateIds = allPlaydatesData.map(p => p.id);
        
        // Fetch creator profiles
        const creatorIds = allPlaydatesData.map(p => p.creator_id).filter(Boolean);
        const creatorProfileMap = await fetchCreatorProfiles(creatorIds);
        
        // Fetch participant counts
        const participantCounts = await fetchPlaydateParticipants(playdateIds);
        
        // Format playdates
        const formattedUpcoming = upcomingPlaydates.map(p => 
          formatPlaydate(p, 'upcoming', creatorProfileMap, participantCounts)
        );
        
        const formattedPast = pastPlaydatesData.map(p => 
          formatPlaydate(p, 'past', creatorProfileMap, participantCounts)
        );
        
        const formattedMyPlaydates = formattedUpcoming.filter(p => p.host_id === user.id);
        
        // Calculate distance for all playdates if user location is available
        let playdatesWithDistances = [...formattedUpcoming];
        let pastPlaydatesWithDistances = [...formattedPast];
        let myPlaydatesWithDistances = [...formattedMyPlaydates];
        
        if (userLocation?.latitude && userLocation?.longitude && hasLocationColumns) {
          // Add distance to playdates
          playdatesWithDistances = addDistanceToPlaydates(
            formattedUpcoming, 
            userLocation.latitude, 
            userLocation.longitude
          );
          
          pastPlaydatesWithDistances = addDistanceToPlaydates(
            formattedPast, 
            userLocation.latitude, 
            userLocation.longitude
          );
          
          myPlaydatesWithDistances = addDistanceToPlaydates(
            formattedMyPlaydates, 
            userLocation.latitude, 
            userLocation.longitude
          );
          
          // Find nearby playdates (within maxDistance)
          const nearby = findNearbyPlaydates(playdatesWithDistances, maxDistance);
          setNearbyPlaydates(nearby);
        } else {
          setNearbyPlaydates([]);
        }

        setAllPlaydates(playdatesWithDistances);
        setMyPlaydates(myPlaydatesWithDistances);
        setPastPlaydates(pastPlaydatesWithDistances);
      } catch (err) {
        console.error('Error fetching playdates:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaydates();
  }, [user, userLocation, maxDistance]);

  return { 
    allPlaydates, 
    myPlaydates, 
    pastPlaydates, 
    nearbyPlaydates, 
    loading, 
    error 
  };
};
