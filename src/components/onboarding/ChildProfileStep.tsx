
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, CalendarDays } from 'lucide-react';

interface ChildProfileStepProps {
  childName: string;
  setChildName: (name: string) => void;
  childAge: string;
  setChildAge: (age: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ChildProfileStep: React.FC<ChildProfileStepProps> = ({
  childName,
  setChildName,
  childAge,
  setChildAge,
  nextStep,
  prevStep
}) => {
  return (
    <div>
      <h4 className="text-xl font-medium mb-4">Child Information</h4>
      <p className="text-muted-foreground mb-6">
        Tell us about your child to help find compatible playmates.
      </p>
      
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Child's First Name</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="First name only"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            For privacy, we only use first names for children.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Child's Age</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input 
              type="number" 
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Age in years"
              min="1"
              max="12"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
            />
          </div>
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
            onClick={nextStep}
          >
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChildProfileStep;
