import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useDashboard';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';
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

  const childrenWithAges = children?.map(child => ({
    name: child.name,
    age: child.age
  })) || [];

  const interests = profile?.interests || ['Arts & Crafts', 'Nature', 'STEM'];

  return (
    <div className="space-y-10">
      {/* Playful Hero Header */}
      <section className="relative rounded-3xl px-6 pt-10 pb-20 md:px-12 overflow-hidden bg-[#CEEBF0] min-h-[320px] md:min-h-[420px]">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <svg
            className="absolute top-4 right-4 w-16 h-16 animate-[pulse_6s_infinite]"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" fill="#F9DA6F" />
          </svg>
          <svg
            className="absolute top-10 left-8 w-28 h-12 animate-[float_6s_ease-in-out_infinite]"
            viewBox="0 0 120 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="60" cy="30" rx="50" ry="20" fill="white" />
          </svg>
          <svg
            className="absolute top-20 right-20 w-24 h-10 animate-[float_8s_ease-in-out_infinite]"
            viewBox="0 0 120 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="60" cy="30" rx="45" ry="18" fill="white" />
          </svg>
          <div className="absolute bottom-0 left-0 w-full h-[120px] md:h-[160px] bg-[#73C770] rounded-t-[80%]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold font-["Baloo 2",cursive] text-black mb-4">
            Welcome back, {profile?.parent_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-lg md:text-xl text-black font-["Baloo 2",cursive]">
            Here’s what’s happening with your playdates and connections.
          </p>

          <div className="absolute bottom-6 right-6">
            <Button onClick={() => navigate('/parent-profile')} className="bg-[#F9DA6F] text-black font-semibold px-5 py-2 rounded-full text-sm">
              Edit Profile
            </Button>
          </div>
        </div>
      </section>

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
