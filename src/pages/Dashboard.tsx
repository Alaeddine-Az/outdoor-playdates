import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';
import { useDashboard } from '@/hooks/useDashboard';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    loading,
    profile,
    children,
    upcomingPlaydates,
    suggestedConnections,
    nearbyEvents,
    error,
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

  if (error) {
    return (
      <AppLayoutWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load dashboard</h2>
          <p className="text-muted-foreground mb-6">
            There was a problem retrieving your information.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </AppLayoutWrapper>
    );
  }

  const childrenWithAges = children?.map((child) => ({
    name: child.name,
    age: child.age,
  })) || [];

  const interests = profile?.interests || ['Arts & Crafts', 'Nature', 'STEM'];

  return (
    <AppLayoutWrapper>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {profile?.parent_name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Here's what's happening with your playdates and connections.
            </p>
          </div>

          <Button
            className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
            onClick={() => navigate('/create-playdate')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Playdate
          </Button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="space-y-8">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left / Main Section */}
            <div className="md:col-span-2 space-y-6">
              <PlaydatesList
                title="Upcoming Playdates"
                playdates={upcomingPlaydates}
                showNewButton={false}
                viewAllLink="/playdates"
              />
            </div>

            {/* Right / Sidebar */}
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
        )}
      </div>
    </AppLayoutWrapper>
  );
};

export default Dashboard;
