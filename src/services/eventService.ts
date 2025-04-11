
import { supabase } from '@/integrations/supabase/client';
import { DashboardEvent } from '@/types';
import { format, parseISO, compareAsc } from 'date-fns';

/**
 * Fetch upcoming events for the dashboard
 */
export async function fetchNearbyEvents(): Promise<DashboardEvent[]> {
  try {
    // Fetch real upcoming events from database
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .gt('start_time', new Date().toISOString())
      .order('start_time', { ascending: true });

    if (eventsError) throw eventsError;

    // Format upcoming events for dashboard
    let upcomingEvents: DashboardEvent[] = [];
    
    if (eventsData && eventsData.length > 0) {
      upcomingEvents = eventsData
        .map(event => {
          try {
            const startTime = parseISO(event.start_time);
            return {
              title: event.title,
              date: format(startTime, 'MMM d'),
              location: event.city || event.location,
              rawDate: event.start_time
            };
          } catch (e) {
            console.error("Error parsing event date:", e);
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => compareAsc(new Date(a.rawDate), new Date(b.rawDate)))
        .slice(0, 6)
        .map(({title, date, location}) => ({title, date, location}));
    }

    // Add static events if we don't have enough
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

    return upcomingEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
