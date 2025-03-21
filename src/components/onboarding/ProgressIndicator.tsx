
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNumber = i + 1;
        return (
          <div 
            key={stepNumber} 
            className={cn(
              "flex items-center",
              stepNumber < totalSteps && "mr-2"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              currentStep === stepNumber ? "bg-primary text-white" : 
                currentStep > stepNumber ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {currentStep > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div className={cn(
                "w-6 h-0.5 mx-1",
                currentStep > stepNumber ? "bg-primary" : "bg-muted"
              )}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;
