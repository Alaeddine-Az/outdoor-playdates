
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import BearCharacter from '@/components/characters/BearCharacter';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    loading,
    profile,
    children,
    upcomingPlaydates,
    suggestedConnections,
    nearbyEvents,
    error
  } = useDashboard();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Dashboard Error',
        description: 'There was a problem loading your dashboard data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error]);

  if (!user) return null;

  const childrenWithAges = children?.map(child => ({
    name: child.name,
    age: child.age
  })) || [];

  const interests = profile?.interests || ['Arts & Crafts', 'Nature', 'STEM'];

  // Convert upcomingPlaydates to the format expected by PlaydatesList
  const formattedPlaydates = upcomingPlaydates.map(playdate => ({
    id: playdate.id,
    title: playdate.title,
    date: playdate.date,
    time: playdate.time,
    location: playdate.location,
    families: playdate.attendees, // Map attendees to families
    status: playdate.status
  }));

  if (loading) {
    return (
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-full max-w-md mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex items-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 mr-4">
          Welcome back, {profile?.parent_name?.split(' ')[0] || 'User'}!
        </h1>
        <BearCharacter animation="wave" size="sm" className="hidden sm:block" />
      </header>
      
      <p className="text-muted-foreground text-lg mb-8">
        Here's what's happening with your playdates and connections.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <PlaydatesList
            title="Upcoming Playdates"
            playdates={formattedPlaydates}
            showNewButton={true}
            viewAllLink="/playdates"
          />
        </div>

        <div className="space-y-6">
          <ProfileSummary
            name={profile?.parent_name || 'User'}
            children={childrenWithAges}
            interests={interests}
          />

          <SuggestedConnections connections={suggestedConnections} />

          <NearbyEvents events={nearbyEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
