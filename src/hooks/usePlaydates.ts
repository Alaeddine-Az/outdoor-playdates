
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { getNearbyPlaydates, getDistanceInKm } from '@/utils/locationUtils';

export interface Playdate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  families: number;
  status?: string;
  host?: string;
  host_id?: string;
  attendees?: number;
  start_time?: string;
  end_time?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

interface UsePlaydatesOptions {
  userLocation?: {
    latitude: number | null;
    longitude: number | null;
    loading?: boolean;
    error?: string | null;
    refreshLocation?: () => Promise<void>;
  };
  maxDistance?: number;
}

export const usePlaydates = (options: UsePlaydatesOptions = {}) => {
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
        console.log('Fetching playdates with user location:', userLocation);

        // Check if latitude/longitude columns are available
        const { data: testData, error: testError } = await supabase
          .from('playdates')
          .select('latitude, longitude')
          .limit(1);

        const hasLocationColumns = !(testError && testError.message.includes("column 'latitude' does not exist"));
        console.log('Database has location columns:', hasLocationColumns);

        // Fetch upcoming playdates
        let upcomingPlaydatesQuery = supabase.from('playdates').select('*');

        const { data: upcomingPlaydates, error: upcomingError } = await upcomingPlaydatesQuery
          .gt('start_time', new Date().toISOString())
          .order('start_time', { ascending: true });

        if (upcomingError) throw upcomingError;

        // Fetch past playdates
        const { data: pastPlaydatesData, error: pastError } = await supabase
          .from('playdates')
          .select('*')
          .lt('end_time', new Date().toISOString())
          .order('start_time', { ascending: false })
          .limit(10);

        if (pastError) throw pastError;

        const allPlaydatesData = [...upcomingPlaydates, ...pastPlaydatesData];
        const creatorIds = allPlaydatesData.map(p => p.creator_id).filter(Boolean);
        const uniqueCreatorIds = [...new Set(creatorIds)];

        console.log('🔍 Creator IDs to fetch:', uniqueCreatorIds);

        let creatorProfileMap: Record<string, any> = {};

        if (uniqueCreatorIds.length > 0) {
          const { data: creatorProfiles, error: creatorsError } = await supabase
            .from('profiles')
            .select('*') // Use * to avoid select errors
            .in('id', uniqueCreatorIds);

          if (creatorsError) {
            console.error('Error fetching creator profiles:', creatorsError);
            throw creatorsError;
          }

          console.log('✅ Creator profiles fetched:', creatorProfiles);

          if (creatorProfiles) {
            creatorProfiles.forEach(profile => {
              if (profile.id) {
                creatorProfileMap[profile.id] = profile;
              }
            });
          }
        }

        const playdateIds = allPlaydatesData.map(p => p.id);
        const { data: allParticipants, error: participantsError } = await supabase
          .from('playdate_participants')
          .select('playdate_id, id')
          .in('playdate_id', playdateIds);

        if (participantsError) throw participantsError;

        const participantCounts: Record<string, number> = {};
        allParticipants?.forEach(p => {
          participantCounts[p.playdate_id] = (participantCounts[p.playdate_id] || 0) + 1;
        });

        const formatPlaydate = (p, status): Playdate => {
          let creatorProfile = creatorProfileMap[p.creator_id];

          if (!creatorProfile && p.creator_id) {
            console.warn(`⚠️ No profile found in map for creator ID: ${p.creator_id}`);
            // Fallback fetch in case profile was missed
            supabase
              .from('profiles')
              .select('*')
              .eq('id', p.creator_id)
              .limit(1)
              .then(({ data, error }) => {
                if (data?.[0]) {
                  creatorProfileMap[p.creator_id] = data[0];
                }
              });
          }

          const hostName = creatorProfile?.parent_name || 'Unknown Host';

          return {
            id: p.id,
            title: p.title,
            date: format(new Date(p.start_time), 'EEE, MMM d'),
            time: `${format(new Date(p.start_time), 'h:mm a')} - ${format(new Date(p.end_time), 'h:mm a')}`,
            location: p.location,
            families: participantCounts[p.id] || 0,
            status,
            host: hostName,
            host_id: p.creator_id,
            start_time: p.start_time,
            end_time: p.end_time,
            latitude: p.latitude,
            longitude: p.longitude
          };
        };

        const formattedUpcoming = upcomingPlaydates.map(p => formatPlaydate(p, 'upcoming'));
        const formattedPast = pastPlaydatesData.map(p => formatPlaydate(p, 'past'));
        const formattedMyPlaydates = formattedUpcoming.filter(p => p.host_id === user.id);

        // Calculate distance for all playdates if user location is available
        let playdatesWithDistances = [...formattedUpcoming];
        let pastPlaydatesWithDistances = [...formattedPast];
        let myPlaydatesWithDistances = [...formattedMyPlaydates];
        
        if (userLocation?.latitude && userLocation?.longitude && hasLocationColumns) {
          console.log('Adding distance to playdates using location:', userLocation);
          
          // Add distance to all upcoming playdates with valid coordinates
          playdatesWithDistances = formattedUpcoming.map(playdate => {
            if (playdate.latitude !== undefined && playdate.longitude !== undefined && 
                playdate.latitude !== null && playdate.longitude !== null) {
              const distance = getDistanceInKm(
                userLocation.latitude,
                userLocation.longitude,
                playdate.latitude,
                playdate.longitude
              );
              return { ...playdate, distance };
            }
            return playdate;
          });
          
          // Add distance to all past playdates with valid coordinates
          pastPlaydatesWithDistances = formattedPast.map(playdate => {
            if (playdate.latitude !== undefined && playdate.longitude !== undefined && 
                playdate.latitude !== null && playdate.longitude !== null) {
              const distance = getDistanceInKm(
                userLocation.latitude,
                userLocation.longitude,
                playdate.latitude,
                playdate.longitude
              );
              return { ...playdate, distance };
            }
            return playdate;
          });
          
          // Add distance to all my playdates with valid coordinates
          myPlaydatesWithDistances = formattedMyPlaydates.map(playdate => {
            if (playdate.latitude !== undefined && playdate.longitude !== undefined && 
                playdate.latitude !== null && playdate.longitude !== null) {
              const distance = getDistanceInKm(
                userLocation.latitude,
                userLocation.longitude,
                playdate.latitude,
                playdate.longitude
              );
              return { ...playdate, distance };
            }
            return playdate;
          });
          
          // Find nearby playdates (within maxDistance)
          const playdatesWithCoords = playdatesWithDistances.filter(
            p => p.latitude !== undefined && p.longitude !== undefined && 
            p.latitude !== null && p.longitude !== null
          );
          
          console.log(`Found ${playdatesWithCoords.length} playdates with coordinates`);
          
          if (playdatesWithCoords.length > 0) {
            const nearby = getNearbyPlaydates(
              userLocation.latitude,
              userLocation.longitude,
              playdatesWithCoords,
              maxDistance
            );
            console.log(`Found ${nearby.length} nearby playdates`);
            setNearbyPlaydates(nearby);
          } else {
            console.log("No playdates found with valid coordinates");
            setNearbyPlaydates([]);
          }
        } else {
          console.log('User location not available or database missing location columns');
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
