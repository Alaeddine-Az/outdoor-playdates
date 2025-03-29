
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
      {/* Header: Title */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">Hosted by {host}</p>
      </div>

      {/* Info: Date, Time, Location, Families */}
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 ml-6">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{time}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{families} {families === 1 ? 'family' : 'families'}</span>
        </div>
      </div>

      {/* Status Badge - Bottom Right */}
      <div className="flex justify-end mt-3">
        <span
          className={cn(
            'px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap',
            statusClass
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default PlaydateCard;
