
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useConnections } from '@/hooks/useConnections';

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
  const { isConnected, hasPendingRequest } = useConnections();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingPlaydates, setUpcomingPlaydates] = useState<PlaydateData[]>([]);
  const [suggestedConnections, setSuggestedConnections] = useState<ConnectionData[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<EventData[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      console.log("Loading dashboard data for user:", user?.id);
      console.log("Profile data:", profile);
      
      setLoading(true);
      setError(null);
      
      if (user) {
        try {
          const { data: playdatesData, error: playdatesError } = await supabase
            .from('playdates')
            .select('*, playdate_participants(*), profiles:creator_id(parent_name)') 
            .order('created_at', { ascending: false });

          if (playdatesError) {
            console.error("Error fetching playdates:", playdatesError);
            throw playdatesError;
          }

          console.log("Fetched playdates:", playdatesData);

          if (playdatesData) {
            const formattedPlaydates = playdatesData.map(playdate => {
              try {
                const startDate = new Date(playdate.start_time);
                const endDate = new Date(playdate.end_time);
                const isValidDate = !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
                
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
                
                const now = new Date();
                let status: 'upcoming' | 'pending' | 'completed' = 'pending';
                
                if (isValidDate) {
                  if (startDate > now) {
                    status = 'upcoming';
                  } else if (endDate < now) {
                    status = 'completed';
                  }
                }
                
                const attendees = 1;
                const hostName = playdate.profiles?.parent_name || 'Unknown Host';
                
                return {
                  id: playdate.id,
                  title: playdate.title || 'Untitled Playdate',
                  date: dateStr,
                  time: `${startTimeStr}${endTimeStr ? ` - ${endTimeStr}` : ''}`,
                  location: playdate.location || 'Location not specified',
                  attendees: attendees,
                  families: attendees,
                  status: status,
                  host: hostName
                };
              } catch (err) {
                console.error("Error processing playdate:", err, playdate);
                return {
                  id: playdate.id || 'unknown-id',
                  title: playdate.title || 'Untitled Playdate',
                  date: 'Date processing error',
                  time: 'Time unavailable',
                  location: playdate.location || 'Location not specified',
                  attendees: 1,
                  families: 1,
                  status: 'pending' as const,
                  host: playdate.profiles?.parent_name || 'Unknown Host'
                };
              }
            });
            
            setUpcomingPlaydates(formattedPlaydates);
          }
        } catch (err) {
          console.error("Error fetching playdates:", err);
          // Continue with other fetches even if playdates fail
        }
        
        try {
          const { data: potentialConnections, error: connectionsError } = await supabase
            .from('profiles')
            .select('*, children(*)')
            .neq('id', user.id)
            .limit(5);

          if (connectionsError) {
            console.error("Error fetching potential connections:", connectionsError);
            throw connectionsError;
          }

          if (potentialConnections) {
            console.log("Fetched potential connections:", potentialConnections);
            
            const filteredConnections = potentialConnections.filter(connection => {
              return !isConnected(connection.id) && !hasPendingRequest(connection.id);
            });

            const formattedConnections = filteredConnections.map(connection => {
              const firstChild = connection.children && connection.children.length > 0 
                ? connection.children[0] 
                : null;
                
              const childDisplay = firstChild 
                ? `${firstChild.name} (${firstChild.age})` 
                : 'No children';
                
              const parentInterests = connection.interests || ['Arts & Crafts', 'Nature'];
                
              const locationDisplay = connection.city || connection.location || 'Nearby';
                
              return {
                id: connection.id,
                name: connection.parent_name || 'Anonymous',
                childName: childDisplay,
                interests: parentInterests,
                distance: locationDisplay
              };
            });
            
            setSuggestedConnections(formattedConnections.slice(0, 3));
          } else {
            // Fallback to some default sample data if no connections are found
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
          }
        } catch (err) {
          console.error("Error fetching connections:", err);
          // Set fallback data
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
            }
          ]);
        }
        
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
  }, [user, profile, isConnected, hasPendingRequest]);

  // Initial data loading
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
    
    fetchDashboardData();
  }, [user, profile, profileLoading, profileError, fetchDashboardData]);

  return {
    loading: loading || profileLoading,
    error,
    profile,
    children,
    upcomingPlaydates,
    suggestedConnections,
    nearbyEvents,
    refreshData: fetchDashboardData
  };
};
