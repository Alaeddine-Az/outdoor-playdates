
import { Calendar, Clock, MapPin, Users, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface EventDetailsSectionProps {
  event: any;
  host: any;
  formattedDate: string;
  startTime: string;
  endTime: string;
  participantCount: number;
  childrenCount: number;
  isJoined: boolean;
  onJoinClick: () => void;
  onLeaveEvent: () => void;
}

export const EventDetailsSection = ({
  event,
  host,
  formattedDate,
  startTime,
  endTime,
  participantCount,
  childrenCount,
  isJoined,
  onJoinClick,
  onLeaveEvent,
}: EventDetailsSectionProps) => {
  const eventDate = new Date(event.start_time);

  return (
    <div className="bg-white rounded-xl shadow-soft border border-muted overflow-hidden mb-6">
      <div className="p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <span>{startTime} - {endTime}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              <span>{event.location}, {event.city}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <span>
                {participantCount} {participantCount === 1 ? 'family' : 'families'} joined,&nbsp;
                {childrenCount} {childrenCount === 1 ? 'child' : 'children'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={host.avatar_url} alt={host.parent_name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {host.parent_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm text-muted-foreground">Hosted by</div>
                <Link 
                  to={`/parent/${host.id}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {host.parent_name}
                </Link>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex gap-2 w-full">
              {isJoined ? (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={onLeaveEvent}
                  >
                    Leave Event
                  </Button>
                  <Button 
                    asChild
                    className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white"
                  >
                    <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <Calendar className="h-4 w-4 mr-2" /> Add to Calendar
                    </a>
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={onJoinClick}
                  className="w-full button-glow bg-primary hover:bg-primary/90 text-white"
                >
                  <Users className="h-4 w-4 mr-2" /> Join Event
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
