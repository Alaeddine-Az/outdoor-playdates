
import React from 'react';
import { Connection, ParentProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, UserCheck, UserX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

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
  
  if (connections.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
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
    <div className="grid gap-4">
      {connections.map((connection) => {
        const otherId = connection.requester_id === user?.id 
          ? connection.recipient_id 
          : connection.requester_id;
        
        const profile = profiles[otherId];
        
        if (!profile) return null;
        
        return (
          <Card key={connection.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer" 
                  onClick={() => handleUserClick(profile.id)}
                >
                  <Avatar>
                    <AvatarImage src={profile.avatar_url} alt={profile.parent_name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile.parent_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium hover:text-primary transition-colors">
                      {profile.parent_name}
                    </span>
                    {profile.city && (
                      <p className="text-sm text-muted-foreground">{profile.city}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {type === 'pending' && onRespond && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onRespond(connection.id, true)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" /> Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onRespond(connection.id, false)}
                      >
                        <UserX className="h-4 w-4 mr-1" /> Decline
                      </Button>
                    </>
                  )}
                  
                  {type === 'accepted' && (
                    <Button 
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <Link to={`/messages/${profile.id}`}>
                        <MessageCircle className="h-4 w-4 mr-1" /> Message
                      </Link>
                    </Button>
                  )}
                  
                  {type === 'sent' && (
                    <span className="text-sm text-muted-foreground">Pending</span>
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
