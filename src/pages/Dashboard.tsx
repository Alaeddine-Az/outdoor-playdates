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
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const childrenWithAges = children?.map(child => ({
    name: child.name,
    age: child.age
  })) || [];

  const interests = profile?.interests || ['Arts & Crafts', 'Nature', 'STEM'];

  return (
    <div className="animate-fade-in px-4 py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section
        className="relative bg-[#CEEBF0] rounded-3xl overflow-hidden mb-8"
        style={{ height: '280px', fontFamily: '"Baloo 2", cursive' }}
      >
        {/* Sky Background */}
        <div className="absolute inset-0 bg-[#CEEBF0]">
          {/* Clouds */}
          <div className="absolute w-24 h-16 bg-white rounded-full top-10 left-10 opacity-90 animate-cloud" />
          <div className="absolute w-16 h-10 bg-white rounded-full top-[60px] left-[100px] opacity-70 blur-sm" />
          <div className="absolute w-20 h-12 bg-white rounded-full top-[90px] left-[200px] opacity-70 blur-sm" />

          {/* Big Sun Emoji */}
          <div className="absolute text-6xl top-4 right-6 animate-bounce-sun">☀️</div>
        </div>

        {/* Green Hills */}
        <div className="absolute bottom-0 w-full h-[80px] bg-[#73C770] rounded-t-[100%]" />
        <div className="absolute bottom-0 left-[10%] w-[80px] h-[40px] bg-[#73C770] rounded-full opacity-80 blur-sm" />
        <div className="absolute bottom-0 left-[40%] w-[100px] h-[50px] bg-[#73C770] rounded-full opacity-90 blur-sm" />

        <div className="relative z-10 h-full px-6 py-8 flex flex-col justify-start">
          {/* Lowered Text */}
          <div className="mt-10 text-left">
            <h1 className="text-4xl font-extrabold text-black mb-2">
              Welcome back, {profile?.parent_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-lg text-black">
              Here&apos;s what&apos;s happening with your playdates and connections.
            </p>
          </div>

          {/* Button - bottom right */}
          <div className="absolute bottom-6 right-6">
            <Button
              className="bg-[#F9DA6F] text-black font-semibold px-5 py-2 rounded-full hover:brightness-110"
              onClick={() => navigate('/parent-profile')}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      {loading ? (
        <div className="space-y-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-4 w-full max-w-md mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
  );
};

export default Dashboard;
