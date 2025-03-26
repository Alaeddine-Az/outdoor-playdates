
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

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
    
    // In a real app, this would fetch data from Supabase
    // For now, we'll use mock data
    const fetchDashboardData = async () => {
      try {
        console.log("Loading dashboard data for user:", user?.id);
        console.log("Profile data:", profile);
        
        // Simulate loading
        setLoading(true);
        
        setTimeout(() => {
          // Mock upcoming playdates
          setUpcomingPlaydates([
            {
              id: '1',
              title: 'Park Playdate with Oliver & Sophia',
              date: 'Today',
              time: '3:00 PM - 5:00 PM',
              location: 'Central Park Playground',
              attendees: 2,
              status: 'upcoming'
            },
            {
              id: '2',
              title: 'Swimming Lessons Group',
              date: 'Tomorrow',
              time: '10:00 AM - 11:30 AM',
              location: 'Community Pool',
              attendees: 4,
              status: 'upcoming'
            },
            {
              id: '3',
              title: 'STEM Museum Field Trip',
              date: 'Jun 18',
              time: '1:00 PM - 4:00 PM',
              location: 'Science Discovery Museum',
              attendees: 3,
              status: 'pending'
            }
          ]);
          
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
        }, 500);
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
