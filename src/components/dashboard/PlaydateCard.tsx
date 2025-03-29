import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaydateCardProps {
  playdate: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    families: number;
    status?: string;
    host?: string;
  };
}

const statusColors = {
  upcoming: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
  confirmed: 'bg-blue-500 text-white',
  past: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-500 text-white',
  completed: 'bg-green-500 text-white',
};

const PlaydateCard: React.FC<PlaydateCardProps> = ({ playdate }) => {
  const { title, date, time, location, families, status = 'upcoming', host = 'Unknown Host' } = playdate;
  const statusClass = statusColors[status as keyof typeof statusColors] || 'bg-muted text-muted-foreground';

  return (
    <div className="rounded-xl border border-muted bg-white p-4 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span
          className={cn(
            'px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap mt-1 sm:mt-0',
            statusClass
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <p className="text-sm font-medium text-primary mb-3">Hosted by {host}</p>

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
            {families} {families === 1 ? 'family' : 'families'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaydateCard;
