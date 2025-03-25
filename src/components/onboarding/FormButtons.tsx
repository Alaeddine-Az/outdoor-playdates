
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface FormButtonsProps {
  showBackButton?: boolean;
  onBack?: () => void;
  submitLabel?: string;
  loading?: boolean;
  isValid?: boolean;
}

export const FormButtons: React.FC<FormButtonsProps> = ({
  showBackButton = false,
  onBack,
  submitLabel = 'Continue',
  loading = false,
  isValid = true,
}) => {
  return (
    <div className="pt-4 flex space-x-3">
      {showBackButton && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="flex-1 rounded-xl h-12"
          disabled={loading}
        >
          Back
        </Button>
      )}
      <Button 
        type="submit"
        className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white rounded-xl h-12"
        disabled={loading || !isValid}
      >
        {submitLabel} {submitLabel === 'Continue' && <ChevronRight className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
};
