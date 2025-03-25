
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
    console.log("🚀 Starting onboarding submission process");
    
    // Validate ZIP code first
    console.log("🧪 Validating postal code:", form.zipCode);
    const zipIsValid = await form.validateZipCode(form.zipCode);
    form.setIsValidZipCode(zipIsValid);
    
    if (!zipIsValid) {
      console.error("❌ Invalid postal code");
      toast({
        title: 'Invalid Postal Code',
        description: 'Please enter a valid Canadian postal code.',
        variant: 'destructive',
      });
      return;
    }

    // Debug log all form fields 
    console.log("📋 Form state before submission:", {
      email: form.email,
      passwordSet: form.password.length > 0,
      parentName: form.parentName,
      zipCode: form.zipCode,
      zipCodeValid: form.isValidZipCode,
      childrenCount: form.childProfiles.length,
      children: form.childProfiles,
      interestsCount: form.interests.length,
      interests: form.interests
    });

    // Comprehensive validation
    if (!form.validateRequiredFields()) {
      console.error("❌ Form validation failed");
      toast({
        title: 'Missing Information',
        description: 'Please complete all required fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    // Set submission state
    navigation.setIsSubmitting(true);
    console.log("⏳ Submission in progress...");

    try {
      
      import { supabase } from '@/integrations/supabase/client'; // at the top if not already

      // 🔍 Debug Supabase Auth session
      const session = await supabase.auth.getSession();
      console.log("🧠 Supabase session:", session);

      const user = session.data.session?.user;
      console.log("👤 Supabase user:", user);
      // Submit data to backend
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
        throw new Error(result.error || "Unknown error occurred");
      }

      console.log("✅ Submission successful for:", form.email);
      
      // Show success message
      toast({
        title: 'Registration Successful',
        description: 'Thank you for signing up! We\'ll be in touch soon.',
      });

      // Handle completion callback or navigation
      if (onComplete) {
        onComplete(form.email);
      } else {
        navigate('/thank-you', { state: { email: form.email } });
      }
    } catch (err: any) {
      console.error("❌ Submission error:", err);
      toast({
        title: 'Registration Failed',
        description: err.message || 'There was an error creating your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      navigation.setIsSubmitting(false);
      console.log("🏁 Submission process complete");
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
