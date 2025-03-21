
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, User, MapPin } from 'lucide-react';

interface ParentProfileStepProps {
  parentName: string;
  setParentName: (name: string) => void;
  location: string;
  setLocation: (location: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ParentProfileStep: React.FC<ParentProfileStepProps> = ({
  parentName,
  setParentName,
  location,
  setLocation,
  nextStep,
  prevStep
}) => {
  return (
    <div>
      <h4 className="text-xl font-medium mb-4">Parent Profile</h4>
      <p className="text-muted-foreground mb-6">
        Tell us a bit about yourself. This helps other parents connect with you.
      </p>
      
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Your full name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Your neighborhood or city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            We use this to match you with nearby families.
          </p>
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
            disabled={!parentName}
          >
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParentProfileStep;
