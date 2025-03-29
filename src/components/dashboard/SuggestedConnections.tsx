
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SuggestedConnectionProps {
  id: string;
  name: string;
  childName: string;
  interests: string[];
  distance: string;
}

const ConnectionCard = ({ id, name, childName, interests, distance }: SuggestedConnectionProps) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="p-4 rounded-xl bg-white border border-muted/30 hover:border-primary/20 transition-all duration-300 group shadow-sm hover:shadow-md"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 font-medium cursor-pointer shadow-sm group-hover:shadow-md transition-all"
            onClick={() => navigate(`/parent/${id}`)}
          >
            {name.charAt(0)}
          </div>
          <div className="ml-3">
            <h4 
              className="font-medium text-sm cursor-pointer hover:text-primary transition-colors flex items-center gap-1.5"
              onClick={() => navigate(`/parent/${id}`)}
            >
              {name}
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 group-hover:animate-pulse"></div>
            </h4>
            <div className="flex items-center text-xs text-muted-foreground mt-0.5 flex-wrap gap-x-3">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" /> 
                <span>{childName}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" /> 
                <span>{distance}</span>
              </div>
            </div>
          </div>
        </div>
        <Button 
          size="sm" 
          className="h-8 px-3 bg-white hover:bg-primary/5 text-primary border border-primary/30 rounded-lg shadow-sm"
        >
          <UserPlus className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="flex mt-3 flex-wrap gap-1.5">
        {interests.map((interest, index) => (
          <span 
            key={index} 
            className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 font-medium"
          >
            {interest}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

interface SuggestedConnectionsProps {
  connections: SuggestedConnectionProps[];
}

const SuggestedConnections = ({ connections }: SuggestedConnectionsProps) => {
  const navigate = useNavigate();
  
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
    <Card className="rounded-2xl overflow-hidden border border-muted/30 shadow-md">
      <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-white to-muted/20 pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          Suggested Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {connections.map((connection, index) => (
            <motion.div key={connection.id} variants={item}>
              <ConnectionCard {...connection} />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full rounded-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 font-medium"
            onClick={() => navigate('/connections')}
          >
            Explore All Connections
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedConnections;
