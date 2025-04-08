import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface SuggestedConnectionProps {
  id: string;
  name: string;
  childName: string;
  interests: string[];
  city: string;
}

const ConnectionCard = ({ id, name, childName, interests, city }: SuggestedConnectionProps) => {
  const navigate = useNavigate();

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

  const colorClass = useMemo(() => {
    const color = getColor(name);
    return colorMap[color as keyof typeof colorMap];
  }, [name]);

  return (
    <motion.div 
      className="p-4 rounded-2xl bg-white border border-play-beige hover:border-play-orange/20 transition-all duration-300 group shadow-sm hover:shadow-md"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center text-xl font-bold cursor-pointer shadow-sm group-hover:shadow-md transition-all`}
            title={`View ${name}'s profile`}
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
                <span>{city}</span>
              </div>
            </div>
          </div>
        </div>
        <Button 
          size="sm" 
          className="h-9 w-9 p-0 bg-play-beige hover:bg-play-orange/10 text-play-orange border border-play-orange/30 rounded-full shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
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

const SuggestedConnections = () => {
  const [connections, setConnections] = useState<SuggestedConnectionProps[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('suggested_connections') // replace with your table name
        .select('id, name, child_name, interests, city');

      if (error) {
        console.error('Error fetching suggested connections:', error);
      } else {
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          childName: item.child_name,
          interests: item.interests,
          city: item.city
        }));
        setConnections(mappedData);
      }

      setLoading(false);
    };

    fetchConnections();
  }, []);

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
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading suggestions...</div>
        ) : connections.length === 0 ? (
          <div className="text-sm text-muted-foreground">No suggested connections at the moment.</div>
        ) : (
          <>
            <motion.div 
              className="space-y-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {connections.map((connection) => (
                <motion.div key={connection.id} variants={item}>
                  <ConnectionCard {...connection} />
                </motion.div>
              ))}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestedConnections;
