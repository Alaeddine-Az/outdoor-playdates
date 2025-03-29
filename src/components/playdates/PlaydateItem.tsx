import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaydateItemProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'pending' | 'confirmed' | 'completed';
  onClick: () => void;
}

const statusColors = {
  pending: 'bg-amber-500 text-white',
  confirmed: 'bg-blue-500 text-white',
  completed: 'bg-green-500 text-white',
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
};

const PlaydateItem: React.FC<PlaydateItemProps> = ({
  title,
  date,
  time,
  location,
  attendees,
  status,
  onClick,
}) => {
  const statusClass = statusColors[status] || 'bg-muted text-muted-foreground';

  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-muted bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span
          className={cn(
            'px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap mt-1 sm:mt-0',
            statusClass
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      {/* Info Items */}
      <div className="grid gap-3 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="line-clamp-1">{location}</p>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary flex-shrink-0" />
          <p>
            {attendees} {attendees === 1 ? 'family' : 'families'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaydateItem;
