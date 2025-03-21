
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterestsStepProps {
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
  handleCompleteSetup: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
  email: string;
  parentName: string;
}

const InterestsStep: React.FC<InterestsStepProps> = ({
  interests,
  setInterests,
  handleCompleteSetup,
  prevStep,
  isSubmitting,
  email,
  parentName
}) => {
  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const interestOptions = [
    'Arts & Crafts', 
    'Sports', 
    'Nature Exploration', 
    'STEM Activities', 
    'Music & Dance', 
    'Reading & Books', 
    'Building & Construction', 
    'Imaginative Play', 
    'Outdoor Adventures'
  ];

  return (
    <div>
      <h4 className="text-xl font-medium mb-4">Select Interests</h4>
      <p className="text-muted-foreground mb-6">
        Choose activities your child enjoys. This helps us match with compatible playmates.
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              className={cn(
                "px-4 py-3 rounded-xl border transition-colors text-sm font-medium flex items-center justify-center text-center",
                interests.includes(interest) 
                  ? "border-primary bg-primary/10 text-primary" 
                  : "border-muted bg-white hover:bg-muted/5 text-foreground"
              )}
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
        
        <div className="pt-4 flex space-x-3">
          <Button 
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button 
            className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
            onClick={handleCompleteSetup}
            disabled={isSubmitting || !email || !parentName}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Setup'} <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterestsStep;
