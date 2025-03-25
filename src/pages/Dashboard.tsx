
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';
import { useDashboard } from '@/hooks/useDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    loading, 
    profile, 
    children, 
    upcomingPlaydates, 
    suggestedConnections, 
    nearbyEvents 
  } = useDashboard();

  const childrenWithAges = children?.map(child => ({
    name: child.name,
    age: child.age
  })) || [];

  const interests = ['Arts & Crafts', 'Nature', 'STEM'];
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {loading ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              `Welcome back, ${profile?.parent_name?.split(' ')[0] || 'User'}!`
            )}
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your playdates and connections.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            {/* Upcoming playdates */}
            {loading ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <PlaydatesList 
                title="Upcoming Playdates"
                playdates={upcomingPlaydates}
                showNewButton={true}
                viewAllLink="/playdates"
              />
            )}
          </div>
          
          {/* Sidebar content */}
          <div className="space-y-6">
            {/* Profile summary */}
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ProfileSummary 
                name={profile?.parent_name || 'User'}
                children={childrenWithAges}
                interests={interests}
              />
            )}
            
            {/* Suggested connections */}
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <SuggestedConnections 
                connections={suggestedConnections}
              />
            )}
            
            {/* Upcoming events nearby */}
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <NearbyEvents 
                events={nearbyEvents}
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
