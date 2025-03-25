
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useEvents } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import EventCard from '@/components/EventCard';
import { supabase } from '@/integrations/supabase/client';
import { ParentProfile } from '@/types';

const EventsPage = () => {
  const [eventHosts, setEventHosts] = useState<Record<string, ParentProfile>>({});
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});
  const { events, hostedEvents, joinedEvents, loading } = useEvents();
  
  useEffect(() => {
    if (events.length === 0) return;
    
    const fetchEventData = async () => {
      // Get all unique host IDs
      const hostIds = [...new Set(events.map(event => event.host_id))];
      
      if (hostIds.length > 0) {
        // Fetch host profiles
        const { data: hostProfiles, error: hostError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', hostIds);
          
        if (hostError) {
          console.error('Error fetching host profiles:', hostError);
        } else if (hostProfiles) {
          const hostMap: Record<string, ParentProfile> = {};
          hostProfiles.forEach(profile => {
            hostMap[profile.id] = profile as ParentProfile;
          });
          setEventHosts(hostMap);
        }
      }
      
      // Fetch participant counts for each event
      if (events.length > 0) {
        const eventIds = events.map(event => event.id);
        
        // Get all participants
        const { data: participantsData, error: countError } = await supabase
          .from('event_participants')
          .select('event_id');
          
        if (countError) {
          console.error('Error fetching participant counts:', countError);
        } else if (participantsData) {
          const countMap: Record<string, number> = {};
          
          // Count participants per event
          eventIds.forEach(eventId => {
            countMap[eventId] = participantsData.filter(p => p.event_id === eventId).length;
          });
          
          setParticipantCounts(countMap);
        }
      }
    };
    
    fetchEventData();
  }, [events]);
  
  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-10 w-60" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Events</h1>
          <Button asChild className="button-glow bg-primary hover:bg-primary/90 text-white">
            <Link to="/create-event">
              <PlusCircle className="h-4 w-4 mr-2" /> Create Event
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="bg-muted mb-6">
            <TabsTrigger value="all">
              All Events
              <span className="ml-2 text-xs bg-muted-foreground/20 px-2 py-0.5 rounded-full">
                {events.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="joined">
              Joined Events
              <span className="ml-2 text-xs bg-muted-foreground/20 px-2 py-0.5 rounded-full">
                {joinedEvents.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="hosted">
              Hosted Events
              <span className="ml-2 text-xs bg-muted-foreground/20 px-2 py-0.5 rounded-full">
                {hostedEvents.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {events.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  There are no upcoming events in your area.
                </p>
                <Button asChild className="button-glow bg-primary hover:bg-primary/90 text-white">
                  <Link to="/create-event">
                    <PlusCircle className="h-4 w-4 mr-2" /> Create the first event
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(event => (
                  <EventCard 
                    key={event.id}
                    event={event}
                    hostProfile={eventHosts[event.host_id]}
                    participantCount={participantCounts[event.id] || 0}
                    isJoined={joinedEvents.some(e => e.id === event.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="joined">
            {joinedEvents.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No joined events</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't joined any events yet.
                </p>
                <Button asChild className="button-glow bg-primary hover:bg-primary/90 text-white">
                  <Link to="/events?tab=all">Browse Events</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {joinedEvents.map(event => (
                  <EventCard 
                    key={event.id}
                    event={event}
                    hostProfile={eventHosts[event.host_id]}
                    participantCount={participantCounts[event.id] || 0}
                    isJoined={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="hosted">
            {hostedEvents.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No hosted events</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any events yet.
                </p>
                <Button asChild className="button-glow bg-primary hover:bg-primary/90 text-white">
                  <Link to="/create-event">
                    <PlusCircle className="h-4 w-4 mr-2" /> Host your first event
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hostedEvents.map(event => (
                  <EventCard 
                    key={event.id}
                    event={event}
                    hostProfile={eventHosts[event.host_id]}
                    participantCount={participantCounts[event.id] || 0}
                    isJoined={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EventsPage;
