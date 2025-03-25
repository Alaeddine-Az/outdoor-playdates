
import React, { createContext, useContext, useState } from 'react';
import { ChildInfo } from '@/components/onboarding/ChildProfileStep';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';

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
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [referrer, setReferrer] = useState('');
  const [childProfiles, setChildProfiles] = useState<ChildInfo[]>([{ name: "", age: "" }]);
  const [interests, setInterests] = useState<string[]>([]);
  const [isValidZipCode, setIsValidZipCode] = useState(false);
  
  // Navigation state
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const nextStep = () => {
    setStep(step + 1);
    // Removed automatic scroll to top to fix issue #1
  };
  
  const prevStep = () => {
    setStep(step - 1);
    // Removed automatic scroll to top to fix issue #1
  };

  const navigate = useNavigate();

  // Validate ZIP code with an API
  const validateZipCode = async (zipCode: string): Promise<boolean> => {
    if (!zipCode) return false;
    
    // Perform basic validation first (US format: 5 digits)
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      setIsValidZipCode(false);
      return false;
    }
    
    try {
      // Use Zippopotam.us API for ZIP validation (free and no API key required)
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      const isValid = response.ok;
      setIsValidZipCode(isValid);
      return isValid;
    } catch (error) {
      console.error('Error validating ZIP code:', error);
      // Fallback to basic validation if API is unavailable
      setIsValidZipCode(true);
      return true;
    }
  };

  const validateRequiredFields = (): boolean => {
    // Check for all required fields before submission
    if (!email || !password || !parentName || !zipCode || !isValidZipCode) {
      return false;
    }
    
    // Validate child profiles - each child must have a name and age
    if (childProfiles.length === 0 || !childProfiles.every(child => child.name && child.age)) {
      return false;
    }
    
    // Check that at least one interest is selected
    if (interests.length === 0) {
      return false;
    }
    
    return true;
  };

  const handleCompleteSetup = async () => {
    if (!validateRequiredFields()) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all required fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert childProfiles to the correct JSON format for Supabase
      const childrenData = childProfiles as unknown as Json[];

      // Prepare the data for early_signups table
      const signupData = {
        email,
        parent_name: parentName,
        location: zipCode, // Using zipCode instead of location
        referrer: referrer || null,
        interests,
        children: childrenData,
      };

      // Save to early_signups - skip the auth.signUp since we're not creating full users yet
      const { error: signupError } = await supabase
        .from('early_signups')
        .upsert(signupData, {
          onConflict: 'email'
        });

      if (signupError) {
        console.error('Error saving early signup data:', signupError);
        toast({
          title: 'Signup Error',
          description: 'There was an error saving your information. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Always redirect to thank you page
      if (onComplete) {
        onComplete(email);
      } else {
        navigate('/thank-you', { state: { email } });
      }

    } catch (err: any) {
      console.error('Signup error:', err);
      toast({
        title: 'Signup Error',
        description: err.message || 'There was an error creating your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: OnboardingContextType = {
    email,
    setEmail,
    password,
    setPassword,
    parentName,
    setParentName,
    zipCode,
    setZipCode,
    referrer,
    setReferrer,
    childProfiles,
    setChildProfiles,
    interests,
    setInterests,
    step,
    nextStep,
    prevStep,
    isSubmitting,
    setIsSubmitting,
    isValidZipCode,
    setIsValidZipCode,
    validateZipCode,
    handleCompleteSetup,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
