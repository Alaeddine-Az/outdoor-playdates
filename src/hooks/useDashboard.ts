
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useFetchPlaydates } from './dashboard/useFetchPlaydates';
import { useFetchConnections } from './dashboard/useFetchConnections';
import { useFetchEvents } from './dashboard/useFetchEvents';
import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  loading?: boolean;
  error?: string | null;
}

export const useDashboard = (userLocation?: LocationData) => {
  const { user } = useAuth();
  const { profile, children, loading: profileLoading, error: profileError } = useProfile();

  // Compose custom hooks
  const {
    loading: playdatesLoading,
    upcomingPlaydates,
    nearbyPlaydates,
    error: playdatesError
  } = useFetchPlaydates(userLocation);

  const {
    loading: connectionsLoading,
    suggestedConnections,
    error: connectionsError
  } = useFetchConnections(user?.id);

  const {
    loading: eventsLoading,
    nearbyEvents,
    error: eventsError
  } = useFetchEvents();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(
      profileLoading ||
      playdatesLoading ||
      connectionsLoading ||
      eventsLoading
    );
  }, [profileLoading, playdatesLoading, connectionsLoading, eventsLoading]);

  useEffect(() => {
    setError(profileError || playdatesError || connectionsError || eventsError || null);
  }, [profileError, playdatesError, connectionsError, eventsError]);

  return {
    loading,
    error,
    profile,
    children,
    upcomingPlaydates,
    nearbyPlaydates,
    suggestedConnections,
    nearbyEvents
  };
};
