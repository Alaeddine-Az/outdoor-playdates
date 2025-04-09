
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Message, ParentProfile } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function useMessages(otherId?: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherProfile, setOtherProfile] = useState<ParentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !otherId) {
      setLoading(false);
      return;
    }

    async function loadMessages() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch the other user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherId)
          .single();

        if (profileError) throw profileError;
        setOtherProfile(profileData as ParentProfile);

        // Check if users are connected
        const { data: connectionData, error: connectionError } = await supabase
          .from('connections')
          .select('*')
          .or(`and(requester_id.eq.${user.id},recipient_id.eq.${otherId}),and(requester_id.eq.${otherId},recipient_id.eq.${user.id})`)
          .eq('status', 'accepted')
          .maybeSingle();

        if (connectionError && connectionError.code !== 'PGRST116') throw connectionError;

        if (!connectionData) {
          setError('Not connected with this user');
          setMessages([]);
          setLoading(false);
          return;
        }

        // Fetch messages between the users
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${user.id})`)
          .order('created_at');

        if (messagesError) throw messagesError;
        setMessages(messagesData as Message[] || []);

        // Mark received messages as read
        if (messagesData && messagesData.length > 0) {
          const unreadMessages = messagesData.filter(m => 
            m.recipient_id === user.id && !m.read
          );
          
          if (unreadMessages.length > 0) {
            await supabase
              .from('messages')
              .update({ read: true })
              .in('id', unreadMessages.map(m => m.id));
          }
        }

        // Set up real-time subscription for new messages
        const channel = supabase
          .channel('messages_channel')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `or(and(sender_id=eq.${user.id},recipient_id=eq.${otherId}),and(sender_id=eq.${otherId},recipient_id=eq.${user.id}))`,
          }, (payload) => {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
            
            // Mark message as read if we're the recipient
            if (newMessage.recipient_id === user.id) {
              supabase
                .from('messages')
                .update({ read: true })
                .eq('id', newMessage.id);
            }
          })
          .subscribe();

        setLoading(false);
        
        // Fix the issue by returning a cleanup function properly
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (e: any) {
        console.error('Error loading messages:', e);
        setError(e.message);
        toast({
          title: 'Error loading messages',
          description: e.message,
          variant: 'destructive',
        });
        setLoading(false);
      }
    }

    // Call loadMessages and store its return value
    const cleanupFn = loadMessages();
    
    // Use the returned cleanup function in the useEffect cleanup
    return () => {
      if (cleanupFn && typeof cleanupFn === 'function') {
        cleanupFn();
      }
    };
  }, [user, otherId]);

  const sendMessage = async (content: string) => {
    if (!user || !otherId) return { success: false, error: 'Missing user information' };
    if (!content.trim()) return { success: false, error: 'Message cannot be empty' };

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          recipient_id: otherId,
          content: content.trim()
        }])
        .select();

      if (error) throw error;
      
      return { success: true };
    } catch (e: any) {
      console.error('Error sending message:', e);
      toast({
        title: 'Error sending message',
        description: e.message,
        variant: 'destructive',
      });
      return { success: false, error: e.message };
    }
  };

  return {
    loading,
    error,
    messages,
    otherProfile,
    sendMessage
  };
}
