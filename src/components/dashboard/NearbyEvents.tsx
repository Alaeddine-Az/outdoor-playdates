import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardEvent } from '@/types';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  id?: string;
  title: string;
  date: string;
  location: string;
}

const EventCard = ({ id, title, date, location }: EventCardProps) => {
  const navigate = useNavigate();

  const getEventIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('nature') || lowerTitle.includes('walk') || lowerTitle.includes('park')) {
      return (
        <span className="text-xl mr-2">🌿</span>
      );
    } else if (lowerTitle.includes('science') || lowerTitle.includes('stem')) {
      return (
        <span className="text-xl mr-2">🔬</span>
      );
    } else if (lowerTitle.includes('art') || lowerTitle.includes('craft')) {
      return (
        <span className="text-xl mr-2">🎨</span>
      );
    } else if (lowerTitle.includes('music') || lowerTitle.includes('sing')) {
      return (
        <span className="text-xl mr-2">🎵</span>
      );
    } else if (lowerTitle.includes('read') || lowerTitle.includes('book')) {
      return (
        <span className="text-xl mr-2">📚</span>
      );
    } else {
      return (
        <span className="text-xl mr-2">🎪</span>
      );
    }
  };

  const handleClick = () => {
    if (id) {
      navigate(`/event/${id}`);
    }
  };

  return (
    <motion.div 
      className={`p-3 sm:p-4 rounded-xl border border-play-beige bg-white hover:border-play-lime/50 hover:bg-play-lime/5 transition-all duration-300 group shadow-sm hover:shadow-md ${id ? 'cursor-pointer' : ''}`}
      whileHover={id ? { y: -4 } : undefined}
      onClick={id ? handleClick : undefined}
      tabIndex={id ? 0 : -1}
      onKeyDown={id ? (e) => { if (e.key === 'Enter') handleClick(); } : undefined}
      role={id ? 'button' : undefined}
      aria-label={id ? `View event details for ${title}` : undefined}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm sm:text-base flex items-center">
          {getEventIcon(title)}
          <span className="line-clamp-2">{title}</span>
        </h4>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
      </div>
      <div className="flex flex-wrap items-center text-xs text-muted-foreground mt-2 gap-2 sm:gap-3">
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-play-beige flex items-center justify-center mr-1.5">
            <Calendar className="h-3 w-3" /> 
          </div>
          <span className="truncate">{date}</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-play-beige flex items-center justify-center mr-1.5">
            <MapPin className="h-3 w-3" /> 
          </div>
          <span className="truncate">{location}</span>
        </div>
      </div>
    </motion.div>
  );
};

interface NearbyEventsProps {
  events: DashboardEvent[];
}

const NearbyEvents = ({ events }: NearbyEventsProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="rounded-3xl border-none shadow-md overflow-hidden">
      <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-play-lime/30 to-green-100 pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-play-lime flex items-center justify-center mr-2 sm:mr-3">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
          </div>
          Nearby Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 bg-white">
        <motion.div 
          className="space-y-2 sm:space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {events.map((event, index) => (
            <motion.div key={index} variants={item}>
              <EventCard {...event} />
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default NearbyEvents;
