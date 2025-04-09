
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardEvent } from '@/types';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
}

const EventCard = ({ title, date, location }: EventCardProps) => {
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
  
  return (
    <motion.div 
      className="p-4 rounded-xl border border-play-beige bg-white hover:border-play-lime/50 hover:bg-play-lime/5 transition-all duration-300 group shadow-sm hover:shadow-md"
      whileHover={{ y: -4 }}
    >
      <div className="flex justify-between">
        <h4 className="font-medium text-base flex items-center">
          {getEventIcon(title)}
          {title}
        </h4>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex flex-wrap items-center text-xs text-muted-foreground mt-2 gap-3">
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-play-beige flex items-center justify-center mr-1.5">
            <Calendar className="h-3 w-3" /> 
          </div>
          <span>{date}</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-play-beige flex items-center justify-center mr-1.5">
            <MapPin className="h-3 w-3" /> 
          </div>
          <span>{location}</span>
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
          <div className="w-10 h-10 rounded-full bg-play-lime flex items-center justify-center mr-3">
            <Calendar className="h-5 w-5 text-green-700" />
          </div>
          Nearby Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <motion.div 
          className="space-y-3"
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
