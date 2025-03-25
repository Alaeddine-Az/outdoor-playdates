
import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaydateCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'pending' | 'completed';
}

const PlaydateCard = ({ id, title, date, time, location, attendees, status }: PlaydateCardProps) => {
  const navigate = useNavigate();
  
  const statusColors = {
    upcoming: 'text-secondary',
    pending: 'text-muted-foreground',
    completed: 'text-primary'
  };
  
  const statusLabels = {
    upcoming: 'Upcoming',
    pending: 'Pending',
    completed: 'Completed'
  };
  
  return (
    <div 
      className="flex items-start p-4 rounded-lg border border-muted bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => navigate(`/playdate/${id}`)}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <Calendar className="h-6 w-6" />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full bg-${status === 'upcoming' ? 'secondary' : (status === 'pending' ? 'muted-foreground' : 'primary')}`}></div>
            <span className={`text-xs capitalize ${statusColors[status]}`}>{statusLabels[status]}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" /> 
            {date}, {time}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" /> 
            {location}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" /> 
            {attendees} {attendees === 1 ? 'family' : 'families'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaydateCard;
