
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Sparkles, PartyPopper, CalendarDays, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlaydates, Playdate } from '@/hooks/usePlaydates';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import PlaydateList from '@/components/playdates/PlaydateList';
import PlaydateSidebar from '@/components/playdates/PlaydateSidebar';
import { useUserLocation } from '@/hooks/useUserLocation';

const Playdates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useUserLocation();
  const { allPlaydates, myPlaydates, pastPlaydates, nearbyPlaydates, loading, error } = usePlaydates({
    userLocation: {
      latitude: location.latitude,
      longitude: location.longitude
    },
    maxDistance: 10
  });
  
  if (!user) {
    toast({
      title: "Authentication required",
      description: "You need to sign in to view playdates",
      variant: "destructive"
    });
    navigate('/auth');
    return null;
  }

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
          {nearbyPlaydates && nearbyPlaydates.length > 0 && location.latitude && location.longitude && (
            <PlaydateList
              title="Playdates Near You"
              playdates={nearbyPlaydates}
              loading={loading}
              error={error}
              emptyTitle="No nearby playdates"
              emptyMessage="There are no playdates near your current location."
              showCreateButton={true}
              icon={<Navigation className="h-5 w-5 text-blue-500" />}
            />
          )}
          
          <PlaydateList
            title="Upcoming Playdates"
            playdates={allPlaydates}
            loading={loading}
            error={error}
            emptyTitle="No upcoming playdates"
            emptyMessage="There are no upcoming playdates in your area."
            showCreateButton={true}
          />
          
          <PlaydateList
            title="My Scheduled Playdates"
            playdates={myPlaydates}
            loading={loading}
            error={error}
            emptyTitle="No scheduled playdates"
            emptyMessage="You haven't created any playdates yet."
            showCreateButton={true}
          />
          
          <PlaydateList
            title="Past Playdates"
            playdates={pastPlaydates}
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
