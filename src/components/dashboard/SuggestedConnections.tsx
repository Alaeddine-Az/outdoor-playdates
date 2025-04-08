
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, UserPlus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useConnections } from '@/hooks/useConnections';
import { toast } from '@/components/ui/use-toast';

interface SuggestedConnectionProps {
  id: string;
  name: string;
  childName: string;
  interests: string[];
  distance: string;
}

const ConnectionCard = ({ id, name, childName, interests, distance }: SuggestedConnectionProps) => {
  const navigate = useNavigate();
  const { sendConnectionRequest, isConnected, hasPendingRequest } = useConnections();
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(hasPendingRequest(id));
  
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
  
  const colorClass = colorMap[getColor(name) as keyof typeof colorMap];

  const handleSendRequest = async () => {
    if (isConnected(id) || hasSent) return;
    
    setIsSending(true);
    const result = await sendConnectionRequest(id);
    setIsSending(false);
    
    if (result.success) {
      setHasSent(true);
      toast({
        title: "Connection Request Sent",
        description: `Your connection request was sent to ${name}.`
      });
    } else {
      toast({
        title: "Failed to Send Request",
        description: result.error || "Could not send connection request.",
        variant: "destructive"
      });
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
            onClick={() => navigate(`/parent/${id}`)}
          >
            {name.charAt(0)}
          </div>
          <div className="ml-3">
            <h4 
              className="font-bold text-base cursor-pointer hover:text-play-orange transition-colors flex items-center gap-1.5"
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
          className={`h-9 w-9 p-0 ${hasSent ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-play-beige hover:bg-play-orange/10 text-play-orange border border-play-orange/30'} rounded-full shadow-sm`}
          onClick={handleSendRequest}
          disabled={isSending || hasSent || isConnected(id)}
        >
          {isSending ? (
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : hasSent ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex mt-3 flex-wrap gap-1.5">
        {interests.map((interest, index) => (
          <span 
            key={index} 
            className="text-xs px-2 py-1 rounded-full bg-play-lime/30 text-green-700 font-medium"
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
    <Card className="rounded-3xl overflow-hidden border-none shadow-md">
      <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-play-purple/20 to-purple-100 pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <div className="w-10 h-10 rounded-full bg-play-purple/20 flex items-center justify-center mr-3 text-purple-600">
            <Users className="h-5 w-5" />
          </div>
          Suggested Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {connections.length > 0 ? (
            connections.map((connection) => (
              <motion.div key={connection.id} variants={item}>
                <ConnectionCard {...connection} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No suggested connections available right now.
            </div>
          )}
        </motion.div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full rounded-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 font-medium"
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
