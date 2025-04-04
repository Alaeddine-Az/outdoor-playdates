
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useConnections } from '@/hooks/useConnections';
import { supabase } from '@/integrations/supabase/client';
import { ParentProfile } from '@/types';

interface SuggestedConnectionProps {
  id: string;
  name: string;
  childName: string;
  interests: string[];
  distance: string;
}

// Component that displays a single connection card
const ConnectionCard = ({ 
  profile, 
  children, 
  onConnect 
}: { 
  profile: ParentProfile;
  children: { name: string, age: string }[];
  onConnect: (profileId: string) => void;
}) => {
  const navigate = useNavigate();
  
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
  const childDisplay = children.length > 0 
    ? `${children[0].name} (${children[0].age})${children.length > 1 ? ' & others' : ''}` 
    : 'No children';
  
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
          onClick={() => onConnect(profile.id)}
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

const useSuggestedProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ParentProfile[]>([]);
  const [profileChildren, setProfileChildren] = useState<Record<string, { name: string, age: string }[]>>({});
  const [loading, setLoading] = useState(true);
  const { isConnected, hasPendingRequest } = useConnections();

  useEffect(() => {
    const fetchSuggestedProfiles = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch profiles excluding current user
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .limit(5);
          
        if (profilesError) throw profilesError;
        
        // Filter out profiles the user is already connected to or has sent a request to
        const filteredProfiles = (profilesData || []).filter(profile => {
          return !isConnected(profile.id) && !hasPendingRequest(profile.id);
        });
        
        setProfiles(filteredProfiles);
        
        // Fetch children for each profile
        for (const profile of filteredProfiles) {
          const { data: childrenData, error: childrenError } = await supabase
            .from('children')
            .select('name, age')
            .eq('parent_id', profile.id);
            
          if (childrenError) throw childrenError;
          
          setProfileChildren(prev => ({
            ...prev,
            [profile.id]: childrenData || []
          }));
        }
      } catch (error) {
        console.error("Error fetching suggested profiles:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestedProfiles();
  }, [user, isConnected, hasPendingRequest]);
  
  return { profiles, profileChildren, loading };
};

const SuggestedConnections = () => {
  const navigate = useNavigate();
  const { profiles, profileChildren, loading } = useSuggestedProfiles();
  const { sendConnectionRequest } = useConnections();
  
  const handleConnect = async (profileId: string) => {
    try {
      await sendConnectionRequest(profileId);
      // You could show a toast here to indicate success
    } catch (error) {
      console.error("Error sending connection request:", error);
      // You could show an error toast here
    }
  };
  
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
  
  if (loading) {
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
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="p-4 rounded-2xl animate-pulse bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted"></div>
                  <div className="flex-1">
                    <div className="h-5 w-24 bg-muted rounded mb-2"></div>
                    <div className="h-3 w-32 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
        {profiles.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            <p>No suggested connections available right now.</p>
            <p className="text-sm mt-2">Check back later for new connections!</p>
          </div>
        ) : (
          <motion.div 
            className="space-y-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {profiles.map((profile) => (
              <motion.div key={profile.id} variants={item}>
                <ConnectionCard 
                  profile={profile} 
                  children={profileChildren[profile.id] || []} 
                  onConnect={handleConnect}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        
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
