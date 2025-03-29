
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
              try {
                // Safely parse dates - if these fail, use fallback values
                const startDate = new Date(playdate.start_time);
                const endDate = new Date(playdate.end_time);
                const isValidDate = !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
                
                // Format date string safely
                let dateStr = 'Date unavailable';
                let startTimeStr = 'Time unavailable';
                let endTimeStr = '';
                
                if (isValidDate) {
                  const dateOptions: Intl.DateTimeFormatOptions = { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric'
                  };
                  
                  dateStr = startDate.toLocaleDateString('en-US', dateOptions);
                  startTimeStr = startDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  });
                  endTimeStr = endDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  });
                }
                
                // Determine status based on dates
                const now = new Date();
                let status: 'upcoming' | 'pending' | 'completed' = 'pending';
                
                if (isValidDate) {
                  if (startDate > now) {
                    status = 'upcoming';
                  } else if (endDate < now) {
                    status = 'completed';
                  }
                }
                
                // Count attendees (this would need to be updated if we implement real attendance tracking)
                const attendees = 1; // Default to 1 (the creator)
                
                return {
                  id: playdate.id,
                  title: playdate.title || 'Untitled Playdate',
                  date: dateStr,
                  time: `${startTimeStr}${endTimeStr ? ` - ${endTimeStr}` : ''}`,
                  location: playdate.location || 'Location not specified',
                  attendees: attendees,
                  families: attendees,
                  status: status
                };
              } catch (err) {
                console.error("Error processing playdate:", err, playdate);
                // Return a safe fallback object if date processing fails
                return {
                  id: playdate.id || 'unknown-id',
                  title: playdate.title || 'Untitled Playdate',
                  date: 'Date processing error',
                  time: 'Time unavailable',
                  location: playdate.location || 'Location not specified',
                  attendees: 1,
                  families: 1,
                  status: 'pending' as const
                };
              }
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
