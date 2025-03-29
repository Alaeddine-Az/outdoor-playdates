
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
}

interface PlaydatesListProps {
  title: string;
  playdates: Playdate[];
  showNewButton?: boolean;
  viewAllLink?: string;
  className?: string;
}

const PlaydatesList = ({
  title,
  playdates,
  showNewButton = false,
  viewAllLink,
  className = '',
}: PlaydatesListProps) => {
  return (
    <div
      className={cn(
        'rounded-3xl bg-[#FFF9E9] px-4 py-6 md:px-6 md:py-8 space-y-6',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#F9DA6F] p-2 rounded-xl">
            <CalendarDays className="text-orange-500 w-5 h-5" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-neutral-800">
            {title}
          </h2>
        </div>
        {showNewButton && (
          <Link to="/playdates/new" className="self-start md:self-auto">
            <button className="flex items-center gap-2 rounded-full bg-primary text-white px-5 py-2 text-sm hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              <span>New Playdate</span>
            </button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {playdates.length > 0 ? (
          playdates.map((playdate) => (
            <PlaydateCard key={playdate.id} playdate={playdate} />
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No playdates available
          </div>
        )}
      </div>

      {viewAllLink && playdates.length > 0 && (
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
