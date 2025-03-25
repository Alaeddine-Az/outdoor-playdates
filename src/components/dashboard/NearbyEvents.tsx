
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
}

const EventCard = ({ title, date, location }: EventCardProps) => {
  return (
    <div className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <Calendar className="h-3 w-3 mr-1" /> 
        <span>{date}</span>
        <span className="mx-1">•</span>
        <MapPin className="h-3 w-3 mr-1" /> 
        <span>{location}</span>
      </div>
    </div>
  );
};

interface NearbyEventsProps {
  events: EventCardProps[];
}

const NearbyEvents = ({ events }: NearbyEventsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Nearby Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyEvents;
