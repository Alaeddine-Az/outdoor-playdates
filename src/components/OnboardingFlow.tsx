
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import OnboardingContainer from './onboarding/OnboardingContainer';
import StepManager from './onboarding/StepManager';

const OnboardingFlow: React.FC<{ id?: string }> = ({ id }) => {
  const navigate = useNavigate();
  
  const handleComplete = (email: string) => {
    navigate('/thank-you', { state: { email } });
  };
  
  return (
    <OnboardingProvider onComplete={handleComplete}>
      <OnboardingContainer id={id}>
        <StepManager />
      </OnboardingContainer>
    </OnboardingProvider>
  );
};

export default OnboardingFlow;
