
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Playdate } from '@/types/playdate';

/**
 * Fetch all playdates from the database
 */
export const fetchPlaydatesData = async (userId: string) => {
  // Check if latitude/longitude columns are available
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

  return {
    upcomingPlaydates,
    pastPlaydatesData,
    hasLocationColumns
  };
};

/**
 * Fetch creator profiles for playdates
 */
export const fetchCreatorProfiles = async (creatorIds: string[]) => {
  const uniqueCreatorIds = [...new Set(creatorIds)];
  console.log('🔍 Creator IDs to fetch:', uniqueCreatorIds);

  if (uniqueCreatorIds.length === 0) {
    return {};
  }

  const { data: creatorProfiles, error: creatorsError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', uniqueCreatorIds);

  if (creatorsError) {
    console.error('Error fetching creator profiles:', creatorsError);
    throw creatorsError;
  }

  console.log('✅ Creator profiles fetched:', creatorProfiles);

  let creatorProfileMap: Record<string, any> = {};
  if (creatorProfiles) {
    creatorProfiles.forEach(profile => {
      if (profile.id) {
        creatorProfileMap[profile.id] = profile;
      }
    });
  }

  return creatorProfileMap;
};

/**
 * Fetch participants for playdates
 */
export const fetchPlaydateParticipants = async (playdateIds: string[]) => {
  const { data: allParticipants, error: participantsError } = await supabase
    .from('playdate_participants')
    .select('playdate_id, id')
    .in('playdate_id', playdateIds);

  if (participantsError) throw participantsError;

  const participantCounts: Record<string, number> = {};
  allParticipants?.forEach(p => {
    participantCounts[p.playdate_id] = (participantCounts[p.playdate_id] || 0) + 1;
  });

  return participantCounts;
};

/**
 * Format a playdate from database data
 */
export const formatPlaydate = (
  p: any, 
  status: string, 
  creatorProfileMap: Record<string, any>, 
  participantCounts: Record<string, number>
): Playdate => {
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
