
import { supabase } from '@/integrations/supabase/client';
import { PlaydateData } from '@/types/dashboard';
import { formatPlaydate } from '@/utils/playdateFormatters';
import { getDistanceInKm } from '@/utils/locationUtils';

/**
 * Fetch playdates from Supabase and format them
 */
export async function fetchPlaydates(location?: {
  latitude: number | null;
  longitude: number | null;
  loading?: boolean;
  error?: string | null;
}): Promise<{
  upcomingPlaydates: PlaydateData[];
  nearbyPlaydates: PlaydateData[];
}> {
  try {
    // First check if latitude/longitude columns are available by making a test query
    const { data: testData, error: testError } = await supabase
      .from('playdates')
      .select('*, profiles:creator_id(parent_name)')
      .gt('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(1);

    // If we have a "column does not exist" error for latitude, then we need to query without it
    let playdatesData = [];
    if (testError && testError.message.includes("column 'latitude' does not exist")) {
      console.log("Latitude/longitude columns not available yet. Fetching without them.");
      const { data, error: fetchError } = await supabase
        .from('playdates')
        .select('*, profiles:creator_id(parent_name)')
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(15);
      
      if (fetchError) throw fetchError;
      playdatesData = data || [];
    } else {
      // If the test query worked, then we can use latitude/longitude
      const { data, error: fetchError } = await supabase
        .from('playdates')
        .select('*, profiles:creator_id(parent_name), latitude, longitude')
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(15);
      
      if (fetchError) throw fetchError;
      playdatesData = data || [];
    }

    const formattedPlaydates = playdatesData.map(playdate => formatPlaydate(playdate, 'pending'));

    // Add distance to all playdates when user location is available
    let playdatesWithDistances = [...formattedPlaydates];
    if (location?.latitude && location?.longitude) {
      playdatesWithDistances = formattedPlaydates.map(playdate => {
        if (playdate.latitude !== undefined && playdate.longitude !== undefined && 
            playdate.latitude !== null && playdate.longitude !== null) {
          const distance = getDistanceInKm(
            location.latitude,
            location.longitude,
            playdate.latitude,
            playdate.longitude
          );
          return { ...playdate, distance };
        }
        return { ...playdate, distance: undefined };
      });
    }

    // Sort by start_time (closest first) and limit to 6
    const sortedPlaydates = playdatesWithDistances
      .sort((a, b) => {
        if (a.start_time && b.start_time) {
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        }
        return 0;
      })
      .slice(0, 6);

    // Calculate nearby playdates if user location is available
    let nearbyPlaydates: PlaydateData[] = [];
    
    if (location?.latitude && location?.longitude) {
      // Filter for playdates with location
      const playdatesWithLocation = playdatesWithDistances.filter(
        p => p.latitude !== undefined && p.longitude !== undefined && 
             p.latitude !== null && p.longitude !== null
      );
      
      if (playdatesWithLocation.length > 0) {
        // Get all playdates within 10km and sort by distance
        nearbyPlaydates = playdatesWithLocation.filter(p => 
          p.distance !== undefined && p.distance <= 10
        ).sort((a, b) => (a.distance || 999) - (b.distance || 999));
      } else {
        console.log("No playdates with location data available");
      }
    }

    return {
      upcomingPlaydates: sortedPlaydates, 
      nearbyPlaydates
    };
    
  } catch (error) {
    console.error("Error fetching playdates:", error);
    return { upcomingPlaydates: [], nearbyPlaydates: [] };
  }
}
