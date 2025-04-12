
import React from 'react';
import { Connection, ParentProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, UserCheck, UserX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface ConnectionsListProps {
  connections: Connection[];
  profiles: Record<string, ParentProfile>;
  onRespond?: (connectionId: string, accept: boolean) => void;
  type: 'pending' | 'accepted' | 'sent';
}

export default function ConnectionsList({ 
  connections, 
  profiles, 
  onRespond, 
  type 
}: ConnectionsListProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (connections.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {type === 'pending' ? 'No pending connection requests.' : 
         type === 'sent' ? 'No sent connection requests.' : 
         'No connections yet.'}
      </div>
    );
  }

  const handleUserClick = (userId: string) => {
    navigate(`/parent/${userId}`);
  };

  return (
    <div className="grid gap-2 sm:gap-4">
      {connections.map((connection) => {
        const otherId = connection.requester_id === user?.id 
          ? connection.recipient_id 
          : connection.requester_id;
        
        const profile = profiles[otherId];
        
        if (!profile) return null;
        
        return (
          <Card key={connection.id} className="overflow-hidden">
            <CardContent className={`p-2 sm:p-4 ${isMobile ? 'text-sm' : ''}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div 
                  className="flex items-center gap-2 cursor-pointer" 
                  onClick={() => handleUserClick(profile.id)}
                >
                  <Avatar className={isMobile ? "h-8 w-8" : undefined}>
                    <AvatarImage src={profile.avatar_url} alt={profile.parent_name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile.parent_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium hover:text-primary transition-colors line-clamp-1">
                      {profile.parent_name}
                    </span>
                    {profile.city && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{profile.city}</p>
                    )}
                  </div>
                </div>
                
                <div className={`flex gap-1 sm:gap-2 ${isMobile && type === 'pending' ? 'w-full mt-2 justify-end' : ''}`}>
                  {type === 'pending' && onRespond && (
                    <>
                      <Button 
                        size={isMobile ? "sm" : "sm"}
                        variant="outline"
                        onClick={() => onRespond(connection.id, true)}
                        className={isMobile ? "px-2 py-1 h-8" : ""}
                      >
                        <UserCheck className="h-4 w-4 mr-1" /> Accept
                      </Button>
                      <Button 
                        size={isMobile ? "sm" : "sm"}
                        variant="outline"
                        onClick={() => onRespond(connection.id, false)}
                        className={isMobile ? "px-2 py-1 h-8" : ""}
                      >
                        <UserX className="h-4 w-4 mr-1" /> Decline
                      </Button>
                    </>
                  )}
                  
                  {type === 'accepted' && (
                    <Button 
                      asChild
                      size={isMobile ? "sm" : "sm"}
                      variant="outline"
                      className={isMobile ? "px-2 py-1 h-8" : ""}
                    >
                      <Link to={`/messages/${profile.id}`}>
                        <MessageCircle className="h-4 w-4 mr-1" /> Message
                      </Link>
                    </Button>
                  )}
                  
                  {type === 'sent' && (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
