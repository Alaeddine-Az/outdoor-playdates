
import React from 'react';
import { format } from 'date-fns';
import { CalendarClock, MapPin } from 'lucide-react';

interface PlaydateInfoProps {
  playdate: {
    start_time: string;
    end_time: string;
    location: string;
    description?: string;
  };
}

export const PlaydateInfo: React.FC<PlaydateInfoProps> = ({ playdate }) => {
  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        <CalendarClock className="inline w-4 h-4 mr-1" />
        {format(new Date(playdate.start_time), 'PPPp')} –{' '}
        {format(new Date(playdate.end_time), 'p')}
      </div>

      <div className="mb-4">
        <MapPin className="inline w-4 h-4 mr-1" />
        <span className="font-medium">{playdate.location}</span>
      </div>

      <div className="w-full h-64 rounded overflow-hidden border">
        <iframe
          title="Map"
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: 0 }}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            playdate.location
          )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        />
      </div>
      
      {playdate.description && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-1">About this Playdate</h3>
          <p className="text-muted-foreground">{playdate.description}</p>
        </div>
      )}
    </>
  );
};
