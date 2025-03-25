
import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useOnboardingForm } from '@/hooks/useOnboardingForm';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';
import { submitOnboardingData } from '@/utils/onboardingSubmit';
import type { ChildInfo } from '@/components/onboarding/ChildProfileStep';

interface OnboardingContextType {
  // Form state
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  parentName: string;
  setParentName: (name: string) => void;
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  referrer: string;
  setReferrer: (referrer: string) => void;
  childProfiles: ChildInfo[];
  setChildProfiles: React.Dispatch<React.SetStateAction<ChildInfo[]>>;
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Navigation state
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  
  // Submission state
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isValidZipCode: boolean;
  setIsValidZipCode: (value: boolean) => void;
  validateZipCode: (zipCode: string) => Promise<boolean>;
  handleCompleteSetup: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{
  children: React.ReactNode;
  onComplete?: (email: string) => void;
}> = ({ children, onComplete }) => {
  const form = useOnboardingForm();
  const navigation = useOnboardingNavigation();
  const navigate = useNavigate();

  const handleCompleteSetup = async () => {
    // ✅ Force ZIP code validation before checking required fields
    const zipIsValid = await form.validateZipCode(form.zipCode);
    form.setIsValidZipCode(zipIsValid);

    if (!form.validateRequiredFields()) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all required fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    navigation.setIsSubmitting(true);

    try {
      const result = await submitOnboardingData({
        email: form.email,
        password: form.password,
        parentName: form.parentName,
        zipCode: form.zipCode,
        referrer: form.referrer,
        childProfiles: form.childProfiles,
        interests: form.interests
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: 'Signup Successful',
        description: 'Thank you for signing up! We\'ll be in touch soon.',
      });

      if (onComplete) {
        onComplete(form.email);
      } else {
        navigate('/thank-you', { state: { email: form.email } });
      }

    } catch (err: any) {
      console.error('Signup error:', err);
      toast({
        title: 'Signup Error',
        description: err.message || 'There was an error creating your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      navigation.setIsSubmitting(false);
    }
  };

  const value: OnboardingContextType = {
    ...form,
    ...navigation,
    handleCompleteSetup
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
