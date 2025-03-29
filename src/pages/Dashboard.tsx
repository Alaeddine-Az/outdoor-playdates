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
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Unable to load dashboard</h2>
        <p className="text-muted-foreground mb-6">There was a problem retrieving your information.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const childrenWithAges = children?.map(child => ({ name: child.name, age: child.age })) || [];
  const interests = profile?.interests || ['Arts & Crafts', 'Nature', 'STEM'];

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      {/* Hero section */}
      <section className="relative bg-[#CEEBF0] rounded-3xl overflow-hidden p-6 md:p-10" style={{ fontFamily: '"Baloo 2", cursive' }}>
        {/* Sun Emoji */}
        <div className="absolute top-4 right-4 text-4xl md:text-5xl animate-bounce">
          🌞
        </div>

        {/* Welcome text */}
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 text-left">
            Welcome back, {profile?.parent_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-lg text-black text-left">
            Here's what's happening with your playdates and connections.
          </p>
        </div>

        {/* Edit Profile Button */}
        <div className="absolute bottom-4 right-4">
          <Button 
            className="bg-[#F9DA6F] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#f7cd49] transition"
            onClick={() => navigate('/parent-profile')}
          >
            Edit Profile
          </Button>
        </div>

        {/* Decorative cloud */}
        <div className="absolute top-6 left-6 w-16 h-10 bg-white rounded-full opacity-80 blur-sm" />

        {/* Green hill */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-[#73C770] rounded-t-[50%]" />
      </section>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
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
    </div>
  );
};

export default Dashboard;
