
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, MapPin, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useConnections } from '@/hooks/useConnections';
import { ChildProfile, ParentProfile } from '@/types';

// Extended profile type that includes children data
export interface ProfileWithChildren extends ParentProfile {
  childrenData: ChildProfile[];
}

interface ConnectionCardProps {
  profile: ProfileWithChildren;
}

const ConnectionCard = ({ profile }: ConnectionCardProps) => {
  const navigate = useNavigate();
  const { sendConnectionRequest } = useConnections();
  
  // Generate a color based on the name
  const getColor = (name: string) => {
    const colors = ['pink', 'blue', 'green', 'purple', 'teal'];
    const nameSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[nameSum % colors.length];
  };
  
  const colorMap = {
    pink: 'bg-pink-500 text-white',
    blue: 'bg-play-blue text-white',
    green: 'bg-play-lime text-green-700',
    purple: 'bg-purple-500 text-white',
    teal: 'bg-teal-500 text-white'
  };
  
  const colorClass = colorMap[getColor(profile.parent_name) as keyof typeof colorMap];
  
  // Format children display text
  const childDisplay = profile.childrenData && profile.childrenData.length > 0 
    ? `${profile.childrenData[0].name} (${profile.childrenData[0].age})${profile.childrenData.length > 1 ? ' & others' : ''}` 
    : 'No children';
  
  const handleConnect = async () => {
    try {
      await sendConnectionRequest(profile.id);
      // You could show a toast here to indicate success
    } catch (error) {
      console.error("Error sending connection request:", error);
      // You could show an error toast here
    }
  };
  
  return (
    <motion.div 
      className="p-4 rounded-2xl bg-white border border-play-beige hover:border-play-orange/20 transition-all duration-300 group shadow-sm hover:shadow-md"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center text-xl font-bold cursor-pointer shadow-sm group-hover:shadow-md transition-all`}
            onClick={() => navigate(`/parent/${profile.id}`)}
          >
            {profile.parent_name.charAt(0)}
          </div>
          <div className="ml-3">
            <h4 
              className="font-bold text-base cursor-pointer hover:text-play-orange transition-colors flex items-center gap-1.5"
              onClick={() => navigate(`/parent/${profile.id}`)}
            >
              {profile.parent_name}
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 group-hover:animate-pulse"></div>
            </h4>
            <div className="flex items-center text-xs text-muted-foreground mt-0.5 flex-wrap gap-x-3">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" /> 
                <span>{childDisplay}</span>
              </div>
              {profile.city && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> 
                  <span>{profile.city}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Button 
          size="sm" 
          className="h-9 w-9 p-0 bg-play-beige hover:bg-play-orange/10 text-play-orange border border-play-orange/30 rounded-full shadow-sm"
          onClick={handleConnect}
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>
      
      {profile.interests && profile.interests.length > 0 && (
        <div className="flex mt-3 flex-wrap gap-1.5">
          {profile.interests.slice(0, 3).map((interest, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-1 rounded-full bg-play-lime/30 text-green-700 font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ConnectionCard;
