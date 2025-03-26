
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PlaydateGroupCardProps {
  id: string;
  name: string;
  members: number;
  lastActive: string;
}

const PlaydateGroupCard = ({ id, name, members, lastActive }: PlaydateGroupCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <h4 className="font-medium text-sm">{name}</h4>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-muted-foreground">
          <Users className="h-3 w-3 inline mr-1" />
          {members} members
        </span>
        <span className="text-xs text-muted-foreground">
          Active {lastActive}
        </span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2 h-7 text-xs"
        onClick={() => navigate(`/group/${id}`)}
      >
        View Group
      </Button>
    </div>
  );
};

export default PlaydateGroupCard;
