
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChildProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { RemoveParticipantDialog } from './RemoveParticipantDialog';

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
  onParticipantRemoved: (participantId: string, childId: string) => Promise<void>;
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

  // Dialog state for removal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    participantId: string;
    childId: string;
    childName: string;
  } | null>(null);

  const handleRemoveChildClick = (
    participantId: string,
    childId: string,
    childName: string
  ) => {
    setPendingRemove({ participantId, childId, childName });
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setPendingRemove(null);
  };

  const handleDialogConfirm = async () => {
    if (
      pendingRemove &&
      pendingRemove.participantId &&
      pendingRemove.childId &&
      !isCompleted &&
      !isCanceled
    ) {
      await onParticipantRemoved(pendingRemove.participantId, pendingRemove.childId);
    }
    setDialogOpen(false);
    setPendingRemove(null);
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
                  <AvatarImage src={parent?.avatar_url} alt={child?.name} />
                  <AvatarFallback>{getInitials(child?.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{child?.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{child?.age} years</p>
                  {child?.interests && child.interests.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Interests: {child.interests.join(', ')}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    <User className="inline h-3 w-3 mr-1" />
                    Parent:{' '}
                    {parent ? (
                      <Link to={`/parent/${parent.id}`} className="hover:underline text-primary">
                        {parent.parent_name}
                      </Link>
                    ) : (
                      'Unknown'
                    )}
                  </p>
                </div>
                {canRemove && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveChildClick(participantId!, child.id, child.name)}
                      disabled={isCurrentlyRemoving}
                    >
                      {isCurrentlyRemoving ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></span>
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span className="sr-only">Remove</span>
                    </Button>
                  </>
                )}
              </div>
            );
          })
        )}
        {/* Show dialog if needed */}
        {pendingRemove && (
          <RemoveParticipantDialog
            open={dialogOpen}
            childName={pendingRemove.childName}
            onCancel={handleDialogCancel}
            onConfirm={handleDialogConfirm}
            loading={
              pendingRemove.participantId
                ? isRemoving.includes(pendingRemove.participantId)
                : false
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
