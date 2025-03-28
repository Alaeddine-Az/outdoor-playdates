
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, XCircle, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
    <div className="space-y-3">
      <Label className="text-base font-medium">Interests</Label>
      
      <div className="flex flex-wrap gap-2 max-w-2xl">
        {selectedInterests.map((interest) => (
          <Badge 
            key={interest}
            variant="secondary"
            className="rounded-full py-1 px-3 flex items-center gap-1"
          >
            {interest}
            <XCircle 
              className="h-3.5 w-3.5 ml-1 cursor-pointer" 
              onClick={() => removeInterest(interest)}
            />
          </Badge>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-7 gap-1"
          onClick={() => document.getElementById('custom-interest')?.focus()}
        >
          <Plus className="h-3.5 w-3.5" /> Add Interest
        </Button>
      </div>
      
      <div className="flex items-center gap-2 max-w-sm">
        <Input
          id="custom-interest"
          placeholder="Add custom interest..."
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && customInterest) {
              e.preventDefault();
              addInterest(customInterest);
            }
          }}
          className="h-9"
        />
        <Button 
          variant="outline" 
          onClick={() => addInterest(customInterest)}
          disabled={!customInterest}
          className="h-9"
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default InterestsSelector;
