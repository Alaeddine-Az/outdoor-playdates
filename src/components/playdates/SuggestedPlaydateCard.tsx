
import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuggestedPlaydateCardProps {
  title: string;
  date: string;
  location: string;
  numFamilies: number;
}

const SuggestedPlaydateCard = ({ title, date, location, numFamilies }: SuggestedPlaydateCardProps) => {
  return (
    <div className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <Calendar className="h-3 w-3 mr-1" /> 
        <span>{date}</span>
      </div>
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <MapPin className="h-3 w-3 mr-1" /> 
        <span>{location}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-muted-foreground">
          <Users className="h-3 w-3 inline mr-1" />
          {numFamilies} families interested
        </span>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Join
        </Button>
      </div>
    </div>
  );
};

export default SuggestedPlaydateCard;
