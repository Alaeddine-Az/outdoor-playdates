
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

// Define and export the Playdate interface
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
}

export const usePlaydates = () => {
  const { user } = useAuth();
  const [allPlaydates, setAllPlaydates] = useState<Playdate[]>([]);
  const [myPlaydates, setMyPlaydates] = useState<Playdate[]>([]);
  const [pastPlaydates, setPastPlaydates] = useState<Playdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPlaydates = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch all upcoming playdates
        const { data: upcomingPlaydates, error: upcomingError } = await supabase
          .from('playdates')
          .select('*')
          .gt('start_time', new Date().toISOString())
          .order('start_time', { ascending: true });

        if (upcomingError) throw upcomingError;

        // Fetch all past playdates
        const { data: pastPlaydatesData, error: pastError } = await supabase
          .from('playdates')
          .select('*')
          .lt('end_time', new Date().toISOString())
          .order('start_time', { ascending: false })
          .limit(10);

        if (pastError) throw pastError;

        // Fetch creator profiles for all playdates
        const allPlaydatesWithCreators = [...upcomingPlaydates, ...pastPlaydatesData];
        const creatorIds = allPlaydatesWithCreators
          .map(playdate => playdate.creator_id)
          .filter(Boolean);
        
        // Remove duplicates from creatorIds
        const uniqueCreatorIds = [...new Set(creatorIds)];
        
        // Log for debugging
        console.log('Creator IDs to fetch:', uniqueCreatorIds);
        
        // Only fetch profiles if we have creator IDs
        let creatorProfileMap: Record<string, any> = {};
        if (uniqueCreatorIds.length > 0) {
          const { data: creatorProfiles, error: creatorsError } = await supabase
            .from('profiles')
            .select('id, parent_name')
            .in('id', uniqueCreatorIds);
            
          if (creatorsError) {
            console.error('Error fetching creator profiles:', creatorsError);
            throw creatorsError;
          }
          
          // Log for debugging
          console.log('Creator profiles fetched:', creatorProfiles);
          
          // Create a map of creator profiles by id
          if (creatorProfiles && creatorProfiles.length > 0) {
            creatorProfiles.forEach(profile => {
              creatorProfileMap[profile.id] = profile;
            });
          }
        }

        // Get participants for each playdate
        const playdateIds = allPlaydatesWithCreators.map(playdate => playdate.id);
        const { data: allParticipants, error: participantsError } = await supabase
          .from('playdate_participants')
          .select('playdate_id, id')
          .in('playdate_id', playdateIds);

        if (participantsError) throw participantsError;

        // Count participants for each playdate
        const participantCounts: Record<string, number> = {};
        if (allParticipants) {
          allParticipants.forEach(participant => {
            if (!participantCounts[participant.playdate_id]) {
              participantCounts[participant.playdate_id] = 0;
            }
            participantCounts[participant.playdate_id]++;
          });
        }

        // Format the data for each category
        const formattedUpcoming = upcomingPlaydates.map(playdate => {
          const creatorId = playdate.creator_id;
          const creatorProfile = creatorId ? creatorProfileMap[creatorId] : null;
          
          // Log detailed information for debugging
          if (!creatorProfile && creatorId) {
            console.log(`No profile found for creator ID: ${creatorId}`);
            console.log('Creator profile map keys:', Object.keys(creatorProfileMap));
          }
          
          return {
            id: playdate.id,
            title: playdate.title,
            date: format(new Date(playdate.start_time), 'EEE, MMM d'),
            time: `${format(new Date(playdate.start_time), 'h:mm a')} - ${format(new Date(playdate.end_time), 'h:mm a')}`,
            location: playdate.location,
            families: participantCounts[playdate.id] || 0,
            status: 'upcoming',
            host: creatorProfile ? creatorProfile.parent_name : 'Unknown Host',
            host_id: creatorId,
            start_time: playdate.start_time,
            end_time: playdate.end_time
          };
        });

        const formattedPast = pastPlaydatesData.map(playdate => {
          const creatorId = playdate.creator_id;
          const creatorProfile = creatorId ? creatorProfileMap[creatorId] : null;
          
          return {
            id: playdate.id,
            title: playdate.title,
            date: format(new Date(playdate.start_time), 'EEE, MMM d'),
            time: `${format(new Date(playdate.start_time), 'h:mm a')} - ${format(new Date(playdate.end_time), 'h:mm a')}`,
            location: playdate.location,
            families: participantCounts[playdate.id] || 0,
            status: 'past',
            host: creatorProfile ? creatorProfile.parent_name : 'Unknown Host',
            host_id: creatorId,
            start_time: playdate.start_time,
            end_time: playdate.end_time
          };
        });

        // Filter playdates created by the current user
        const myPlaydatesData = upcomingPlaydates.filter(
          playdate => playdate.creator_id === user.id
        );

        const formattedMyPlaydates = myPlaydatesData.map(playdate => {
          const creatorId = playdate.creator_id;
          const creatorProfile = creatorId ? creatorProfileMap[creatorId] : null;
          
          return {
            id: playdate.id,
            title: playdate.title,
            date: format(new Date(playdate.start_time), 'EEE, MMM d'),
            time: `${format(new Date(playdate.start_time), 'h:mm a')} - ${format(new Date(playdate.end_time), 'h:mm a')}`,
            location: playdate.location,
            families: participantCounts[playdate.id] || 0,
            status: 'confirmed',
            host: creatorProfile ? creatorProfile.parent_name : 'Unknown Host',
            host_id: creatorId,
            start_time: playdate.start_time,
            end_time: playdate.end_time
          };
        });

        setAllPlaydates(formattedUpcoming);
        setMyPlaydates(formattedMyPlaydates);
        setPastPlaydates(formattedPast);
      } catch (err) {
        console.error('Error fetching playdates:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaydates();
  }, [user]);

  return { allPlaydates, myPlaydates, pastPlaydates, loading, error };
};
