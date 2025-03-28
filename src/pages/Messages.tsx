
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
import { useMessages } from '@/hooks/useMessages';

const MessagesPage = () => {
  const { id: recipientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { loading, messages, otherProfile, sendMessage, error } = useMessages(recipientId);
  
  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!user || !recipientId || !newMessage.trim()) return;
    
    try {
      setSending(true);
      const result = await sendMessage(newMessage);
      
      if (result.success) {
        setNewMessage('');
      } else {
        toast({
          title: "Failed to send",
          description: result.error,
          variant: "destructive"
        });
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
  
  if (error) {
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
          
          <Card className="flex-grow">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-xl font-semibold mb-2">Connection Required</div>
                <p className="text-muted-foreground mb-4">
                  You need to connect with this user before you can send messages.
                </p>
                <Button onClick={() => navigate('/connections')}>
                  Go to Connections
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
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
          {otherProfile && (
            <div className="bg-white p-4 rounded-t-lg border border-muted flex items-center gap-3">
              <Avatar>
                <AvatarImage src={otherProfile.avatar_url} alt={otherProfile.parent_name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {otherProfile.parent_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{otherProfile.parent_name}</div>
                {otherProfile.city && (
                  <div className="text-xs text-muted-foreground">{otherProfile.city}</div>
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
                    Send a message to start the conversation with {otherProfile?.parent_name || 'this user'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[80%] ${message.sender_id === user.id ? 'flex-row-reverse' : 'flex-row'}`}>
                        {message.sender_id !== user.id && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={otherProfile?.avatar_url} alt={otherProfile?.parent_name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {otherProfile?.parent_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`
                          rounded-xl p-3 text-sm 
                          ${message.sender_id === user.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'}
                        `}>
                          <div>{message.content}</div>
                          <div className={`text-xs mt-1 ${message.sender_id === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            {message.sender_id === user.id && message.read && (
                              <span className="ml-1 text-primary-foreground/70">• Read</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage} 
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
