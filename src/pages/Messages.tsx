
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ParentProfile } from '@/types';
import MessageBox from '@/components/MessageBox';

const MessagesPage = () => {
  const { id: recipientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipient, setRecipient] = useState<ParentProfile | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!user || !recipientId) return;
    
    const fetchRecipient = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', recipientId)
          .single();
        
        if (error) throw error;
        setRecipient(data);
      } catch (error: any) {
        console.error('Error fetching recipient:', error);
        toast({
          title: "Error",
          description: "Failed to load contact information",
          variant: "destructive"
        });
      }
    };
    
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_conversation', {
            user1_id: user.id,
            user2_id: recipientId
          });
        
        if (error) throw error;
        setMessages(data || []);
        
        // Mark all messages as read
        if (data && data.length > 0) {
          const unreadMsgIds = data
            .filter(m => m.recipient_id === user.id && !m.read)
            .map(m => m.id);
          
          if (unreadMsgIds.length > 0) {
            await supabase.rpc('mark_messages_as_read', {
              msg_ids: unreadMsgIds
            });
          }
        }
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipient();
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`,
      }, (payload) => {
        // Only append if it's from this conversation
        if (payload.new.sender_id === recipientId) {
          setMessages(prev => [...prev, payload.new]);
          
          // Mark as read immediately
          supabase.rpc('mark_messages_as_read', {
            msg_ids: [payload.new.id]
          });
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, recipientId]);
  
  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async () => {
    if (!user || !recipientId || !newMessage.trim()) return;
    
    try {
      setSending(true);
      
      const { data, error } = await supabase
        .rpc('send_message', {
          sender_user_id: user.id,
          recipient_user_id: recipientId,
          msg_content: newMessage.trim()
        });
      
      if (error) throw error;
      
      if (data) {
        setMessages([...messages, data[0]]);
        setNewMessage('');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <AppLayout>
      <div className="p-4 h-full flex flex-col">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/connections')}
          className="mb-4 self-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Connections
        </Button>
        
        <div className="flex flex-col h-[calc(100vh-200px)]">
          {/* Header */}
          {recipient && (
            <div className="bg-white p-4 rounded-t-lg border border-muted flex items-center gap-3">
              <Avatar>
                <AvatarImage src={recipient.avatar_url} alt={recipient.parent_name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {recipient.parent_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{recipient.parent_name}</div>
                {recipient.city && (
                  <div className="text-xs text-muted-foreground">{recipient.city}</div>
                )}
              </div>
              <Badge variant="outline" className="ml-auto">Connected</Badge>
            </div>
          )}
          
          {/* Messages */}
          <Card className="flex-grow overflow-hidden border-t-0 rounded-t-none">
            <CardContent className="p-4 h-full overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-muted-foreground mb-2">No messages yet</div>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Send a message to start the conversation with {recipient?.parent_name || 'this user'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBox
                      key={message.id}
                      message={{
                        id: message.id,
                        content: message.content,
                        sender: message.sender_id === user.id ? 'me' : 'them',
                        timestamp: message.created_at,
                        read: message.read
                      }}
                      senderName={message.sender_id === user.id ? 'You' : recipient?.parent_name || 'User'}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Input */}
          <div className="bg-white p-4 rounded-b-lg border border-muted border-t-0 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && newMessage.trim()) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || sending}
              className="button-glow bg-primary hover:bg-primary/90 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MessagesPage;
