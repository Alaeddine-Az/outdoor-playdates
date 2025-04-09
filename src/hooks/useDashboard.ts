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
          // Fetch accepted connections to exclude from suggestions
          const { data: acceptedConnections, error: connectionsError } = await supabase
            .from('connections')
            .select('requester_id, recipient_id')
            .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
            .eq('status', 'accepted');

          if (connectionsError) throw connectionsError;

          const connectedUserIds = acceptedConnections.map(conn =>
            conn.requester_id === user.id ? conn.recipient_id : conn.requester_id
          );

          // Fetch all profiles and exclude self + connected users
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
              const firstChild = children[0];

              const allInterests = children.flatMap(child => childInterestMap[child.id] ?? []);
              const uniqueInterests = [...new Set(allInterests)];

              const childName = children.length === 1
                ? `${firstChild.name} (${firstChild.age})`
                : `${firstChild.name} (${firstChild.age}) + ${children.length - 1} more`;

              return {
                id: parent?.id ?? '',
                name: parent?.parent_name ?? '',
                childName,
                interests: uniqueInterests,
                distance: '' // Optional: use ZIP or location later
              };
            }
          );

          setSuggestedConnections(realConnections);

          // Fetch playdates
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

          // Static nearby events for now
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
