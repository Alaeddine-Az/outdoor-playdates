
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useConnections } from '@/hooks/useConnections';
import ConnectionCard, { ProfileWithChildren } from '@/components/dashboard/ConnectionCard';
import ConnectionSkeleton from '@/components/dashboard/ConnectionSkeleton';
import { containerAnimation, itemAnimation } from '@/components/dashboard/animations';

interface SuggestedConnectionsProps {
  profiles: ProfileWithChildren[];
}

const SuggestedConnections = ({ profiles = [] }: SuggestedConnectionsProps) => {
  const navigate = useNavigate();
  const { loading } = useConnections();
  
  if (loading) {
    return <ConnectionSkeleton />;
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
            variants={containerAnimation}
            initial="hidden"
            animate="show"
          >
            {profiles.map((profile) => (
              <motion.div key={profile.id} variants={itemAnimation}>
                <ConnectionCard profile={profile} />
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
