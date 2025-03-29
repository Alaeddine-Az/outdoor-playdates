import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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

  if (error) {
    return (
      <div className="animate-fade-in min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Unable to load dashboard</h2>
        <p className="text-muted-foreground mb-6">There was a problem retrieving your information.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const childrenWithAges = children?.map(child => ({ name: child.name, age: child.age })) || [];
  const interests = profile?.interests || ['Arts & Crafts', 'Nature', 'STEM'];

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-sky-100 to-green-100 mb-10 shadow-md">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-[200px] bg-sky-200 rounded-b-[80%]"></div>
          <div className="absolute bottom-0 left-0 w-full h-[120px] bg-green-300 rounded-t-[70%]"></div>
          <div className="absolute top-6 right-6 w-16 h-16 bg-yellow-300 rounded-full shadow-md"></div>
          <div className="absolute top-12 right-24 w-16 h-8 bg-white rounded-full animate-float-slow"></div>
          <div className="absolute top-16 left-10 w-24 h-10 bg-white rounded-full animate-float-medium"></div>
        </div>

        <div className="relative z-10 px-6 md:px-10 py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-playful mb-2">
            Welcome back, {profile?.parent_name?.split(' ')[0] || 'Friend'}!
          </h1>
          <p className="text-lg text-muted-foreground font-playful">
            Here’s what’s happening with your playdates and connections.
          </p>
          <div className="absolute bottom-6 right-6">
            <Button
              className="rounded-full bg-yellow-300 hover:bg-yellow-400 text-black font-semibold shadow-md"
              onClick={() => navigate('/parent-profile')}
            >
              Edit Profile
            </Button>
          </div>
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
  );
};

export default Dashboard;
