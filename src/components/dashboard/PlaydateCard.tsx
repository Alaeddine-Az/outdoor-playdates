
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
    upcoming: 'from-yellow-400 to-orange-400',
    pending: 'from-blue-400 to-indigo-400',
    completed: 'from-green-400 to-emerald-400'
  };
  
  const iconBgColors = {
    upcoming: 'bg-yellow-100',
    pending: 'bg-blue-100',
    completed: 'bg-green-100'
  };
  
  const iconColors = {
    upcoming: 'text-yellow-600',
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
      className="flex items-start p-5 rounded-2xl border border-muted/30 bg-white hover:bg-muted/5 transition-colors cursor-pointer shadow-sm hover:shadow-md"
      onClick={() => navigate(`/playdate/${id}`)}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${iconBgColors[status]} flex items-center justify-center ${iconColors[status]}`}>
        <Calendar className="h-6 w-6" />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{title}</h3>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${statusColors[status]}`}>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span>{statusLabels[status]}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center mr-2">
              <Clock className="h-3.5 w-3.5" /> 
            </div>
            {date}, {time}
          </div>
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center mr-2">
              <MapPin className="h-3.5 w-3.5" /> 
            </div>
            {location}
          </div>
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center mr-2">
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
