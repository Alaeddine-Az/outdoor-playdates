import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, compareAsc } from 'date-fns';
import { DashboardEvent } from '@/types';
import { getNearbyPlaydates, getDistanceInKm } from '@/utils/locationUtils';

interface PlaydateData {
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
  distance?: number;  // Added distance property to fix TypeScript errors
}

interface ConnectionData {
  id: string;
  name: string;
  childName: string;
  interests: string[];
  distance: string;
}

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  loading?: boolean;
  error?: string | null;
}

export const useDashboard = (userLocation?: LocationData) => {
  const { user } = useAuth();
  const { profile, children, loading: profileLoading, error: profileError } = useProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingPlaydates, setUpcomingPlaydates] = useState<PlaydateData[]>([]);
  const [nearbyPlaydates, setNearbyPlaydates] = useState<PlaydateData[]>([]);
  const [suggestedConnections, setSuggestedConnections] = useState<ConnectionData[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<DashboardEvent[]>([]);

  useEffect(() => {
    if (profileError) {
      setError(profileError);
      setLoading(false);
      return;
    }

    if (profileLoading) {
      setLoading(true);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        if (user) {
          // Get accepted connections to exclude
          const { data: acceptedConnections, error: connectionsError } = await supabase
            .from('connections')
            .select('requester_id, recipient_id')
            .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
            .eq('status', 'accepted');

          if (connectionsError) throw connectionsError;

          const connectedUserIds = acceptedConnections.map(conn =>
            conn.requester_id === user.id ? conn.recipient_id : conn.requester_id
          );

          // Get all profiles and filter
          const { data: allProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, parent_name, city');

          if (profilesError || !allProfiles) throw profilesError;

          const profiles = allProfiles.filter(
            p => p.id !== user.id && !connectedUserIds.includes(p.id)
          );

          const profileIds = profiles.map(p => p.id);

          const { data: childrenData, error: childrenError } = await supabase
            .from('children')
            .select('id, name, age, parent_id')
            .in('parent_id', profileIds);

          if (childrenError || !childrenData) throw childrenError;

          const childIds = childrenData.map(c => c.id);

          const { data: childInterests, error: childInterestsError } = await supabase
            .from('child_interests')
            .select('child_id, interest_id')
            .in('child_id', childIds);

          if (childInterestsError || !childInterests) throw childInterestsError;

          const interestIds = [...new Set(childInterests.map(ci => ci.interest_id))];

          const { data: interests, error: interestsError } = await supabase
            .from('interests')
            .select('id, name')
            .in('id', interestIds);

          if (interestsError || !interests) throw interestsError;

          const interestMap = Object.fromEntries(interests.map(i => [i.id, i.name]));
          const childInterestMap = childInterests.reduce((acc, ci) => {
            if (!acc[ci.child_id]) acc[ci.child_id] = [];
            acc[ci.child_id].push(interestMap[ci.interest_id]);
            return acc;
          }, {} as Record<string, string[]>);

          // Group children by parent
          const parentChildMap = childrenData.reduce((acc, child) => {
            if (!acc[child.parent_id]) acc[child.parent_id] = [];
            acc[child.parent_id].push(child);
            return acc;
          }, {} as Record<string, typeof childrenData>);

          const realConnections: ConnectionData[] = Object.entries(parentChildMap).map(
            ([parentId, children]) => {
              const parent = profiles.find(p => p.id === parentId);
              const firstTwoChildren = children.slice(0, 2);
              const firstChild = firstTwoChildren[0];

              const childName = children.length === 1
                ? `${firstChild.name} (${firstChild.age})`
                : `${firstChild.name} (${firstChild.age}) + ${children.length - 1} more`;

              // Show interests from only first two children
              const interestsFromFirstTwo = firstTwoChildren.flatMap(
                child => childInterestMap[child.id] ?? []
              );
              const uniqueInterests = [...new Set(interestsFromFirstTwo)];

              return {
                id: parent?.id ?? '',
                name: parent?.parent_name ?? '',
                childName,
                interests: uniqueInterests,
                distance: '' // optional
              };
            }
          );

          // 🎲 Randomize and limit to 3
          const limitedConnections = realConnections
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          setSuggestedConnections(limitedConnections);

          // Fetch playdates
          const query = supabase
            .from('playdates')
            .select('*, profiles:creator_id(parent_name)');

          // First check if latitude/longitude columns are available by making a test query
          const { data: testData, error: testError } = await query
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

          const formattedPlaydates = playdatesData.map(playdate => {
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
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
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

              // Create a base playdate object without distance
              const basePlaydate: PlaydateData = {
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
                latitude: playdate.latitude,
                longitude: playdate.longitude,
                distance: undefined // Initialize with undefined
              };

              return basePlaydate;
            } catch (err) {
              console.error("Error processing playdate:", err, playdate);
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
                distance: undefined // Initialize with undefined
              } as PlaydateData;
            }
          });

          // Add distance to all playdates when user location is available
          let playdatesWithDistances = [...formattedPlaydates];
          if (userLocation?.latitude && userLocation?.longitude) {
            playdatesWithDistances = formattedPlaydates.map(playdate => {
              if (playdate.latitude !== undefined && playdate.longitude !== undefined && 
                  playdate.latitude !== null && playdate.longitude !== null) {
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

          // Sort by start_time (closest first) and limit to 6
          const sortedPlaydates = playdatesWithDistances
            .sort((a, b) => {
              if (a.start_time && b.start_time) {
                return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
              }
              return 0;
            })
            .slice(0, 6);

          setUpcomingPlaydates(sortedPlaydates);
          
          // Calculate nearby playdates if user location is available
          if (userLocation?.latitude && userLocation?.longitude) {
            // Filter for playdates with location
            const playdatesWithLocation = playdatesWithDistances.filter(
              p => p.latitude !== undefined && p.longitude !== undefined && 
                   p.latitude !== null && p.longitude !== null
            );
            
            if (playdatesWithLocation.length > 0) {
              // Get all playdates within 10km and sort by distance
              const playdatesWithinDistance = playdatesWithLocation.filter(p => 
                p.distance !== undefined && p.distance <= 10
              ).sort((a, b) => (a.distance || 999) - (b.distance || 999));
              
              setNearbyPlaydates(playdatesWithinDistance);
            } else {
              console.log("No playdates with location data available");
              setNearbyPlaydates([]);
            }
          }

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

          setNearbyEvents(upcomingEvents);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile, profileLoading, profileError, userLocation]);

  return {
    loading: loading || profileLoading,
    error,
    profile,
    children,
    upcomingPlaydates,
    nearbyPlaydates,
    suggestedConnections,
    nearbyEvents
  };
};
