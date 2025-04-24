
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Playdate } from '@/types/playdate';

export const usePlaydateFetch = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [playdateData, setPlaydateData] = useState<any[]>([]);
  const [creatorProfiles, setCreatorProfiles] = useState<Record<string, any>>({});
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPlaydates = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch upcoming playdates
        const { data: upcomingPlaydates, error: upcomingError } = await supabase
          .from('playdates')
          .select('*')
          .gt('start_time', new Date().toISOString())
          .neq('status', 'cancelled')
          .order('start_time', { ascending: true });

        if (upcomingError) throw upcomingError;

        // Fetch past playdates
        const { data: pastPlaydatesData, error: pastError } = await supabase
          .from('playdates')
          .select('*')
          .lt('end_time', new Date().toISOString())
          .neq('status', 'cancelled')
          .order('start_time', { ascending: false })
          .limit(10);

        if (pastError) throw pastError;

        const allPlaydatesData = [...upcomingPlaydates, ...pastPlaydatesData];
        const creatorIds = allPlaydatesData.map(p => p.creator_id).filter(Boolean);
        const uniqueCreatorIds = [...new Set(creatorIds)];

        // Fetch creator profiles
        if (uniqueCreatorIds.length > 0) {
          const { data: creatorProfiles, error: creatorsError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', uniqueCreatorIds);

          if (creatorsError) throw creatorsError;

          const profileMap: Record<string, any> = {};
          creatorProfiles?.forEach(profile => {
            if (profile.id) {
              profileMap[profile.id] = profile;
            }
          });
          setCreatorProfiles(profileMap);
        }

        // Fetch participant counts
        const playdateIds = allPlaydatesData.map(p => p.id);
        const { data: allParticipants, error: participantsError } = await supabase
          .from('playdate_participants')
          .select('playdate_id, id')
          .in('playdate_id', playdateIds);

        if (participantsError) throw participantsError;

        const counts: Record<string, number> = {};
        allParticipants?.forEach(p => {
          counts[p.playdate_id] = (counts[p.playdate_id] || 0) + 1;
        });
        setParticipantCounts(counts);
        setPlaydateData(allPlaydatesData);
      } catch (err) {
        console.error('Error fetching playdates:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaydates();
  }, [userId]);

  return { loading, error, playdateData, creatorProfiles, participantCounts };
};
