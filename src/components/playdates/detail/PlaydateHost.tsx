
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PlaydateHostProps {
  creator: {
    id: string;
    parent_name: string;
    avatar_url?: string;
  } | null;
}

export const PlaydateHost: React.FC<PlaydateHostProps> = ({ creator }) => {
  if (!creator) return null;
  
  return (
    <div className="flex items-center mb-4 bg-primary/5 p-3 rounded-md">
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={creator.avatar_url} alt={creator.parent_name} />
        <AvatarFallback>{creator.parent_name ? creator.parent_name.charAt(0).toUpperCase() : '?'}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-sm text-muted-foreground">Hosted by</div>
        <Link to={`/parent/${creator.id}`} className="font-medium text-primary hover:underline">
          {creator.parent_name}
        </Link>
      </div>
    </div>
  );
};
