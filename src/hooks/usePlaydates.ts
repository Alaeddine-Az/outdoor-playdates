
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { getNearbyPlaydates } from '@/utils/locationUtils';

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

        // First check if latitude/longitude columns are available
        const { data: testData, error: testError } = await supabase
          .from('playdates')
          .select('latitude, longitude')
          .limit(1);

        const hasLocationColumns = !(testError && testError.message.includes("column 'latitude' does not exist"));

        // Fetch upcoming playdates
        let upcomingPlaydatesQuery = supabase.from('playdates').select('*');
        if (hasLocationColumns) {
          console.log("Using playdates query with location columns");
        } else {
          console.log("Using playdates query without location columns");
        }

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

          console.log(`📌 Rendering playdate ${p.id} with host: ${hostName}, host_id: ${p.creator_id}`);

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

        // Find nearby playdates if user location is available
        let formattedNearby: Playdate[] = [];
        if (userLocation?.latitude && userLocation?.longitude && hasLocationColumns) {
          // Filter playdate with valid coordinates
          const playdatesWithCoords = formattedUpcoming.filter(
            p => p.latitude !== undefined && p.longitude !== undefined && 
            p.latitude !== null && p.longitude !== null
          );
          
          if (playdatesWithCoords.length > 0) {
            formattedNearby = getNearbyPlaydates(
              userLocation.latitude,
              userLocation.longitude,
              playdatesWithCoords,
              maxDistance
            );
          } else {
            console.log("No playdates found with valid coordinates");
          }
        }

        setAllPlaydates(formattedUpcoming);
        setMyPlaydates(formattedMyPlaydates);
        setPastPlaydates(formattedPast);
        setNearbyPlaydates(formattedNearby);
      } catch (err) {
        console.error('Error fetching playdates:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaydates();
  }, [user, userLocation]);

  return { 
    allPlaydates, 
    myPlaydates, 
    pastPlaydates, 
    nearbyPlaydates, 
    loading, 
    error 
  };
};
