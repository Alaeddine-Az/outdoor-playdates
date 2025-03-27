
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, XCircle } from 'lucide-react';

interface InterestsSelectorProps {
  selectedInterests: string[];
  setSelectedInterests: (interests: string[]) => void;
  commonInterests: string[];
}

const InterestsSelector: React.FC<InterestsSelectorProps> = ({
  selectedInterests,
  setSelectedInterests,
  commonInterests
}) => {
  const [customInterest, setCustomInterest] = useState('');

  const addInterest = (interest: string) => {
    if (interest && !selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
    setCustomInterest('');
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      removeInterest(interest);
    } else {
      addInterest(interest);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Select interests that help other parents connect with you. These will be visible on your profile.
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedInterests.map((interest) => (
          <Badge 
            key={interest}
            variant="secondary"
            className="rounded-full py-1.5 px-3 flex items-center gap-1 text-sm"
          >
            {interest}
            <XCircle 
              className="h-4 w-4 ml-1 cursor-pointer" 
              onClick={() => removeInterest(interest)}
            />
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add a custom interest..."
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && customInterest) {
              e.preventDefault();
              addInterest(customInterest);
            }
          }}
        />
        <Button 
          variant="outline" 
          onClick={() => addInterest(customInterest)}
          disabled={!customInterest}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Common Interests</p>
        <div className="flex flex-wrap gap-2">
          {commonInterests.map((interest) => (
            <Badge 
              key={interest}
              variant={selectedInterests.includes(interest) ? "default" : "outline"}
              className="rounded-full py-1.5 px-3 cursor-pointer"
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterestsSelector;
