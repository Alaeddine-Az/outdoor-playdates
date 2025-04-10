import React from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import PlaydateCard from './PlaydateCard';

interface Playdate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  families: number;
  status?: string;
  host?: string;
  host_id?: string;
  start_time?: string;
  distance?: number;
}

interface PlaydatesListProps {
  title: string;
  playdates: Playdate[];
  showNewButton?: boolean;
  viewAllLink?: string;
  className?: string;
  limit?: number;
  icon?: React.ReactNode;
}

const PlaydatesList = ({
  title,
  playdates,
  showNewButton = false,
  viewAllLink,
  className = '',
  limit = 6,
  icon = <CalendarDays className="text-orange-500 w-5 h-5" />
}: PlaydatesListProps) => {
  const sortedPlaydates = [...playdates].sort((a, b) => {
    if (a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    }
    if (a.start_time && b.start_time) {
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    }
    return 0;
  });

  const limitedPlaydates = sortedPlaydates.slice(0, limit);

  return (
    <div
      className={cn(
        'rounded-3xl bg-[#FFF9E9] px-4 py-6 md:px-6 md:py-8 space-y-6 shadow-md',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#F9DA6F] p-2 rounded-xl">
            {icon}
          </div>
          <h2 className="text-lg md:text-xl font-bold text-neutral-800">
            {title}
          </h2>
        </div>
        {showNewButton && (
          <Link to="/create-playdate" className="self-start md:self-auto">
            <button className="flex items-center gap-2 rounded-full bg-primary text-white px-5 py-2 text-sm hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              <span>New Playdate</span>
            </button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {limitedPlaydates.length > 0 ? (
          limitedPlaydates.map((playdate) => (
            <PlaydateCard key={playdate.id} playdate={playdate} />
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No playdates available
          </div>
        )}
      </div>

      {viewAllLink && playdates.length > limit && (
        <div className="text-right mt-4">
          <Link
            to={viewAllLink}
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
      )}
    </div>
  );
};

export default PlaydatesList;
