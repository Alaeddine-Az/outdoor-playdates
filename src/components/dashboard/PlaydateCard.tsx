
import React from 'react';
import { Calendar, MapPin, Users, Clock, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface PlaydateCardProps {
  playdate: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    families: number;
    status?: string;
    host?: string;
    host_id?: string;
    distance?: number;
  };
}

const statusColors = {
  upcoming: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
  confirmed: 'bg-blue-500 text-white',
  past: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-500 text-white',
  completed: 'bg-green-500 text-white',
};

const PlaydateCard: React.FC<PlaydateCardProps> = ({ playdate }) => {
  const navigate = useNavigate();
  const { 
    id, 
    title, 
    date, 
    time, 
    location, 
    families, 
    status = 'upcoming', 
    host = 'Unknown Host',
    host_id,
    distance
  } = playdate;
  const statusClass = statusColors[status as keyof typeof statusColors] || 'bg-muted text-muted-foreground';

  const handleClick = () => {
    navigate(`/playdate/${id}`);
  };
  
  const handleHostClick = (e: React.MouseEvent) => {
    if (host_id) {
      e.stopPropagation();
      navigate(`/parent/${host_id}`);
    }
  };

  const showDistance = distance !== undefined;

  return (
    <div 
      className="rounded-xl border border-muted bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          {showDistance && (
            <span className="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-blue-100 text-blue-800">
              {distance < 1 
                ? `${Math.round(distance * 1000)} m away` 
                : `${distance.toFixed(1)} km away`}
            </span>
          )}
          <span
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap mt-1 sm:mt-0',
              statusClass
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      <p 
        className={cn(
          "text-sm font-medium mb-3",
          host_id ? "text-primary cursor-pointer hover:underline" : "text-muted-foreground"
        )}
        onClick={host_id ? handleHostClick : undefined}
      >
        Hosted by {host}
      </p>

      {/* Info Items */}
      <div className="grid gap-3 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="line-clamp-1">{location}</p>
        </div>

        {showDistance && (
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary flex-shrink-0" />
            <p>
              {distance < 1 
                ? `${Math.round(distance * 1000)} meters from you` 
                : `${distance.toFixed(1)} kilometers from you`}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary flex-shrink-0" />
          <p>
            {families} {families === 1 ? 'family' : 'families'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaydateCard;
