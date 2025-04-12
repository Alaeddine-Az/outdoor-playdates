import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Filter, PlusCircle, CalendarDays } from 'lucide-react';
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
  icon?: React.ReactNode;
}

const getPlaydateStatus = (playdate: Playdate): "confirmed" | "upcoming" | "past" | "cancelled" => {
  if (!playdate.start_time || !playdate.end_time) {
    return playdate.status as "confirmed" | "upcoming" | "past" | "cancelled" || "upcoming";
  }
  
  const now = new Date();
  const startDate = new Date(playdate.start_time);
  const endDate = new Date(playdate.end_time);
  
  if (endDate < now) {
    return "past";
  } else if (startDate > now) {
    return "upcoming";
  } else {
    return "confirmed";
  }
};

const PlaydateList = ({ 
  title, 
  playdates, 
  loading, 
  error, 
  emptyTitle, 
  emptyMessage, 
  showCreateButton = false,
  icon
}: PlaydateListProps) => {
  const navigate = useNavigate();
  
  console.log(`Rendering ${title} with ${playdates?.length || 0} playdates:`, 
    { title, count: playdates?.length || 0, hasDistanceValues: playdates?.some(p => p.distance !== undefined) });
  
  // Sort playdates by distance if available, otherwise by start time
  const sortedPlaydates = [...(playdates || [])].sort((a, b) => {
    // If both playdates have distance, sort by distance
    if (a?.distance !== undefined && b?.distance !== undefined) {
      return a.distance - b.distance;
    }
    // If only one has distance, prioritize the one with distance
    if (a?.distance !== undefined) return -1;
    if (b?.distance !== undefined) return 1;
    // Otherwise sort by start_time
    if (a?.start_time && b?.start_time) {
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    }
    return 0;
  });
  
  return (
    <section className="bg-white rounded-xl shadow-soft border border-muted p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {icon || <CalendarDays className="h-5 w-5 text-primary" />}
          <h2 className="text-xl font-medium">{title}</h2>
        </div>
        <Button variant="outline" size="sm" className="hover:bg-secondary/10 hover:text-secondary transition-colors">
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
          <p className="text-muted-foreground">
            {typeof error === 'object' ? 'An error occurred' : error}
          </p>
        </div>
      ) : sortedPlaydates.length === 0 ? (
        <div className="p-8 text-center bg-muted/30 rounded-xl">
          <h3 className="text-lg font-medium mb-2">{emptyTitle}</h3>
          <p className="text-muted-foreground mb-4">
            {emptyMessage}
          </p>
          {showCreateButton && (
            <Button onClick={() => navigate('/create-playdate')} className="button-glow bg-primary hover:bg-primary/90 text-white bounce-hover">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create {sortedPlaydates.length === 0 ? 'the first' : 'a new'} playdate
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPlaydates.map((playdate) => {
            if (!playdate || !playdate.id) {
              console.warn('Invalid playdate found in list:', playdate);
              return null;
            }
            
            console.log(`Rendering playdate ${playdate.id}`, {
              host: playdate.host, 
              host_id: playdate.host_id,
              distance: playdate.distance
            });
            
            return (
              <PlaydateItem 
                key={playdate.id}
                id={playdate.id}
                title={playdate.title}
                date={playdate.date}
                time={playdate.time}
                location={playdate.location}
                attendees={playdate.families}
                host={playdate.host}
                host_id={playdate.host_id}
                status={getPlaydateStatus(playdate)}
                distance={playdate.distance}
                onClick={() => navigate(`/playdate/${playdate.id}`)}
              />
            );
          })}
        </div>
      )}
      
      {sortedPlaydates.length > 0 && (
        <div className="mt-6">
          <Button variant="ghost" className="text-muted-foreground w-full hover:text-primary hover:bg-primary/5 transition-colors">
            View All Playdates
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default PlaydateList;
