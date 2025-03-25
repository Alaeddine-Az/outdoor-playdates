
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useMessages } from '@/hooks/useMessages';
import MessageBox from '@/components/MessageBox';
import { Button } from '@/components/ui/button';
import { ChevronLeft, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MessagesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    messages, 
    otherProfile, 
    loading, 
    error, 
    sendMessage 
  } = useMessages(id);
  
  if (loading) {
    return (
      <AppLayout>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex-grow">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to Load Conversation</h1>
          <p className="text-muted-foreground mb-6">
            {error === 'Not connected with this user' 
              ? 'You need to be connected with this user to message them.'
              : 'There was an error loading this conversation.'}
          </p>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (!otherProfile) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The user you're trying to message could not be found.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col rounded-lg border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherProfile.avatar_url} alt={otherProfile.parent_name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {otherProfile.parent_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">{otherProfile.parent_name}</h2>
              {otherProfile.city && (
                <p className="text-xs text-muted-foreground">{otherProfile.city}</p>
              )}
            </div>
          </div>
          
          <Button 
            asChild
            variant="ghost" 
            size="sm"
          >
            <Link to={`/parent/${otherProfile.id}`}>
              <User className="h-4 w-4 mr-1" /> View Profile
            </Link>
          </Button>
        </div>
        
        {/* Messages */}
        <div className="flex-grow min-h-0">
          <MessageBox 
            messages={messages}
            otherProfile={otherProfile}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default MessagesPage;
