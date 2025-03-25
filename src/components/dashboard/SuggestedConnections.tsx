
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex items-center justify-between p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <div className="flex items-center">
        <div 
          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium cursor-pointer"
          onClick={() => navigate(`/parent/${id}`)}
        >
          {name.charAt(0)}
        </div>
        <div className="ml-3">
          <h4 
            className="font-medium text-sm cursor-pointer hover:text-primary"
            onClick={() => navigate(`/parent/${id}`)}
          >
            {name}
          </h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" /> 
            <span>{childName}</span>
            <span className="mx-1">•</span>
            <MapPin className="h-3 w-3 mr-1" /> 
            <span>{distance}</span>
          </div>
          <div className="flex mt-1 gap-1">
            {interests.map((interest, index) => (
              <span key={index} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm" className="h-8">
        Connect
      </Button>
    </div>
  );
};

interface SuggestedConnectionsProps {
  connections: SuggestedConnectionProps[];
}

const SuggestedConnections = ({ connections }: SuggestedConnectionsProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Suggested Connections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {connections.map((connection) => (
            <ConnectionCard key={connection.id} {...connection} />
          ))}
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full"
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
