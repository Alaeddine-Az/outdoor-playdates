
import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
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
  const { title, date, time, location, families, status = 'upcoming' } = playdate;
  const statusClass = statusColors[status as keyof typeof statusColors] || 'bg-muted text-muted-foreground';

  return (
    <div className="rounded-xl border border-muted bg-white p-4 shadow-sm hover:shadow-md transition-all space-y-4">
      {/* Header: Title + Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span
          className={cn(
            'px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap w-fit',
            statusClass
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Info: Date, Location, Families */}
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{date}, {time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span>{families} {families === 1 ? 'family' : 'families'}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaydateCard;
