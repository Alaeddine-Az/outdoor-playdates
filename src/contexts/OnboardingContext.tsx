
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
  location: string;
  setLocation: (location: string) => void;
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
  const [location, setLocation] = useState('');
  const [referrer, setReferrer] = useState('');
  const [childProfiles, setChildProfiles] = useState<ChildInfo[]>([{ name: "", age: "" }]);
  const [interests, setInterests] = useState<string[]>([]);
  
  // Navigation state
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = useNavigate();

  const handleCompleteSetup = async () => {
    if (!email || !parentName || childProfiles.length === 0 || interests.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all required fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First attempt to sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      // Convert childProfiles to the correct JSON format for Supabase
      const childrenData = childProfiles as unknown as Json[];

      // Prepare the data for early_signups table
      const signupData = {
        email,
        parent_name: parentName,
        location,
        referrer: referrer || null,
        interests,
        children: childrenData,
      };

      // Save to early_signups
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
    location,
    setLocation,
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
    handleCompleteSetup,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
