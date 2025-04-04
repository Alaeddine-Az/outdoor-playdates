
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export const usePlaydates = () => {
  const { user } = useAuth();
  const [allPlaydates, setAllPlaydates] = useState([]);
  const [myPlaydates, setMyPlaydates] = useState([]);
  const [pastPlaydates, setPastPlaydates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const creatorIds = allPlaydatesWithCreators.map(playdate => playdate.creator_id);
        
        // Remove duplicates from creatorIds
        const uniqueCreatorIds = [...new Set(creatorIds)];
        
        const { data: creatorProfiles, error: creatorsError } = await supabase
          .from('profiles')
          .select('id, parent_name')
          .in('id', uniqueCreatorIds);
          
        if (creatorsError) throw creatorsError;
        
        // Create a map of creator profiles by id
        const creatorProfileMap = {};
        if (creatorProfiles) {
          creatorProfiles.forEach(profile => {
            creatorProfileMap[profile.id] = profile;
          });
        }

        // Get participants for each playdate
        const playdateIds = allPlaydatesWithCreators.map(playdate => playdate.id);
        const { data: allParticipants, error: participantsError } = await supabase
          .from('playdate_participants')
          .select('playdate_id, id')
          .in('playdate_id', playdateIds);

        if (participantsError) throw participantsError;

        // Count participants for each playdate
        const participantCounts = {};
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
          const creatorProfile = creatorProfileMap[playdate.creator_id];
          return {
            id: playdate.id,
            title: playdate.title,
            date: format(new Date(playdate.start_time), 'EEE, MMM d'),
            time: `${format(new Date(playdate.start_time), 'h:mm a')} - ${format(new Date(playdate.end_time), 'h:mm a')}`,
            location: playdate.location,
            families: participantCounts[playdate.id] || 0,
            status: 'upcoming',
            host: creatorProfile ? creatorProfile.parent_name : 'Unknown Host',
            host_id: playdate.creator_id
          };
        });

        const formattedPast = pastPlaydatesData.map(playdate => {
          const creatorProfile = creatorProfileMap[playdate.creator_id];
          return {
            id: playdate.id,
            title: playdate.title,
            date: format(new Date(playdate.start_time), 'EEE, MMM d'),
            time: `${format(new Date(playdate.start_time), 'h:mm a')} - ${format(new Date(playdate.end_time), 'h:mm a')}`,
            location: playdate.location,
            families: participantCounts[playdate.id] || 0,
            status: 'past',
            host: creatorProfile ? creatorProfile.parent_name : 'Unknown Host',
            host_id: playdate.creator_id
          };
        });

        // Filter playdates created by the current user
        const myPlaydatesData = upcomingPlaydates.filter(
          playdate => playdate.creator_id === user.id
        );

        const formattedMyPlaydates = myPlaydatesData.map(playdate => {
          const creatorProfile = creatorProfileMap[playdate.creator_id];
          return {
            id: playdate.id,
            title: playdate.title,
            date: format(new Date(playdate.start_time), 'EEE, MMM d'),
            time: `${format(new Date(playdate.start_time), 'h:mm a')} - ${format(new Date(playdate.end_time), 'h:mm a')}`,
            location: playdate.location,
            families: participantCounts[playdate.id] || 0,
            status: 'confirmed',
            host: creatorProfile ? creatorProfile.parent_name : 'Unknown Host',
            host_id: playdate.creator_id
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
