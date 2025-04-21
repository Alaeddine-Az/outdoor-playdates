
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { getDistanceInKm } from '@/utils/locationUtils';

export interface PlaydateData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  families: number;
  status: 'upcoming' | 'pending' | 'completed';
  host?: string;
  host_id?: string;
  start_time?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

interface LocationData {
  latitude: number | null;
  longitude: number | null;
}

export function useFetchPlaydates(userLocation?: LocationData) {
  const [loading, setLoading] = useState(true);
  const [upcomingPlaydates, setUpcomingPlaydates] = useState<PlaydateData[]>([]);
  const [nearbyPlaydates, setNearbyPlaydates] = useState<PlaydateData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchPlaydates = async () => {
      try {
        setLoading(true);

        const query = supabase
          .from('playdates')
          .select('*, profiles:creator_id(parent_name)');

        let playdatesData: any[] = [];
        try {
          const { data: testData, error: testError } = await query
            .gt('start_time', new Date().toISOString())
            .order('start_time', { ascending: true })
            .limit(1);

          if (testError && testError.message.includes("column 'latitude' does not exist")) {
            // Latitude/longitude columns missing
            const { data, error: fetchError } = await supabase
              .from('playdates')
              .select('*, profiles:creator_id(parent_name)')
              .gt('start_time', new Date().toISOString())
              .neq('status', 'cancelled')
              .order('start_time', { ascending: true })
              .limit(15);
            if (fetchError) throw fetchError;
            playdatesData = data || [];
          } else {
            const { data, error: fetchError } = await supabase
              .from('playdates')
              .select('*, profiles:creator_id(parent_name), latitude, longitude')
              .gt('start_time', new Date().toISOString())
              .neq('status', 'cancelled')
              .order('start_time', { ascending: true })
              .limit(15);
            if (fetchError) throw fetchError;
            playdatesData = data || [];
          }
        } catch (e) {
          throw e;
        }

        const formattedPlaydates: PlaydateData[] = playdatesData.map(playdate => {
          try {
            const startDate = new Date(playdate.start_time);
            const endDate = new Date(playdate.end_time);
            const now = new Date();
            const isValidDate = !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
            let dateStr = 'Date unavailable';
            let timeStr = 'Time unavailable';
            let status: 'upcoming' | 'pending' | 'completed' = 'pending';

            if (isValidDate) {
              dateStr = startDate.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
              });
              timeStr = `${startDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })} - ${endDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })}`;
              if (startDate > now) status = 'upcoming';
              else if (endDate < now) status = 'completed';
            }
            const hostName = playdate.profiles?.parent_name || 'Unknown Host';
            const latitude = playdate.latitude;
            const longitude = playdate.longitude;

            return {
              id: playdate.id,
              title: playdate.title || 'Untitled Playdate',
              date: dateStr,
              time: timeStr,
              location: playdate.location || 'Location not specified',
              attendees: 1,
              families: 1,
              status,
              host: hostName,
              host_id: playdate.creator_id,
              start_time: playdate.start_time,
              latitude: latitude,
              longitude: longitude,
              distance: undefined,
            };
          } catch (err) {
            return {
              id: playdate.id || 'unknown-id',
              title: playdate.title || 'Untitled Playdate',
              date: 'Date error',
              time: 'Time unavailable',
              location: playdate.location || 'Unknown location',
              attendees: 1,
              families: 1,
              status: 'pending' as const,
              host: playdate.profiles?.parent_name || 'Unknown Host',
              host_id: playdate.creator_id,
              start_time: undefined,
              latitude: undefined,
              longitude: undefined,
              distance: undefined,
            } as PlaydateData;
          }
        });

        let playdatesWithDistances = [...formattedPlaydates];
        if (userLocation?.latitude && userLocation?.longitude) {
          playdatesWithDistances = formattedPlaydates.map(playdate => {
            if (
              playdate.latitude !== undefined && playdate.longitude !== undefined &&
              playdate.latitude !== null && playdate.longitude !== null
            ) {
              const distance = getDistanceInKm(
                userLocation.latitude,
                userLocation.longitude,
                playdate.latitude,
                playdate.longitude
              );
              return { ...playdate, distance };
            }
            return { ...playdate, distance: undefined };
          });
        }
        const sortedPlaydates = playdatesWithDistances
          .sort((a, b) => {
            if (a.start_time && b.start_time) {
              return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
            }
            return 0;
          })
          .slice(0, 6);

        if (!cancelled) {
          setUpcomingPlaydates(sortedPlaydates);
          if (userLocation?.latitude && userLocation?.longitude) {
            const playdatesWithLocation = playdatesWithDistances.filter(
              p =>
                p.latitude !== undefined &&
                p.longitude !== undefined &&
                p.latitude !== null &&
                p.longitude !== null
            );
            const playdatesWithinDistance = playdatesWithLocation
              .filter((p) => p.distance !== undefined && p.distance <= 10)
              .sort((a, b) => (a.distance || 999) - (b.distance || 999));
            setNearbyPlaydates(playdatesWithinDistance);
          } else {
            setNearbyPlaydates([]);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPlaydates();
    return () => { cancelled = true; };
  }, [userLocation?.latitude, userLocation?.longitude]);

  return { loading, upcomingPlaydates, nearbyPlaydates, error };
}
