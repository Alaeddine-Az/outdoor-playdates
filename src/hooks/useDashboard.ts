
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useConnections } from '@/hooks/useConnections';
import { ParentProfile, ChildProfile, ProfileWithChildren } from '@/types';

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
  const { loading: connectionsLoading, connectionProfiles, isConnected, hasPendingRequest } = useConnections();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingPlaydates, setUpcomingPlaydates] = useState<PlaydateData[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<EventData[]>([]);
  const [suggestedProfiles, setSuggestedProfiles] = useState<ProfileWithChildren[]>([]);

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
        console.log("Profile data:", profile);
        
        setLoading(true);
        
        if (user) {
          // Fetch playdates with proper error handling
          try {
            const { data: playdatesData, error: playdatesError } = await supabase
              .from('playdates')
              .select('*, playdate_participants(*), profiles:creator_id(parent_name, id)') 
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
                  const hostId = playdate.profiles?.id || null;
                  
                  return {
                    id: playdate.id,
                    title: playdate.title || 'Untitled Playdate',
                    date: dateStr,
                    time: `${startTimeStr}${endTimeStr ? ` - ${endTimeStr}` : ''}`,
                    location: playdate.location || 'Location not specified',
                    attendees: attendees,
                    families: attendees,
                    status: status,
                    host: hostName,
                    host_id: hostId
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
                    host: playdate.profiles?.parent_name || 'Unknown Host',
                    host_id: playdate.profiles?.id || null
                  };
                }
              });
              
              setUpcomingPlaydates(formattedPlaydates || []);
            }
          } catch (error) {
            console.error("Error in playdates fetch block:", error);
            setUpcomingPlaydates([]);
          }

          // Fetch suggested profiles with proper error handling
          try {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('*')
              .neq('id', user.id)
              .limit(5);
              
            if (profilesError) {
              console.error("Error fetching profiles:", profilesError);
              throw profilesError;
            }

            // Filter out profiles the user is already connected to or has sent a request to
            if (profilesData && Array.isArray(profilesData)) {
              const filteredProfiles = profilesData.filter(profile => {
                return profile && profile.id && 
                  typeof isConnected === 'function' && 
                  typeof hasPendingRequest === 'function' &&
                  !isConnected(profile.id) && 
                  !hasPendingRequest(profile.id);
              });
              
              // Create an array to hold profiles with their children
              const profilesWithChildren: ProfileWithChildren[] = [];
              
              // Fetch children for each profile
              for (const profile of filteredProfiles) {
                if (profile && profile.id) {
                  try {
                    const { data: childrenData, error: childrenError } = await supabase
                      .from('children')
                      .select('*')
                      .eq('parent_id', profile.id);
                    
                    if (childrenError) {
                      console.error("Error fetching children for profile:", profile.id, childrenError);
                      continue;
                    }
                    
                    // Add profile with its children to the array
                    profilesWithChildren.push({
                      ...profile,
                      childrenData: childrenData || []
                    });
                  } catch (childErr) {
                    console.error("Exception fetching children for profile:", profile.id, childErr);
                  }
                }
              }
              
              setSuggestedProfiles(profilesWithChildren || []);
            } else {
              setSuggestedProfiles([]);
            }
          } catch (error) {
            console.error("Error in profiles fetch block:", error);
            setSuggestedProfiles([]);
          }
        }
        
        // Nearby events - kept as hardcoded for now but could be replaced with real data
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
        
        setError(null);
        setLoading(false);
      } catch (err: any) {
        console.error("Error loading dashboard data:", err);
        setError(err?.message || "Failed to load dashboard data");
        
        // Set fallback values to prevent UI from breaking
        setUpcomingPlaydates([]);
        setSuggestedProfiles([]);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile, profileLoading, profileError, isConnected, hasPendingRequest]);

  return {
    loading: loading || profileLoading || connectionsLoading,
    error,
    profile,
    children,
    upcomingPlaydates,
    nearbyEvents,
    suggestedProfiles
  };
};
