import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Connection, ParentProfile } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function useConnections() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [sentRequests, setSentRequests] = useState<Connection[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionProfiles, setConnectionProfiles] = useState<Record<string, ParentProfile>>({});
  const [suggestedConnections, setSuggestedConnections] = useState<ParentProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadConnections = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: connectionsError } = await supabase
        .from('connections')
        .select('*')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);

      if (connectionsError) {
        console.error('Error fetching connections:', connectionsError);
        throw connectionsError;
      }

      if (data) {
        const allConnections = data as Connection[];

        const pending = allConnections.filter(c =>
          c.status === 'pending' && c.recipient_id === user.id
        );

        const sent = allConnections.filter(c =>
          c.status === 'pending' && c.requester_id === user.id
        );

        const accepted = allConnections.filter(c => c.status === 'accepted');

        setPendingRequests(pending);
        setSentRequests(sent);
        setConnections(accepted);

        const allProfileIds = new Set<string>();
        allConnections.forEach((c: Connection) => {
          allProfileIds.add(c.requester_id);
          allProfileIds.add(c.recipient_id);
        });
        allProfileIds.delete(user.id);

        if (allProfileIds.size > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', Array.from(allProfileIds));

          if (profilesError) {
            console.error('Error fetching connection profiles:', profilesError);
            throw profilesError;
          }

          const profileMap: Record<string, ParentProfile> = {};
          profiles?.forEach(profile => {
            profileMap[profile.id] = profile as ParentProfile;
          });

          setConnectionProfiles(profileMap);
        }
      }
    } catch (e: any) {
      console.error('Error loading connections:', e);
      setError(e.message);
      toast({
        title: 'Error loading connections',
        description: 'Unable to load your connections. Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedConnections = async () => {
    if (!user) return;

    try {
      const { data: existingConnections, error: connError } = await supabase
        .from('connections')
        .select('requester_id, recipient_id')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);

      if (connError) throw connError;

      const excludedIds = new Set<string>([user.id]);
      existingConnections?.forEach(c => {
        if (c.requester_id !== user.id) excludedIds.add(c.requester_id);
        if (c.recipient_id !== user.id) excludedIds.add(c.recipient_id);
      });

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${Array.from(excludedIds).join(',')})`);

      if (profilesError) throw profilesError;

      console.log('Fetched potential connections:', profiles);
      setSuggestedConnections(profiles as ParentProfile[]);
    } catch (e: any) {
      console.error('Error loading suggested connections:', e.message);
    }
  };

  useEffect(() => {
    if (user?.id) {
      console.log('Loading dashboard data for user:', user.id);
      loadConnections();
      loadSuggestedConnections();
    }
  }, [user?.id]);

  const sendConnectionRequest = async (recipientId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    if (recipientId === user.id) return { success: false, error: 'Cannot connect with yourself' };

    try {
      const { data: existing, error: checkError } = await supabase
        .from('connections')
        .select('*')
        .or(`and(requester_id.eq.${user.id},recipient_id.eq.${recipientId}),and(requester_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        return {
          success: false,
          error: existing.status === 'pending'
            ? 'Connection request already pending'
            : 'Already connected'
        };
      }

      const { data, error } = await supabase
        .from('connections')
        .insert([{
          requester_id: user.id,
          recipient_id: recipientId,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      if (data) {
        setSentRequests(prev => [...prev, data[0] as Connection]);
        toast({
          title: 'Connection request sent',
          description: 'Your connection request has been sent.',
        });
      }

      return { success: true, data };
    } catch (e: any) {
      console.error('Error sending connection request:', e);
      toast({
        title: 'Error sending request',
        description: e.message,
        variant: 'destructive',
      });
      return { success: false, error: e.message };
    }
  };

  const respondToRequest = async (connectionId: string, accept: boolean) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const newStatus = accept ? 'accepted' : 'declined';

      const { data, error } = await supabase
        .from('connections')
        .update({ status: newStatus })
        .eq('id', connectionId)
        .eq('recipient_id', user.id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setPendingRequests(prev => prev.filter(req => req.id !== connectionId));

        if (accept) {
          setConnections(prev => [...prev, data[0] as Connection]);
          toast({
            title: 'Connection accepted',
            description: 'You are now connected.',
          });
        } else {
          toast({
            title: 'Connection declined',
            description: 'The connection request has been declined.',
          });
        }
      }

      return { success: true };
    } catch (e: any) {
      console.error('Error responding to connection request:', e);
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive',
      });
      return { success: false, error: e.message };
    }
  };

  const isConnected = (profileId: string): boolean => {
    return connections.some(c =>
      (c.requester_id === profileId && c.recipient_id === user?.id) ||
      (c.recipient_id === profileId && c.requester_id === user?.id)
    );
  };

  const hasPendingRequest = (profileId: string): boolean => {
    return sentRequests.some(c => c.recipient_id === profileId);
  };

  return {
    loading,
    error,
    pendingRequests,
    sentRequests,
    connections,
    connectionProfiles,
    suggestedConnections,
    sendConnectionRequest,
    respondToRequest,
    isConnected,
    hasPendingRequest,
    refreshConnections: loadConnections
  };
}
