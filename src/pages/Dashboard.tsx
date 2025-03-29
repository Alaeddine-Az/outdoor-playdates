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

  return (
    <div className="relative animate-fade-in p-4 sm:p-6 lg:p-8">
      {/* Playful Background Elements */}
      <div className="absolute top-[10%] left-[5%] w-[20%] h-[20%] bg-play-orange/10 rounded-full filter blur-3xl z-0"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[25%] h-[25%] bg-play-blue/10 rounded-full filter blur-3xl z-0"></div>

      {/* Bear Illustration */}
      <div className="absolute top-4 right-4 z-10">
        <img
          src="/images/bear-wave.png"
          alt="Bear waving"
          className="w-20 h-20"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
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
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Welcome back, {profile?.parent_name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Here's what's happening with your playdates and connections.
              </p>
            </header>

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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
