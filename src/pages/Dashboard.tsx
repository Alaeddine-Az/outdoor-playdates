import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';
import { useDashboard } from '@/hooks/useDashboard';
import { toast } from '@/components/ui/use-toast';
import bearImg from '@/assets/mascot-bear.png'; // Cute bear illustration
import heroBg from '@/assets/dashboard-hero-bg.svg'; // Optional background SVG

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
        description: 'There was a problem loading your dashboard. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error]);

  const childrenWithAges = children?.map((child) => ({
    name: child.name,
    age: child.age,
  })) || [];

  const interests = profile?.interests || ['Arts & Crafts', 'Nature', 'STEM'];

  return (
    <div className="animate-fade-in p-4 md:p-6">
      {/* Hero section */}
      <div
        className="relative rounded-3xl p-6 pb-20 overflow-hidden bg-gradient-to-b from-sky-100 to-sky-50 shadow-md mb-8"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover' }}
      >
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {profile?.parent_name?.split(' ')[0] || 'Explorer'}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Here’s what’s happening with your playdates and connections.
          </p>
        </div>
        <img
          src={bearImg}
          alt="Friendly mascot bear"
          className="absolute bottom-0 right-4 w-40 md:w-56 drop-shadow-md"
        />
      </div>

      {loading ? (
        <div className="space-y-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-4 w-full max-w-md mb-8" />
          <Skeleton className="h-96 w-full rounded-xl" />
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
