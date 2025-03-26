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
  status: 'upcoming' | 'pending' | 'completed';
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
    // If there's a profile error, propagate it
    if (profileError) {
      setError(profileError);
      setLoading(false);
      return;
    }

    // If profile is still loading, we're still loading
    if (profileLoading) {
      setLoading(true);
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        console.log("Loading dashboard data for user:", user?.id);
        console.log("Profile data:", profile);
        
        // Simulate loading
        setLoading(true);
        
        // Fetch real playdates from Supabase
        if (user) {
          const { data: playdatesData, error: playdatesError } = await supabase
            .from('playdates')
            .select('*, playdate_participants(*)') 
            .order('created_at', { ascending: false });

          if (playdatesError) {
            console.error("Error fetching playdates:", playdatesError);
            throw playdatesError;
          }

          console.log("Fetched playdates:", playdatesData);

          // Transform playdates data to the format expected by the UI
          if (playdatesData) {
            const formattedPlaydates = playdatesData.map(playdate => {
              // Calculate date and time strings from the timestamps
              const startDate = new Date(playdate.start_time);
              const endDate = new Date(playdate.end_time);
              
              const dateOptions: Intl.DateTimeFormatOptions = { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric'
              };
              
              const dateStr = startDate.toLocaleDateString('en-US', dateOptions);
              const startTimeStr = startDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              });
              const endTimeStr = endDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              });
              
              // Determine status based on dates
              const now = new Date();
              let status: 'upcoming' | 'pending' | 'completed' = 'pending';
              
              if (startDate > now) {
                status = 'upcoming';
              } else if (endDate < now) {
                status = 'completed';
              }
              
              // Count attendees (this would need to be updated if we implement real attendance tracking)
              const attendees = 1; // Default to 1 (the creator)
              
              return {
                id: playdate.id,
                title: playdate.title,
                date: dateStr,
                time: `${startTimeStr} - ${endTimeStr}`,
                location: playdate.location,
                attendees: attendees,
                status: status
              };
            });
            
            setUpcomingPlaydates(formattedPlaydates);
          }
        }
        
        // Mock suggested connections
        setSuggestedConnections([
          {
            id: '1',
            name: 'Michael P.',
            childName: 'Oliver (6)',
            interests: ['Sports', 'STEM'],
            distance: '0.5 miles'
          },
          {
            id: '2',
            name: 'Sarah T.',
            childName: 'Liam (5)',
            interests: ['Arts', 'Nature'],
            distance: '0.8 miles'
          },
          {
            id: '3',
            name: 'David R.',
            childName: 'Sophia (6)',
            interests: ['STEM', 'Reading'],
            distance: '1.2 miles'
          }
        ]);
        
        // Mock nearby events
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
