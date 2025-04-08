
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, User, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChildProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface PlaydateParticipantsProps {
  participantDetails: {
    [key: string]: { 
      parent: any; 
      child: ChildProfile;
      participantId?: string;
    };
  };
  playdateId: string;
  isCompleted: boolean;
  isCanceled: boolean;
  onParticipantRemoved: (participantId: string) => Promise<void>;
  isRemoving?: string[];
}

export const PlaydateParticipants: React.FC<PlaydateParticipantsProps> = ({ 
  participantDetails, 
  playdateId,
  isCompleted,
  isCanceled,
  onParticipantRemoved,
  isRemoving = []
}) => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
      : '?';
  };

  const handleRemoveChild = async (participantId: string, childName: string) => {
    if (!user || !participantId || isCompleted || isCanceled) return;
    
    if (confirm(`Are you sure you want to remove ${childName} from this playdate?`)) {
      await onParticipantRemoved(participantId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Participants ({Object.keys(participantDetails).length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(participantDetails).length === 0 ? (
          <p className="text-muted-foreground text-sm">No participants yet. Be the first to join!</p>
        ) : (
          Object.entries(participantDetails).map(([key, { parent, child, participantId }]) => {
            const isCurrentUserChild = user && parent?.id === user.id;
            const canRemove = isCurrentUserChild && !isCompleted && !isCanceled && participantId;
            const isCurrentlyRemoving = participantId && isRemoving.includes(participantId);
            
            return (
              <div key={key} className="flex items-start space-x-3 p-3 border rounded-lg mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(child?.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{child?.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{child?.age} years</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <User className="inline h-3 w-3 mr-1" />
                    Parent:{' '}
                    {parent ? (
                      <Link to={`/parent/${parent.id}`} className="hover:underline text-primary">
                        {parent.parent_name}
                      </Link>
                    ) : (
                      '?'
                    )}
                  </p>
                </div>
                {canRemove && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveChild(participantId, child?.name)}
                    disabled={isCurrentlyRemoving}
                  >
                    {isCurrentlyRemoving ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></span>
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
