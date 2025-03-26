
import React, { createContext, useContext, useState } from 'react';
import { submitOnboardingData } from '@/utils/onboardingSubmit';
import type { ChildInfo } from '@/components/onboarding/ChildProfileStep';
import { toast } from '@/components/ui/use-toast';

interface OnboardingContextType {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  parentName: string;
  setParentName: (name: string) => void;
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  isValidZipCode: boolean;
  setIsValidZipCode: (isValid: boolean) => void;
  validateZipCode: (zipCode: string) => boolean;
  referrer: string;
  setReferrer: (referrer: string) => void;
  childProfiles: ChildInfo[];
  setChildProfiles: (children: ChildInfo[]) => void;
  interests: string[];
  setInterests: (interests: string[]) => void;
  isSubmitting: boolean;
  handleCompleteSetup: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: React.ReactNode;
  onComplete?: (email: string) => void;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
  onComplete = () => {}
}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isValidZipCode, setIsValidZipCode] = useState(true);
  const [referrer, setReferrer] = useState('');
  const [childProfiles, setChildProfiles] = useState<ChildInfo[]>([{ id: '1', name: '', age: '' }]);
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const validateZipCode = (zipCode: string): boolean => {
    // Simple validation for US zip code format (5 digits, or 5+4)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };
  
  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    
    try {
      const result = await submitOnboardingData({
        email,
        phone,
        parentName,
        zipCode,
        referrer,
        childProfiles,
        interests
      });
      
      if (result.success) {
        toast({
          title: "Registration submitted!",
          description: "Thank you for your interest. We'll contact you soon with an invitation!",
        });
        
        onComplete(email);
      } else {
        toast({
          title: "Submission Error",
          description: result.error || "There was an error submitting your information. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleCompleteSetup:', error);
      toast({
        title: "Unexpected Error",
        description: "There was an unexpected error. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <OnboardingContext.Provider 
      value={{
        step,
        nextStep,
        prevStep,
        email,
        setEmail,
        phone,
        setPhone,
        parentName,
        setParentName,
        zipCode,
        setZipCode,
        isValidZipCode,
        setIsValidZipCode,
        validateZipCode,
        referrer,
        setReferrer,
        childProfiles,
        setChildProfiles,
        interests,
        setInterests,
        isSubmitting,
        handleCompleteSetup
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
