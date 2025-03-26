
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Filter, PlusCircle } from 'lucide-react';
import PlaydateItem from './PlaydateItem';
import { Playdate } from '@/hooks/usePlaydates';

interface PlaydateListProps {
  title: string;
  playdates: Playdate[];
  loading: boolean;
  error: string | null;
  emptyTitle: string;
  emptyMessage: string;
  showCreateButton?: boolean;
}

const PlaydateList = ({ 
  title, 
  playdates, 
  loading, 
  error, 
  emptyTitle, 
  emptyMessage, 
  showCreateButton = false 
}: PlaydateListProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">{title}</h2>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Error loading playdates</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      ) : playdates.length === 0 ? (
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">{emptyTitle}</h3>
          <p className="text-muted-foreground mb-4">
            {emptyMessage}
          </p>
          {showCreateButton && (
            <Button onClick={() => navigate('/create-playdate')} className="button-glow bg-primary hover:bg-primary/90 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create {playdates.length === 0 ? 'the first' : 'a new'} playdate
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {playdates.map((playdate) => (
            <PlaydateItem 
              key={playdate.id}
              title={playdate.title}
              date={playdate.date}
              time={playdate.time}
              location={playdate.location}
              attendees={playdate.attendees}
              status={playdate.status}
              onClick={() => navigate(`/playdate/${playdate.id}`)}
            />
          ))}
        </div>
      )}
      
      {playdates.length > 0 && (
        <div className="mt-6">
          <Button variant="ghost" className="text-muted-foreground w-full">
            View All Playdates
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default PlaydateList;
