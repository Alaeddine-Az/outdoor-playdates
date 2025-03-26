
import { useState } from 'react';

export function useOnboardingNavigation(initialStep = 1) {
  const [step, setStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };

  return {
    step,
    setStep,
    nextStep,
    prevStep,
    isSubmitting,
    setIsSubmitting
  };
}
