
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChildProfile } from '@/types';

interface PlaydateParticipantsProps {
  participantDetails: {
    [key: string]: { parent: any; child: ChildProfile };
  };
}

export const PlaydateParticipants: React.FC<PlaydateParticipantsProps> = ({ participantDetails }) => {
  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
      : '?';
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
        {Object.entries(participantDetails).map(([key, { parent, child }]) => (
          <div key={key} className="flex items-start space-x-3 p-3 border rounded-lg mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(child?.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{child?.name}</p>
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
