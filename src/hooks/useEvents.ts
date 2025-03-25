
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventParticipant, ParentProfile, ChildProfile } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function useEvents() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all events (public)
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('start_time', { ascending: true });

        if (eventsError) throw eventsError;
        setEvents(eventsData || []);

        if (user) {
          // Fetch hosted events
          const { data: hostedData, error: hostedError } = await supabase
            .from('events')
            .select('*')
            .eq('host_id', user.id)
            .order('start_time', { ascending: true });

          if (hostedError) throw hostedError;
          setHostedEvents(hostedData || []);

          // Fetch events the user has joined
          const { data: participationData, error: participationError } = await supabase
            .from('event_participants')
            .select('event_id')
            .eq('parent_id', user.id);

          if (participationError) throw participationError;
          
          if (participationData && participationData.length > 0) {
            const eventIds = participationData.map(p => p.event_id);
            
            const { data: joinedData, error: joinedError } = await supabase
              .from('events')
              .select('*')
              .in('id', eventIds)
              .order('start_time', { ascending: true });

            if (joinedError) throw joinedError;
            setJoinedEvents(joinedData || []);
          }
        }
      } catch (e: any) {
        console.error('Error loading events:', e);
        setError(e.message);
        toast({
          title: 'Error loading events',
          description: e.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [user]);

  return {
    loading,
    error,
    events,
    hostedEvents,
    joinedEvents
  };
}

export function useEventDetails(eventId: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [host, setHost] = useState<ParentProfile | null>(null);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [participantProfiles, setParticipantProfiles] = useState<Record<string, ParentProfile>>({});
  const [participantChildren, setParticipantChildren] = useState<ChildProfile[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    async function loadEventDetails() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        // Fetch host profile
        const { data: hostData, error: hostError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', eventData.host_id)
          .single();

        if (hostError) throw hostError;
        setHost(hostData);

        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('event_participants')
          .select('*')
          .eq('event_id', eventId);

        if (participantsError) throw participantsError;
        setParticipants(participantsData || []);

        // Check if current user is joined
        if (user && participantsData) {
          setIsJoined(participantsData.some(p => p.parent_id === user.id));
        }

        // Fetch participant profiles
        if (participantsData && participantsData.length > 0) {
          const parentIds = participantsData.map(p => p.parent_id);
          
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', parentIds);

          if (profilesError) throw profilesError;
          
          const profileMap: Record<string, ParentProfile> = {};
          profilesData?.forEach(profile => {
            profileMap[profile.id] = profile;
          });
          
          setParticipantProfiles(profileMap);

          // Fetch all children of participants
          const allChildrenIds = participantsData.flatMap(p => p.children_ids);
          
          if (allChildrenIds.length > 0) {
            const { data: childrenData, error: childrenError } = await supabase
              .from('children')
              .select('*')
              .in('id', allChildrenIds);

            if (childrenError) throw childrenError;
            setParticipantChildren(childrenData || []);
          }
        }
      } catch (e: any) {
        console.error('Error loading event details:', e);
        setError(e.message);
        toast({
          title: 'Error loading event details',
          description: e.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    loadEventDetails();
  }, [eventId, user]);

  const joinEvent = async (childrenIds: string[]) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    if (!event) return { success: false, error: 'Event not found' };
    if (isJoined) return { success: false, error: 'Already joined this event' };
    if (childrenIds.length === 0) return { success: false, error: 'Please select at least one child' };

    try {
      const { data, error } = await supabase
        .from('event_participants')
        .insert([{
          event_id: event.id,
          parent_id: user.id,
          children_ids: childrenIds
        }])
        .select();

      if (error) throw error;

      if (data) {
        setParticipants(prev => [...prev, data[0]]);
        setIsJoined(true);
        
        // Get current user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileData) {
          setParticipantProfiles(prev => ({
            ...prev,
            [user.id]: profileData
          }));
        }

        toast({
          title: 'Successfully joined',
          description: 'You have joined the event!',
        });
      }
      
      return { success: true };
    } catch (e: any) {
      console.error('Error joining event:', e);
      toast({
        title: 'Error joining event',
        description: e.message,
        variant: 'destructive',
      });
      return { success: false, error: e.message };
    }
  };

  const leaveEvent = async () => {
    if (!user) return { success: false, error: 'Not authenticated' };
    if (!event) return { success: false, error: 'Event not found' };
    if (!isJoined) return { success: false, error: 'Not joined this event' };

    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', event.id)
        .eq('parent_id', user.id);

      if (error) throw error;

      setParticipants(prev => prev.filter(p => p.parent_id !== user.id));
      setIsJoined(false);
      
      toast({
        title: 'Left event',
        description: 'You have left the event.',
      });
      
      return { success: true };
    } catch (e: any) {
      console.error('Error leaving event:', e);
      toast({
        title: 'Error leaving event',
        description: e.message,
        variant: 'destructive',
      });
      return { success: false, error: e.message };
    }
  };

  return {
    loading,
    error,
    event,
    host,
    participants,
    participantProfiles,
    participantChildren,
    isJoined,
    joinEvent,
    leaveEvent
  };
}
