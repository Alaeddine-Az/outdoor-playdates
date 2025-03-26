
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PlaydateGroupCardProps {
  id: string;
  name: string;
  members: number;
  lastActive: string;
  creatorId?: string;
}

const PlaydateGroupCard = ({ id, name, members, lastActive, creatorId }: PlaydateGroupCardProps) => {
  const navigate = useNavigate();
  
  const handleViewGroup = () => {
    navigate(`/group/${id}`);
  };
  
  const handleCreatorClick = (e: React.MouseEvent) => {
    if (creatorId) {
      e.stopPropagation();
      navigate(`/parent/${creatorId}`);
    }
  };
  
  return (
    <div 
      className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors cursor-pointer"
      onClick={handleViewGroup}
    >
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
        onClick={handleViewGroup}
      >
        View Group
      </Button>
      {creatorId && (
        <div className="mt-2 text-xs">
          <span 
            className="text-primary hover:underline cursor-pointer" 
            onClick={handleCreatorClick}
          >
            View Creator
          </span>
        </div>
      )}
    </div>
  );
};

export default PlaydateGroupCard;
