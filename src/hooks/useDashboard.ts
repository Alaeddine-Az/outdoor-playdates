
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { PlaydateData, ConnectionData, LocationData, DashboardData } from '@/types/dashboard';
import { DashboardEvent } from '@/types';
import { fetchPlaydates } from '@/services/playdateService';
import { fetchSuggestedConnections } from '@/services/connectionService';
import { fetchNearbyEvents } from '@/services/eventService';

export const useDashboard = (userLocation?: LocationData) => {
  const { user } = useAuth();
  const { profile, children, loading: profileLoading, error: profileError } = useProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    upcomingPlaydates: [],
    nearbyPlaydates: [],
    suggestedConnections: [],
    nearbyEvents: []
  });

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
          // Run all data fetching in parallel
          const [playdatesResult, suggestedConnections, nearbyEvents] = await Promise.all([
            fetchPlaydates(userLocation),
            fetchSuggestedConnections(user.id),
            fetchNearbyEvents()
          ]);

          setDashboardData({
            upcomingPlaydates: playdatesResult.upcomingPlaydates,
            nearbyPlaydates: playdatesResult.nearbyPlaydates,
            suggestedConnections,
            nearbyEvents
          });
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
    upcomingPlaydates: dashboardData.upcomingPlaydates,
    nearbyPlaydates: dashboardData.nearbyPlaydates,
    suggestedConnections: dashboardData.suggestedConnections,
    nearbyEvents: dashboardData.nearbyEvents
  };
};
