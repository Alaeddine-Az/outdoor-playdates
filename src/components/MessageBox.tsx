
import React, { useState, useRef, useEffect } from 'react';
import { Message, ParentProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface MessageBoxProps {
  messages: Message[];
  otherProfile: ParentProfile | null;
  onSendMessage: (content: string) => Promise<{ success: boolean; error?: string }>;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    // Optimistically add the message to the UI
    const trimmedMessage = newMessage.trim();
    setNewMessage('');
    
    // Focus back on the textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
    
    const result = await onSendMessage(trimmedMessage);
    setSending(false);
    
    if (!result.success) {
      // If sending failed, restore the message in the input
      setNewMessage(trimmedMessage);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Automatically resize textarea based on content
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Reset height to get the correct scrollHeight
    e.target.style.height = 'auto';
    // Set new height based on content (with max height)
    const newHeight = Math.min(e.target.scrollHeight, 150);
    e.target.style.height = `${newHeight}px`;
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages list */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 pt-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isSelf = message.sender_id === user?.id;
              const showAvatar = !isSelf && (index === 0 || messages[index - 1].sender_id !== message.sender_id);
              
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isSelf && showAvatar ? (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={otherProfile?.avatar_url} alt={otherProfile?.parent_name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {otherProfile?.parent_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : !isSelf ? (
                      <div className="w-8"></div> 
                    ) : null}
                    
                    <div className={`
                      rounded-xl p-3 text-sm 
                      ${isSelf 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'}
                    `}>
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                      <div className={`text-xs mt-1 ${isSelf ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {format(new Date(message.created_at), 'p')}
                        {isSelf && message.read && (
                          <span className="ml-1 opacity-70">• Read</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Message input */}
      <div className="border-t p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="resize-none min-h-[40px] max-h-[150px] py-2"
            disabled={sending}
            style={{ height: '40px' }}
          />
          <Button 
            onClick={handleSend} 
            disabled={!newMessage.trim() || sending}
            className="button-glow bg-primary hover:bg-primary/90 text-white h-10 px-3"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
