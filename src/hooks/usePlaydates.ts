import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

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

        const { data: upcomingPlaydates, error: upcomingError } = await supabase
          .from('playdates')
          .select('*')
          .gt('start_time', new Date().toISOString())
          .order('start_time', { ascending: true });

        if (upcomingError) throw upcomingError;

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
            end_time: p.end_time
          };
        };

        const formattedUpcoming = upcomingPlaydates.map(p => formatPlaydate(p, 'upcoming'));
        const formattedPast = pastPlaydatesData.map(p => formatPlaydate(p, 'past'));
        const formattedMyPlaydates = formattedUpcoming.filter(p => p.host_id === user.id);

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
