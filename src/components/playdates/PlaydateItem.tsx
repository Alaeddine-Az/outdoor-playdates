
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PlaydateItemProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status?: 'upcoming' | 'confirmed' | 'past' | 'cancelled';
  onClick?: () => void;
  id: string;
  host?: string;
  host_id?: string;
}

const statusColors = {
  upcoming: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  confirmed: 'bg-green-100 text-green-800 hover:bg-green-200',
  past: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  cancelled: 'bg-red-100 text-red-800 hover:bg-red-200',
};

const PlaydateItem = ({
  id,
  title,
  date,
  time,
  location,
  attendees,
  status = 'upcoming',
  onClick,
  host,
  host_id,
}: PlaydateItemProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/playdate/${id}`);
    }
  };
  
  const handleHostClick = (e: React.MouseEvent) => {
    if (host_id) {
      e.stopPropagation();
      navigate(`/parent/${host_id}`);
    }
  };
  
  return (
    <div
      className="bg-white rounded-lg border border-muted p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      
      {host && host_id && (
        <p 
          className="text-sm text-primary hover:underline cursor-pointer mb-3"
          onClick={handleHostClick}
        >
          <User className="h-3 w-3 inline mr-1" />
          Hosted by {host}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{date}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{time}</span>
        </div>
        
        <div className="flex items-center gap-2 md:col-span-2">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary flex-shrink-0" />
          <span>
            {attendees} {attendees === 1 ? 'family' : 'families'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaydateItem;
