import React, { useEffect } from 'react';
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

  const childrenWithAges = children?.map(child => ({ name: child.name, age: child.age })) || [];
  const interests = profile?.interests || ['Arts & Crafts', 'Nature', 'STEM'];

  return (
    <AppLayoutWrapper>
      <div className="animate-fade-in px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#CEEBF0] pb-8 pt-6 sm:pt-10 mb-10">
          <div className="absolute bottom-0 left-0 w-full h-24 bg-[#73C770] rounded-t-[50%]" />
          <div className="absolute top-6 left-6 w-16 h-10 bg-white rounded-full animate-cloud float-left" />
          <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-[#F9DA6F] animate-pulse" />

          <div className="relative z-10 px-6 sm:px-10">
            <h1 className="text-4xl font-bold font-[Baloo_2] text-black mb-2">
              Welcome back, {profile?.parent_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-lg text-black font-[Baloo_2]">
              Here's what's happening with your playdates and connections.
            </p>
          </div>

          <div className="absolute bottom-4 right-4 z-10">
            <Button className="bg-[#F9DA6F] text-black font-semibold rounded-full px-6 py-3 hover:brightness-95">
              Edit Profile
            </Button>
          </div>
        </div>

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
            <div className="md:col-span-2 space-y-6">
              <PlaydatesList
                title="Upcoming Playdates"
                playdates={upcomingPlaydates}
                showNewButton={true}
                viewAllLink="/playdates"
              />
            </div>
            <div className="space-y-6">
              <ProfileSummary name={profile?.parent_name || 'User'} children={childrenWithAges} interests={interests} />
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
