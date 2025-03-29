
import React from 'react';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PlaydateCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'pending' | 'completed';
}

const PlaydateCard = ({ id, title, date, time, location, attendees, status }: PlaydateCardProps) => {
  const navigate = useNavigate();
  
  const statusColors = {
    upcoming: 'from-play-yellow to-play-orange',
    pending: 'from-play-lightBlue to-blue-400',
    completed: 'from-play-lime to-green-400'
  };
  
  const iconBgColors = {
    upcoming: 'bg-play-yellow',
    pending: 'bg-play-lightBlue',
    completed: 'bg-play-lime'
  };
  
  const iconColors = {
    upcoming: 'text-play-orange',
    pending: 'text-blue-600',
    completed: 'text-green-600'
  };
  
  const statusLabels = {
    upcoming: 'Upcoming',
    pending: 'Pending',
    completed: 'Completed'
  };
  
  return (
    <motion.div 
      className="flex items-start p-5 rounded-2xl border border-play-beige bg-white hover:bg-play-beige/10 transition-colors cursor-pointer shadow-sm hover:shadow-md"
      onClick={() => navigate(`/playdate/${id}`)}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${iconBgColors[status]} flex items-center justify-center ${iconColors[status]}`}>
        <Calendar className="h-7 w-7" />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{title}</h3>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${statusColors[status]}`}>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span>{statusLabels[status]}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-play-beige flex items-center justify-center mr-2">
              <Clock className="h-3.5 w-3.5" /> 
            </div>
            {date}, {time}
          </div>
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-play-beige flex items-center justify-center mr-2">
              <MapPin className="h-3.5 w-3.5" /> 
            </div>
            {location}
          </div>
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-play-beige flex items-center justify-center mr-2">
              <Users className="h-3.5 w-3.5" /> 
            </div>
            {attendees} {attendees === 1 ? 'family' : 'families'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaydateCard;
