
import React from 'react';
import { Event, ParentProfile } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  hostProfile?: ParentProfile;
  participantCount?: number;
  isJoined?: boolean;
  className?: string;
}

export default function EventCard({ 
  event, 
  hostProfile, 
  participantCount = 0, 
  isJoined, 
  className 
}: EventCardProps) {
  const formattedDate = format(new Date(event.start_time), 'EEE, MMM d, yyyy');
  const formattedTime = `${format(new Date(event.start_time), 'h:mm a')} - ${format(new Date(event.end_time), 'h:mm a')}`;
  
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0 flex flex-col items-center justify-center sm:w-1/4">
            <div className="bg-primary/10 rounded-lg p-4 text-center w-full">
              <CalendarIcon className="h-6 w-6 mx-auto text-primary mb-2" />
              <div className="text-lg font-semibold">{formattedDate}</div>
            </div>
          </div>
          
          <div className="flex-grow space-y-3">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{formattedTime}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.city}</span>
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{participantCount} {participantCount === 1 ? 'family' : 'families'} joined</span>
              </div>
            </div>
            
            {hostProfile && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={hostProfile.avatar_url} alt={hostProfile.parent_name} />
                  <AvatarFallback className="text-xs">{hostProfile.parent_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">Hosted by {hostProfile.parent_name}</span>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                asChild
                className={isJoined 
                  ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                  : "button-glow bg-primary hover:bg-primary/90 text-white"
                }
              >
                <Link to={`/event/${event.id}`}>
                  {isJoined ? 'View Details' : 'Join Event'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
