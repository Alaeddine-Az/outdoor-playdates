
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PlaydateCard from './PlaydateCard';

interface Playdate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  families: number;
  status?: 'upcoming' | 'past' | 'confirmed' | 'pending' | 'completed';
}

interface PlaydatesListProps {
  title: string;
  playdates: Playdate[];
  showNewButton?: boolean;
  viewAllLink?: string;
}

const PlaydatesList: React.FC<PlaydatesListProps> = ({
  title,
  playdates,
  showNewButton = false,
  viewAllLink,
}) => {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-sm font-medium text-primary hover:underline"
            >
              View All Playdates →
            </Link>
          )}
          {showNewButton && (
            <Link
              to="/create-playdate"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" />
              New Playdate
            </Link>
          )}
        </div>
      </div>

      {/* Playdates Grid */}
      {playdates.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {playdates.map((playdate) => (
            <PlaydateCard
              key={playdate.id}
              title={playdate.title}
              date={playdate.date}
              time={playdate.time}
              location={playdate.location}
              families={playdate.families}
              status={playdate.status}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">
          No playdates found.
        </div>
      )}
    </section>
  );
};

export default PlaydatesList;
