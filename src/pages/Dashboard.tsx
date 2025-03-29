
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Sun, CalendarHeart, MapPin, Party } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';
import { useDashboard } from '@/hooks/useDashboard';
import { toast } from '@/components/ui/use-toast';
import BearCharacter from '@/components/characters/BearCharacter';

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
    <div className="animate-fade-in">
      {loading ? (
        <div className="space-y-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-4 w-full max-w-md mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-8 overflow-hidden rounded-3xl bg-play-lightBlue shadow-md">
            <div className="absolute inset-0 bg-wave-pattern bg-cover bg-bottom opacity-30"></div>
            <div className="relative flex items-center justify-between p-6 md:p-8">
              <div className="max-w-lg">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Welcome back, {profile?.parent_name?.split(' ')[0] || 'Friend'}!
                </h1>
                <p className="text-blue-800/70 text-lg">
                  Here's what's happening with your playdates and connections.
                </p>
              </div>
              <div className="hidden md:block">
                <BearCharacter size="lg" animation="wave" />
              </div>
            </div>
          </div>
          
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
              <ProfileSummary 
                name={profile?.parent_name || 'User'}
                children={childrenWithAges}
                interests={interests}
              />
              <SuggestedConnections 
                connections={suggestedConnections}
              />
              <NearbyEvents 
                events={nearbyEvents}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
