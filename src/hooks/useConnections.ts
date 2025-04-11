
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadConnections() {
      setLoading(true);
      setError(null);
      
      try {
        // Check Supabase connection first
        const { error: healthCheckError } = await supabase.from('connections').select('count').limit(1).single();
        if (healthCheckError && healthCheckError.code !== 'PGRST116') {
          // PGRST116 is "Results contain 0 rows" which is fine
          console.error('Supabase connection check failed:', healthCheckError);
          throw new Error('Database connection error. Please try again later.');
        }

        // Fetch all connections related to the user using direct table query
        const { data, error: connectionsError } = await supabase
          .from('connections')
          .select('*')
          .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);

        if (connectionsError) throw connectionsError;

        if (data) {
          // Cast and sort connections by status
          const allConnections = data as Connection[];
          
          const pending = allConnections.filter(c => 
            c.status === 'pending' && c.recipient_id === user.id
          );
          
          const sent = allConnections.filter(c => 
            c.status === 'pending' && c.requester_id === user.id
          );
          
          const accepted = allConnections.filter(c => 
            c.status === 'accepted'
          );

          setPendingRequests(pending);
          setSentRequests(sent);
          setConnections(accepted);

          // Get unique IDs of all connection parties
          const allProfileIds = new Set<string>();
          allConnections.forEach((c: Connection) => {
            allProfileIds.add(c.requester_id);
            allProfileIds.add(c.recipient_id);
          });
          allProfileIds.delete(user.id);

          // Fetch profiles for all connections
          if (allProfileIds.size > 0) {
            const { data: profiles, error: profilesError } = await supabase
              .from('profiles')
              .select('*')
              .in('id', Array.from(allProfileIds));

            if (profilesError) throw profilesError;

            const profileMap: Record<string, ParentProfile> = {};
            profiles?.forEach(profile => {
              profileMap[profile.id] = profile as ParentProfile;
            });

            setConnectionProfiles(profileMap);
          }
        }
      } catch (e: any) {
        console.error('Error loading connections:', e);
        let errorMessage = 'Failed to load connections. Please try again later.';
        
        if (e?.message) {
          errorMessage = e.message;
        } else if (e?.code) {
          switch (e.code) {
            case 'PGRST301':
              errorMessage = 'Session expired. Please log in again.';
              break;
            case '20000':
              errorMessage = 'No internet connection. Please check your network.';
              break;
            case '23505':
              errorMessage = 'Connection already exists.';
              break;
            default:
              errorMessage = `Error code: ${e.code}. Please try again later.`;
          }
        }
        
        setError(errorMessage);
        toast({
          title: 'Error loading connections',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    // Add retry logic for connection loading
    let retryCount = 0;
    const maxRetries = 2;
    
    const attemptLoad = async () => {
      try {
        await loadConnections();
      } catch (e) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying connection load attempt ${retryCount}...`);
          setTimeout(attemptLoad, 1000 * retryCount); // Exponential backoff
        }
      }
    };
    
    attemptLoad();
  }, [user]);

  const sendConnectionRequest = async (recipientId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    if (recipientId === user.id) return { success: false, error: 'Cannot connect with yourself' };

    try {
      // Check if connection already exists
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

      // Create new connection request
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
      
      // Update connection status
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
    sendConnectionRequest,
    respondToRequest,
    isConnected,
    hasPendingRequest
  };
}
