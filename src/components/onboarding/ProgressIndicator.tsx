
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const completionPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Step {currentStep} of {totalSteps}</p>
        <p className="text-sm font-medium text-primary">{Math.round(completionPercentage)}% complete</p>
      </div>
      
      <Progress value={completionPercentage} className="h-2" />
      
      <div className="hidden sm:flex items-center justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = i + 1;
          return (
            <div 
              key={stepNumber} 
              className={cn(
                "flex flex-col items-center",
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep === stepNumber ? "bg-primary text-white" : 
                  currentStep > stepNumber ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {currentStep > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">
                {stepNumber === 1 && "Account"}
                {stepNumber === 2 && "Parent"}
                {stepNumber === 3 && "Children"}
                {stepNumber === 4 && "Interests"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
