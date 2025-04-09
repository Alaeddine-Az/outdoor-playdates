import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

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
}

interface ConnectionData {
  id: string;
  name: string;
  childName: string;
  interests: string[];
  distance: string;
}

interface EventData {
  title: string;
  date: string;
  location: string;
}

export const useDashboard = () => {
  const { user } = useAuth();
  const { profile, children, loading: profileLoading, error: profileError } = useProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingPlaydates, setUpcomingPlaydates] = useState<PlaydateData[]>([]);
  const [suggestedConnections, setSuggestedConnections] = useState<ConnectionData[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<EventData[]>([]);

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
        console.log("Loading dashboard data for user:", user?.id);
        setLoading(true);

        if (user) {
          // PLAYDATES
          const { data: playdatesData, error: playdatesError } = await supabase
            .from('playdates')
            .select('*, playdate_participants(*), profiles:creator_id(parent_name)') 
            .order('created_at', { ascending: false });

          if (playdatesError) throw playdatesError;

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

                timeStr = `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

                if (startDate > now) status = 'upcoming';
                else if (endDate < now) status = 'completed';
              }

              const hostName = playdate.profiles?.parent_name || 'Unknown Host';

              return {
                id: playdate.id,
                title: playdate.title || 'Untitled Playdate',
                date: dateStr,
                time: timeStr,
                location: playdate.location || 'Location not specified',
                attendees: 1,
                families: 1,
                status,
                host: hostName
              };
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
                host: playdate.profiles?.parent_name || 'Unknown Host'
              };
            }
          });

          setUpcomingPlaydates(formattedPlaydates);

          // SUGGESTED CONNECTIONS
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, parent_name, city')
            .neq('id', user.id);

          if (profilesError || !profiles) throw profilesError;

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

          const realConnections: ConnectionData[] = childrenData.map(child => {
            const parent = profiles.find(p => p.id === child.parent_id);
            return {
              id: parent?.id ?? '',
              name: parent?.parent_name ?? '',
              childName: `${child.name} (${child.age})`,
              interests: childInterestMap[child.id] ?? [],
              distance: '' // Optional: Add distance logic later
            };
          });

          setSuggestedConnections(realConnections);

          // NEARBY EVENTS (still mocked for now)
          setNearbyEvents([
            {
              title: 'Community Playground Day',
              date: 'Jun 17',
              location: 'City Central Park'
            },
            {
              title: 'Kids\' Science Fair',
              date: 'Jun 24',
              location: 'Public Library'
            }
          ]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile, profileLoading, profileError]);

  return {
    loading: loading || profileLoading,
    error,
    profile,
    children,
    upcomingPlaydates,
    suggestedConnections,
    nearbyEvents
  };
};
