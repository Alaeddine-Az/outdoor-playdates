
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';
import { useDashboard } from '@/hooks/useDashboard';
import { toast } from '@/components/ui/use-toast';
import { Pencil, RefreshCcw, AlertTriangle } from 'lucide-react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const {
    loading,
    profile,
    children,
    upcomingPlaydates,
    suggestedConnections,
    nearbyEvents,
    error,
    refreshData
  } = useDashboard();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Dashboard Error',
        description: 'There was a problem loading your dashboard data. Please try refreshing.',
        variant: 'destructive',
      });
    }
  }, [error]);

  const handleRefresh = async () => {
    setIsCheckingConnection(true);
    
    try {
      // Check connection to Supabase first
      const { connected } = await checkSupabaseConnection();
      
      if (connected) {
        await refreshData();
        toast({
          title: 'Dashboard Updated',
          description: 'Your dashboard data has been refreshed.',
        });
      } else {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the server. Please check your internet connection.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error refreshing dashboard:', err);
      toast({
        title: 'Refresh Failed',
        description: 'Could not refresh dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  if (error) {
    return (
      <div className="animate-fade-in min-h-[60vh] flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-4 text-amber-500">
          <AlertTriangle size={36} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Unable to load dashboard</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          There was a problem retrieving your information. This may be due to a network issue or server problem.
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={handleRefresh} 
            disabled={isCheckingConnection}
            className="flex items-center gap-2"
          >
            {isCheckingConnection ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => navigate('/playdates')}>
            Go to Playdates
          </Button>
        </div>
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
        className="relative bg-[#CEEBF0] rounded-3xl overflow-hidden mb-8 px-6 py-8"
        style={{ height: '240px', fontFamily: '"Baloo 2", cursive' }}
      >
        {/* Sky Background */}
        <div className="absolute inset-0 bg-[#CEEBF0]" />

        {/* Sun Emoji */}
        <div className="absolute top-6 right-6 text-4xl z-30">🌞</div>

        {/* Cloud */}
        <div className="absolute top-8 left-6 w-24 h-24 bg-white rounded-full opacity-90 z-20" />

        {/* Parallax Hills */}
        <div className="absolute bottom-0 w-[110%] left-[-5%] h-[80px] bg-[#D4F7D3] rounded-t-[50%] z-0" />
        <div className="absolute bottom-0 w-[110%] left-[-5%] h-[70px] bg-[#A5E4A2] rounded-t-[50%] z-10 translate-y-[6px]" />
        <div className="absolute bottom-0 w-[110%] left-[-5%] h-[60px] bg-[#73C770] rounded-t-[50%] z-20 translate-y-[12px]" />

        {/* Text */}
        <div className="relative z-30 text-left mt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-2">
            Welcome back, {profile?.parent_name?.split(' ')[0] || 'Friend'}!
          </h1>
          <p className="text-md md:text-lg text-black">
            Here&apos;s what&apos;s happening with your playdates and connections.
          </p>
        </div>

        {/* Edit Profile Button - Mobile */}
        <div className="absolute bottom-4 right-4 md:hidden z-30">
          <Button
            size="icon"
            className="bg-[#F9DA6F] text-black hover:brightness-110 w-12 h-12 rounded-full"
            onClick={() => navigate('/parent-profile')}
          >
            <Pencil className="w-5 h-5" />
          </Button>
        </div>

        {/* Edit Profile Button - Desktop */}
        <div className="hidden md:block absolute bottom-6 left-6 z-30">
          <Button
            className="bg-[#F9DA6F] text-black font-semibold px-5 py-2 rounded-full hover:brightness-110"
            onClick={() => navigate('/parent-profile')}
          >
            Edit Profile
          </Button>
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

      {/* Refresh Button for Data Issues */}
      {!loading && (upcomingPlaydates.length === 0 || suggestedConnections.length === 0) && (
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isCheckingConnection}
          >
            {isCheckingConnection ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                Refresh Dashboard
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
