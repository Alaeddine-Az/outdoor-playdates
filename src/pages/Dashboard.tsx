import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Pencil } from 'lucide-react';

import { useDashboard } from '@/hooks/useDashboard';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    loading,
    profile,
    children,
    upcomingPlaydates,
    suggestedProfiles,
    nearbyEvents,
    error
  } = useDashboard();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Dashboard Error',
        description: error || 'There was a problem loading your dashboard data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error]);

  // Log everything for debugging
  useEffect(() => {
    console.log('🧪 DASHBOARD STATE:');
    console.log('loading:', loading);
    console.log('profile:', profile);
    console.log('children:', children);
    console.log('error:', error);
  }, [loading, profile, children, error]);

  // If still loading or profile isn't ready, show a frozen loader
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div className="text-lg text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  // Just render the core profile to isolate issue
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome, {profile.parent_name?.split(' ')[0]}</h1>
      <p className="text-muted-foreground mb-4">You have {children?.length || 0} child profiles linked.</p>

      <div className="my-6">
        <Button onClick={() => navigate('/parent-profile')} className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:brightness-110">
          Edit Profile
        </Button>
      </div>

      <div className="space-y-6">
        <ProfileSummary 
          name={profile.parent_name} 
          children={children.map(c => ({ name: c.name, age: c.age }))} 
          interests={profile.interests || []} 
        />
        <PlaydatesList
          title="Upcoming Playdates"
          playdates={upcomingPlaydates}
          showNewButton={true}
          viewAllLink="/playdates"
        />
        <SuggestedConnections 
          profiles={suggestedProfiles}
          loading={false}
        />
        <NearbyEvents events={nearbyEvents} />
      </div>
    </div>
  );
};

export default Dashboard;
