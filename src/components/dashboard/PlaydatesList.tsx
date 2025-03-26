
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlaydateCard from './PlaydateCard';

interface Playdate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'pending' | 'completed';
}

interface PlaydatesListProps {
  title: string;
  playdates: Playdate[];
  showNewButton?: boolean;
  viewAllLink?: string;
}

const PlaydatesList = ({ title, playdates, showNewButton = false, viewAllLink = '/playdates' }: PlaydatesListProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
        {showNewButton && (
          <Button 
            className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl" 
            onClick={() => navigate('/create-playdate')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Playdate
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {playdates.length > 0 ? (
            playdates.map((playdate) => (
              <PlaydateCard 
                key={playdate.id}
                id={playdate.id}
                title={playdate.title}
                date={playdate.date}
                time={playdate.time}
                location={playdate.location}
                attendees={playdate.attendees}
                status={playdate.status}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No playdates found
            </div>
          )}
        </div>
        
        {playdates.length > 0 && (
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              className="text-muted-foreground"
              onClick={() => navigate(viewAllLink)}
            >
              View All Playdates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaydatesList;
