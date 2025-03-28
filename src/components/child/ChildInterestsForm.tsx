
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';

interface ChildInterestsFormProps {
  selectedInterests: string[];
  setSelectedInterests: React.Dispatch<React.SetStateAction<string[]>>;
  customInterest: string;
  setCustomInterest: React.Dispatch<React.SetStateAction<string>>;
}

// Common child interests for selection
const COMMON_CHILD_INTERESTS = [
  'Drawing', 'Sports', 'Nature', 'Music', 'Reading',
  'Science', 'Building', 'Dolls', 'Cars', 'Animals',
  'Swimming', 'Biking', 'Running', 'Playgrounds', 'Dinosaurs',
  'Princesses', 'Superheroes', 'Magic', 'Dancing', 'Cooking'
];

const ChildInterestsForm = ({ 
  selectedInterests, 
  setSelectedInterests, 
  customInterest, 
  setCustomInterest 
}: ChildInterestsFormProps) => {
  
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
    <Card>
      <CardHeader>
        <CardTitle>Interests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Select your child's interests to help connect with like-minded playmates
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
            {COMMON_CHILD_INTERESTS.map((interest) => (
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
      </CardContent>
    </Card>
  );
};

export default ChildInterestsForm;
