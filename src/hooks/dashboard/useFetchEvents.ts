
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, compareAsc } from 'date-fns';
import { DashboardEvent } from '@/types';

export function useFetchEvents() {
  const [loading, setLoading] = useState(true);
  const [nearbyEvents, setNearbyEvents] = useState<DashboardEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .gt('start_time', new Date().toISOString())
          .order('start_time', { ascending: true });

        if (eventsError) throw eventsError;

        let upcomingEvents: DashboardEvent[] = [];
        if (eventsData && eventsData.length > 0) {
          upcomingEvents = eventsData
            .map(event => {
              try {
                const startTime = parseISO(event.start_time);
                return {
                  id: event.id, // Include the event id for navigation
                  title: event.title,
                  date: format(startTime, 'MMM d'),
                  location: event.city || event.location,
                  rawDate: event.start_time
                };
              } catch (e) {
                return null;
              }
            })
            .filter(Boolean)
            .sort((a, b) => compareAsc(new Date(a.rawDate), new Date(b.rawDate)))
            .slice(0, 6)
            .map(({id, title, date, location}) => ({ id, title, date, location })); // id included
        }

        if (upcomingEvents.length < 6) {
          const staticEvents = [
            {
              title: 'Community Playground Day',
              date: 'Jun 17',
              location: 'City Central Park'
            },
            {
              title: 'Kids\' Science Fair',
              date: 'Jun 24',
              location: 'Public Library'
            },
            {
              title: 'Family Music Festival',
              date: 'Jul 2',
              location: 'Downtown Amphitheater'
            },
            {
              title: 'Story Time for Toddlers',
              date: 'Jul 8',
              location: 'Main Library'
            },
            {
              title: 'Nature Walk for Kids',
              date: 'Jul 15',
              location: 'National Park'
            },
            {
              title: 'STEM Workshop',
              date: 'Jul 22',
              location: 'Children\'s Museum'
            }
          ];
          const remainingNeeded = 6 - upcomingEvents.length;
          upcomingEvents = [...upcomingEvents, ...staticEvents.slice(0, remainingNeeded)];
        }

        if (!cancelled) setNearbyEvents(upcomingEvents);
      } catch (err: any) {
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEvents();
    return () => { cancelled = true; };
  }, []);

  return { loading, nearbyEvents, error };
}
