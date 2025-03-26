
import React from 'react';
import { ParentProfile } from '@/types';
import { useConnections } from '@/hooks/useConnections';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, UserPlus, Check, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ProfileHeaderProps {
  profile: ParentProfile;
  isCurrentUser: boolean;
}

export default function ProfileHeader({ profile, isCurrentUser }: ProfileHeaderProps) {
  const { user } = useAuth();
  const { 
    isConnected, 
    hasPendingRequest, 
    sendConnectionRequest, 
    loading: connectionsLoading 
  } = useConnections();
  
  const connected = isConnected(profile.id);
  const pendingRequest = hasPendingRequest(profile.id);
  
  const handleConnect = async () => {
    await sendConnectionRequest(profile.id);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-muted p-6">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Avatar className="w-28 h-28">
          <AvatarImage src={profile.avatar_url} alt={profile.parent_name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-4xl">
            {getInitials(profile.parent_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-2xl font-bold mb-2">{profile.parent_name}</h1>
          
          {profile.city && (
            <div className="text-muted-foreground mb-3">
              <span>{profile.city}</span>
            </div>
          )}
          
          {profile.description && (
            <p className="text-muted-foreground mb-4">{profile.description}</p>
          )}
          
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="rounded-full py-1 px-3">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
          
          {!isCurrentUser && user && (
            <div className="flex flex-col sm:flex-row gap-2">
              {connected ? (
                <Button 
                  asChild
                  className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
                >
                  <Link to={`/messages/${profile.id}`}>
                    <MessageCircle className="h-4 w-4 mr-2" /> Message
                  </Link>
                </Button>
              ) : pendingRequest ? (
                <Button 
                  disabled 
                  variant="outline" 
                  className="rounded-xl"
                >
                  <Clock className="h-4 w-4 mr-2" /> Request Sent
                </Button>
              ) : (
                <Button 
                  onClick={handleConnect} 
                  disabled={connectionsLoading}
                  className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Connect
                </Button>
              )}
            </div>
          )}
          
          {isCurrentUser && (
            <Button 
              asChild
              variant="outline" 
              className="rounded-xl"
            >
              <Link to="/edit-profile">
                Edit Profile
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
