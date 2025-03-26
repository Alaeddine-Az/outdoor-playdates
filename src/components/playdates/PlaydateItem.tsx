
import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface PlaydateItemProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'pending' | 'confirmed' | 'completed';
  onClick: () => void;
}

const PlaydateItem = ({ title, date, time, location, attendees, status, onClick }: PlaydateItemProps) => {
  const statusColors = {
    pending: 'text-muted-foreground',
    confirmed: 'text-primary',
    completed: 'text-secondary'
  };
  
  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed'
  };
  
  return (
    <div 
      className="flex items-start p-4 rounded-lg border border-muted bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
        <Calendar className="h-6 w-6" />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full bg-${status === 'pending' ? 'muted-foreground' : (status === 'confirmed' ? 'primary' : 'secondary')}`}></div>
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

export default PlaydateItem;
