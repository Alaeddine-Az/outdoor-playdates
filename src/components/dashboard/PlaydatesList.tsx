import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Playdate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  families: number;
}

interface PlaydatesListProps {
  title: string;
  playdates: Playdate[];
  showNewButton?: boolean;
  viewAllLink?: string;
}

const PlaydatesList = ({
  title,
  playdates,
  showNewButton,
  viewAllLink
}: PlaydatesListProps) => {
  return (
    <section className="bg-[#FFF8E5] rounded-3xl px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#F9DA6F] p-2 rounded-xl">
            <CalendarDays className="text-orange-500 w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-neutral-800">{title}</h2>
        </div>
        {showNewButton && (
          <Link to="/playdates/new">
            <Button className="rounded-full bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90">
              + New Playdate
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {playdates.map((playdate) => (
          <div
            key={playdate.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200"
          >
            <h3 className="font-semibold text-md text-neutral-800 mb-2 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#F9DA6F]" />
              {playdate.title}
            </h3>
            <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" />
              {playdate.date}, {playdate.time}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4" />
              {playdate.location}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              {playdate.families} {playdate.families === 1 ? 'family' : 'families'}
            </div>
          </div>
        ))}
      </div>

      {viewAllLink && (
        <div className="text-right mt-4">
          <Link to={viewAllLink} className="text-sm text-primary hover:underline">
            View All Playdates →
          </Link>
        </div>
      )}
    </section>
  );
};

export default PlaydatesList;
