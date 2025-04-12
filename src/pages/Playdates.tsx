import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Sparkles, PartyPopper, CalendarDays, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlaydates } from '@/hooks/usePlaydates';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import PlaydateList from '@/components/playdates/PlaydateList';
import PlaydateSidebar from '@/components/playdates/PlaydateSidebar';
import { useUserLocation } from '@/hooks/useUserLocation';

const Playdates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useUserLocation();
  
  // Debug location data only when it changes, not on every render
  useEffect(() => {
    console.log("Location data in Playdates component:", {
      latitude: location.latitude,
      longitude: location.longitude,
      loading: location.loading,
      error: location.error
    });
  }, [location.latitude, location.longitude, location.loading, location.error]);
  
  const { allPlaydates, myPlaydates, pastPlaydates, nearbyPlaydates, loading, error } = usePlaydates({
    userLocation: location,
    maxDistance: 10
  });
  
  // Only log when playdate data actually changes
  useEffect(() => {
    if (!loading) {
      console.log("Playdates data loaded:", {
        all: allPlaydates?.length || 0,
        my: myPlaydates?.length || 0,
        past: pastPlaydates?.length || 0,
        nearby: nearbyPlaydates?.length || 0,
        hasError: !!error,
        errorDetails: error || 'None'
      });
    }
    
    if (error) {
      console.error("Error loading playdates:", error);
      toast({
        title: "Error Loading Playdates",
        description: "There was a problem loading the playdates. Please try again later.",
        variant: "destructive"
      });
    }
  }, [allPlaydates, myPlaydates, pastPlaydates, nearbyPlaydates, error, loading]);
  
  if (!user) {
    toast({
      title: "Authentication required",
      description: "You need to sign in to view playdates",
      variant: "destructive"
    });
    navigate('/auth');
    return null;
  }

  const hasLocation = !location.loading && location.latitude !== null && location.longitude !== null;
  const showLocationError = !location.loading && location.error;
  const hasNearbyPlaydates = nearbyPlaydates && nearbyPlaydates.length > 0;

  return (
    <div className="animate-fade-in">
      <header className="mb-8 relative overflow-hidden bg-gradient-to-r from-secondary/20 via-primary/10 to-accent/20 rounded-2xl p-6 shadow-soft">
        <div className="absolute top-0 right-0 opacity-10">
          <PartyPopper className="h-40 w-40 text-primary rotate-12" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-10">
          <CalendarDays className="h-32 w-32 text-secondary -rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Playdates</h1>
              <Sparkles className="h-6 w-6 text-secondary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg max-w-xl">
              Schedule fun adventures, find playmates, and create memorable experiences for your children
            </p>
          </div>
          <Button 
            className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl bounce-hover"
            onClick={() => navigate('/create-playdate')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Playdate
          </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-up-stagger">
        {/* Main content area */}
        <div className="md:col-span-2 space-y-6">
          {hasLocation && (
            <>
              {hasNearbyPlaydates ? (
                <PlaydateList
                  title="Playdates Near You"
                  playdates={nearbyPlaydates}
                  loading={loading}
                  error={error}
                  emptyTitle="No nearby playdates"
                  emptyMessage="There are no playdates within 10km of your current location."
                  showCreateButton={true}
                  icon={<Navigation className="h-5 w-5 text-blue-500" />}
                />
              ) : (
                <PlaydateList
                  title="Playdates Near You"
                  playdates={[]}
                  loading={loading}
                  error={error}
                  emptyTitle="No playdates nearby"
                  emptyMessage="There are no playdates within 10km of your location. Create one to get started!"
                  showCreateButton={true}
                  icon={<Navigation className="h-5 w-5 text-blue-500" />}
                />
              )}
            </>
          )}
          
          {showLocationError && (
            <div className="bg-white rounded-xl shadow-soft border border-muted p-6 mb-6">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-500" />
                Location Access Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Enable location access to see playdates near you. We use your location to show you relevant playdates in your area.
              </p>
              <Button onClick={location.refreshLocation} className="bg-blue-500 hover:bg-blue-600 text-white">
                Enable Location Access
              </Button>
            </div>
          )}
          
          <PlaydateList
            title="Upcoming Playdates"
            playdates={allPlaydates || []}
            loading={loading}
            error={error}
            emptyTitle="No upcoming playdates"
            emptyMessage="There are no upcoming playdates in your area."
            showCreateButton={true}
          />
          
          <PlaydateList
            title="My Scheduled Playdates"
            playdates={myPlaydates || []}
            loading={loading}
            error={error}
            emptyTitle="No scheduled playdates"
            emptyMessage="You haven't created any playdates yet."
            showCreateButton={true}
          />
          
          <PlaydateList
            title="Past Playdates"
            playdates={pastPlaydates || []}
            loading={loading}
            error={error}
            emptyTitle="No past playdates"
            emptyMessage="You haven't attended any playdates yet."
            showCreateButton={false}
          />
        </div>
        
        {/* Sidebar content */}
        <PlaydateSidebar />
      </div>
    </div>
  );
};

export default Playdates;
