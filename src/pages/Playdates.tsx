import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlaydates } from '@/hooks/usePlaydates';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import PlaydateList from '@/components/playdates/PlaydateList';
import PlaydateSidebar from '@/components/playdates/PlaydateSidebar';

const Playdates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allPlaydates, myPlaydates, pastPlaydates, loading, error } = usePlaydates();
  
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
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Playdates</h1>
          <p className="text-muted-foreground text-lg">
            Schedule, manage, and find fun playdates for your children
          </p>
        </div>
        <Button 
          className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl" 
          onClick={() => navigate('/create-playdate')}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Playdate
        </Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="md:col-span-2 space-y-6">
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
