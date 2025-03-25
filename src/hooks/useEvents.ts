
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
        // Fetch all events using rpc call
        const { data: eventsData, error: eventsError } = await supabase
          .rpc('get_all_events')
          .select('*');

        if (eventsError) throw eventsError;
        setEvents(eventsData as Event[] || []);

        if (user) {
          // Fetch hosted events using rpc call
          const { data: hostedData, error: hostedError } = await supabase
            .rpc('get_hosted_events', { host_user_id: user.id })
            .select('*');

          if (hostedError) throw hostedError;
          setHostedEvents(hostedData as Event[] || []);

          // Fetch events the user has joined using rpc call
          const { data: joinedData, error: joinedError } = await supabase
            .rpc('get_joined_events', { participant_user_id: user.id })
            .select('*');

          if (joinedError) throw joinedError;
          setJoinedEvents(joinedData as Event[] || []);
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
        // Fetch event details using rpc call
        const { data: eventData, error: eventError } = await supabase
          .rpc('get_event_by_id', { event_id: eventId })
          .select('*')
          .single();

        if (eventError) throw eventError;
        setEvent(eventData as Event);

        // Fetch host profile
        const { data: hostData, error: hostError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', eventData.host_id)
          .single();

        if (hostError) throw hostError;
        setHost(hostData as ParentProfile);

        // Fetch participants using rpc call
        const { data: participantsData, error: participantsError } = await supabase
          .rpc('get_event_participants', { event_id: eventId })
          .select('*');

        if (participantsError) throw participantsError;
        setParticipants(participantsData as EventParticipant[] || []);

        // Check if current user is joined
        if (user && participantsData) {
          setIsJoined(participantsData.some((p: any) => p.parent_id === user.id));
        }

        // Fetch participant profiles
        if (participantsData && participantsData.length > 0) {
          const parentIds = participantsData.map((p: any) => p.parent_id);
          
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', parentIds);

          if (profilesError) throw profilesError;
          
          const profileMap: Record<string, ParentProfile> = {};
          profilesData?.forEach(profile => {
            profileMap[profile.id] = profile as ParentProfile;
          });
          
          setParticipantProfiles(profileMap);

          // Fetch all children of participants
          const allChildrenIds: string[] = [];
          participantsData.forEach((p: any) => {
            if (p.children_ids && Array.isArray(p.children_ids)) {
              allChildrenIds.push(...p.children_ids);
            }
          });
          
          if (allChildrenIds.length > 0) {
            const { data: childrenData, error: childrenError } = await supabase
              .from('children')
              .select('*')
              .in('id', allChildrenIds);

            if (childrenError) throw childrenError;
            setParticipantChildren(childrenData as ChildProfile[] || []);
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
      // Join event using rpc call
      const { data, error } = await supabase
        .rpc('join_event', {
          event_id: event.id,
          user_id: user.id,
          children_ids: childrenIds
        });

      if (error) throw error;

      if (data) {
        setParticipants(prev => [...prev, data[0] as EventParticipant]);
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
            [user.id]: profileData as ParentProfile
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
      // Leave event using rpc call
      const { error } = await supabase
        .rpc('leave_event', {
          event_id: event.id,
          user_id: user.id
        });

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
