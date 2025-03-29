
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import PlaydatesList from '@/components/dashboard/PlaydatesList';
import SuggestedConnections from '@/components/dashboard/SuggestedConnections';
import NearbyEvents from '@/components/dashboard/NearbyEvents';
import { useDashboard } from '@/hooks/useDashboard';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    loading,
    profile,
    children,
    upcomingPlaydates,
    suggestedConnections,
    nearbyEvents,
    error,
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
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const childrenWithAges = children?.map((child) => ({
    name: child.name,
    age: child.age,
  })) || [];

  const interests = profile?.interests || ['Arts & Crafts', 'Nature', 'STEM'];

  return (
    <div className="animate-fade-in px-4 pt-6 pb-10 md:px-8">
      {/* New Playful Hero Section */}
      <header className="relative w-full rounded-3xl overflow-hidden mb-6">
        <div className="bg-[#D8F1FF] p-6 md:p-8 rounded-3xl relative overflow-hidden">
          {/* Wavy Background Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg className="absolute top-0 left-0 w-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <path
                d="M0,100 C150,0 350,200 800,100 L800,0 L0,0 Z"
                fill="#B6E5FF"
                fillOpacity="0.6"
              ></path>
            </svg>
            <div className="absolute top-10 right-10">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#FFDD65" />
                <path
                  d="M25,50 Q50,20 75,50 Q50,80 25,50 Z"
                  fill="white"
                  fillOpacity="0.7"
                ></path>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-[#8DD35A] opacity-50 rounded-br-3xl rounded-bl-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#333333]">
                Welcome back, 
                <span className="block">{profile?.parent_name?.split(' ')[0] || 'Friend'}!</span>
              </h1>
              <p className="text-[#333333] text-xl">
                Here's what's happening with your playdates and connections.
              </p>
              
              <div className="pt-4">
                <Link to="/edit-profile">
                  <Button className="rounded-full bg-[#FFD761] hover:bg-[#FFC530] text-[#333333] font-medium px-6 py-2 shadow-md">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Loading State */}
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

            <SuggestedConnections connections={suggestedConnections} />

            <NearbyEvents events={nearbyEvents} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
