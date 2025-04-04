import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useConnections } from '@/hooks/useConnections';
import { ProfileWithChildren } from '@/types';

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

interface EventData {
  title: string;
  date: string;
  location: string;
}

export const useDashboard = () => {
  const { user } = useAuth();
  const {
    profile,
    children,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  const {
    loading: connectionsLoading,
    isConnected,
    hasPendingRequest,
    error: connectionsError,
  } = useConnections();

  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upcomingPlaydates, setUpcomingPlaydates] = useState<PlaydateData[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<EventData[]>([]);
  const [suggestedProfiles, setSuggestedProfiles] = useState<ProfileWithChildren[]>([]);

  // 🧪 Emergency fallback if loading gets stuck
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!initialLoadDone) {
        console.warn('⏳ Forcing initialLoadDone after timeout');
        setInitialLoadDone(true);
        setLoading(false);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  // 🧪 Debug logs
  useEffect(() => {
    console.log('🔥 useDashboard INIT');
    console.log('user:', user);
    console.log('profile:', profile);
    console.log('profileLoading:', profileLoading);
    console.log('connectionsError:', connectionsError);
  }, [user, profile, profileLoading, connectionsError]);

  useEffect(() => {
    console.log('📦 useDashboard effect triggered');

    if (profileError || connectionsError) {
      console.error('❌ Dashboard Error:', profileError || connectionsError);
      setError(profileError || connectionsError);
      setLoading(false);
      setInitialLoadDone(true);
      return;
    }

    if (!user) {
      console.warn('⚠️ No user found. Cannot load dashboard.');
      setError('User not authenticated');
      setLoading(false);
      setInitialLoadDone(true);
      return;
    }

    if (profileLoading) {
      console.log('⏳ Profile still loading...');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('✅ Fetching dashboard data...');

        // Fetch playdates
        const { data: playdatesData, error: playdatesError } = await supabase
          .from('playdates')
          .select('*, playdate_participants(*), profiles:creator_id(parent_name, id)')
          .order('created_at', { ascending: false });

        if (playdatesError) throw playdatesError;

        const formattedPlaydates = (playdatesData || []).map(playdate => {
          const startDate = new Date(playdate.start_time);
          const endDate = new Date(playdate.end_time);
          const isValidDate = !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());

          let dateStr = 'Date unavailable';
          let startTimeStr = 'Time unavailable';
          let endTimeStr = '';

          if (isValidDate) {
            dateStr = startDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            startTimeStr = startDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
            endTimeStr = endDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
          }

          let status: 'upcoming' | 'pending' | 'completed' = 'pending';
          const now = new Date();
          if (isValidDate) {
            if (startDate > now) status = 'upcoming';
            else if (endDate < now) status = 'completed';
          }

          return {
            id: playdate.id,
            title: playdate.title || 'Untitled Playdate',
            date: dateStr,
            time: `${startTimeStr}${endTimeStr ? ` - ${endTimeStr}` : ''}`,
            location: playdate.location || 'Location not specified',
            attendees: 1,
            families: 1,
            status,
            host: playdate.profiles?.parent_name || 'Unknown Host',
            host_id: playdate.profiles?.id || null,
          };
        });

        setUpcomingPlaydates(formattedPlaydates);

        // Fetch suggested profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .limit(5);

        if (profilesError) throw profilesError;

        const filteredProfiles = (profilesData || []).filter(profile =>
          profile?.id &&
          typeof isConnected === 'function' &&
          typeof hasPendingRequest === 'function' &&
          !isConnected(profile.id) &&
          !hasPendingRequest(profile.id)
        );

        const profilesWithChildren: ProfileWithChildren[] = [];

        for (const profile of filteredProfiles) {
          try {
            const { data: childrenData, error: childrenError } = await supabase
              .from('children')
              .select('*')
              .eq('parent_id', profile.id);

            if (childrenError) continue;

            profilesWithChildren.push({
              ...profile,
              childrenData: childrenData || [],
            });
          } catch (childErr) {
            console.error("Error fetching children for profile:", profile.id, childErr);
          }
        }

        setSuggestedProfiles(profilesWithChildren);

        // Nearby events (placeholder)
        setNearbyEvents([
          { title: 'Community Playground Day', date: 'Jun 17', location: 'City Central Park' },
          { title: 'Kids\' Science Fair', date: 'Jun 24', location: 'Public Library' },
        ]);

        setError(null);
      } catch (err: any) {
        console.error('❌ Error loading dashboard data:', err);
        setError(err?.message || 'Failed to load dashboard data');
        setUpcomingPlaydates([]);
        setSuggestedProfiles([]);
      } finally {
        console.log('✅ Dashboard data fetch complete');
        setLoading(false);
        setInitialLoadDone(true);
      }
    };

    fetchDashboardData();
  }, [
    user,
    profile,
    profileLoading,
    profileError,
    isConnected,
    hasPendingRequest,
    connectionsError,
  ]);

  return {
    loading: !initialLoadDone || loading || profileLoading || connectionsLoading,
    error,
    profile,
    children,
    upcomingPlaydates,
    nearbyEvents,
    suggestedProfiles,
  };
};
