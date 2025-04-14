
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface PlaydateFormActionsProps {
  isSubmitting: boolean;
}

export const PlaydateFormActions: React.FC<PlaydateFormActionsProps> = ({ 
  isSubmitting 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="pt-2 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/playdates')}
        className="w-full"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="w-full button-glow bg-primary hover:bg-primary/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Playdate"}
      </Button>
    </div>
  );
};
