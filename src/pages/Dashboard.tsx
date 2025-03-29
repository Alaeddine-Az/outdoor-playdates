""import React, { useEffect } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '@/components/ui/button';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

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

  const parentName = profile?.parent_name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8 px-4 md:px-8 py-4 md:py-8">
      {/* Hero Section */}
      <section className="relative w-full rounded-3xl overflow-hidden" style={{ backgroundColor: '#CEEBF0' }}>
        {/* Sky / Cloud Shape */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,100 C150,200 650,0 800,100 L800,0 L0,0 Z" fill="#CEEBF0" />
          </svg>
        </div>

        {/* Sun */}
        <div className="absolute top-4 right-6 w-16 h-16 bg-[#F9DA6F] rounded-full animate-pulse-slow" />

        {/* Cloud */}
        <div className="absolute top-8 left-4 w-24 h-10 bg-white rounded-full opacity-70 blur-sm animate-float-slow" />

        {/* Content */}
        <div className="relative z-10 p-6 md:p-10 space-y-2 font-rounded">
          <h1 className="text-3xl md:text-5xl font-extrabold text-black">Welcome back, {parentName}!</h1>
          <p className="text-md md:text-lg text-black">Here's what's happening with your playdates and connections.</p>
        </div>

        {/* Ground */}
        <div className="w-full h-20 md:h-28 bg-[#73C770] rounded-t-[3rem]" />

        {/* Button */}
        <div className="absolute bottom-6 right-6">
          <Button
            onClick={() => navigate('/parent-profile')}
            className="bg-[#F9DA6F] text-black text-base font-semibold px-6 py-3 rounded-full transition-transform hover:scale-105"
          >
            Edit Profile
          </Button>
        </div>
      </section>

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
          <SuggestedConnections connections={suggestedConnections} />
          <NearbyEvents events={nearbyEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
