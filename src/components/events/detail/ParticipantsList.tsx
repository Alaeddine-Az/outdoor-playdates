
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ParticipantsListProps {
  participants: any[];
  participantProfiles: Record<string, any>;
}

export const ParticipantsList = ({ participants, participantProfiles }: ParticipantsListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-soft border border-muted p-6">
      <h2 className="text-xl font-semibold mb-4">Participants</h2>
      {participants.length === 0 ? (
        <p className="text-muted-foreground">No participants yet. Be the first to join!</p>
      ) : (
        <div className="space-y-4">
          {participants.map(participant => {
            const profile = participantProfiles[participant.parent_id];
            if (!profile) return null;
            
            const participantChildrenCount = participant.children_ids.length;
            
            return (
              <div key={participant.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={profile.avatar_url} alt={profile.parent_name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile.parent_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link 
                      to={`/parent/${profile.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {profile.parent_name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {participantChildrenCount} {participantChildrenCount === 1 ? 'child' : 'children'}
                    </div>
                  </div>
                </div>
                
                <Button 
                  asChild
                  variant="ghost" 
                  size="sm"
                >
                  <Link to={`/parent/${profile.id}`}>
                    <User className="h-4 w-4 mr-1" /> Profile
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
