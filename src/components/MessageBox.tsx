
import React, { useState, useRef, useEffect } from 'react';
import { Message, ParentProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBoxProps {
  messages: Message[];
  otherProfile: ParentProfile | null;
  onSendMessage: (content: string) => Promise<{ success: boolean, error?: string }>;
}

export default function MessageBox({ 
  messages, 
  otherProfile,
  onSendMessage 
}: MessageBoxProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    const result = await onSendMessage(newMessage);
    setSending(false);
    
    if (result.success) {
      setNewMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages list */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isSelf = message.sender_id === user?.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isSelf && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={otherProfile?.avatar_url} alt={otherProfile?.parent_name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {otherProfile?.parent_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`
                    rounded-xl p-3 text-sm 
                    ${isSelf 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'}
                  `}>
                    <div>{message.content}</div>
                    <div className={`text-xs mt-1 ${isSelf ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {format(new Date(message.created_at), 'p')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="resize-none min-h-10"
            disabled={sending}
          />
          <Button 
            onClick={handleSend} 
            disabled={!newMessage.trim() || sending}
            className="button-glow bg-primary hover:bg-primary/90 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
