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
import { Pencil } from 'lucide-react';

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
      <section className="relative bg-[#CEEBF0] rounded-3xl overflow-hidden mb-8" style={{ height: '220px', fontFamily: '"Baloo 2", cursive' }}>
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-24 h-16 bg-white rounded-full top-8 left-6 opacity-90 animate-cloud" />
          <div className="absolute text-4xl sm:text-6xl top-4 left-4">🌞</div>
          <div className="absolute bottom-0 w-full h-[60px] bg-[#A8E6A1] rounded-t-[100%]" />
          <div className="absolute bottom-0 w-full h-[40px] bg-[#73C770] rounded-t-[100%]" />
        </div>

        {/* Text & Button */}
        <div className="relative z-10 h-full flex flex-col justify-center text-left px-6 pt-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black mb-1">
            Welcome back, {profile?.parent_name?.split(' ')[0] || 'Test'}!
          </h1>
          <p className="text-base sm:text-lg text-black mb-3">
            Here's what's happening with your playdates and connections.
          </p>
          <div className="absolute right-4 bottom-4 sm:static sm:mt-auto sm:self-start">
            <Button
              className="bg-[#F9DA6F] text-black p-3 sm:px-5 sm:py-2 rounded-full hover:brightness-110 transition"
              onClick={() => navigate('/parent-profile')}
            >
              <span className="sm:hidden">
                <Pencil className="w-5 h-5" />
              </span>
              <span className="hidden sm:inline">Edit Profile</span>
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
