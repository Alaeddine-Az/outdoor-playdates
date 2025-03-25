
import { useState } from 'react';
import { ChildInfo } from '@/components/onboarding/ChildProfileStep';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingFormState {
  email: string;
  password: string;
  parentName: string;
  zipCode: string;
  referrer: string;
  childProfiles: ChildInfo[];
  interests: string[];
  isValidZipCode: boolean;
}

export function useOnboardingForm(initialState?: Partial<OnboardingFormState>) {
  // Form state
  const [email, setEmail] = useState(initialState?.email || '');
  const [password, setPassword] = useState(initialState?.password || '');
  const [parentName, setParentName] = useState(initialState?.parentName || '');
  const [zipCode, setZipCode] = useState(initialState?.zipCode || '');
  const [referrer, setReferrer] = useState(initialState?.referrer || '');
  const [childProfiles, setChildProfiles] = useState<ChildInfo[]>(
    initialState?.childProfiles || [{ name: "", age: "" }]
  );
  const [interests, setInterests] = useState<string[]>(
    initialState?.interests || []
  );
  const [isValidZipCode, setIsValidZipCode] = useState(
    initialState?.isValidZipCode || false
  );

  // Validate ZIP code with an API
  const validateZipCode = async (zip: string): Promise<boolean> => {
    if (!zip) return false;

    // Normalize ZIP (remove spaces for consistent API formatting)
    const trimmedZip = zip.trim().toUpperCase();

    // 🇨🇦 Check Canadian format
    const canadianPostalCodeRegex = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;
    const isCanadian = canadianPostalCodeRegex.test(trimmedZip);

    if (!isCanadian) {
      setIsValidZipCode(false);
      return false;
    }

    try {
      // Optional: Validate against external API (e.g., Geoapify, PositionStack) if you want
      // For now, just accept valid Canadian format
      setIsValidZipCode(true);
      return true;
    } catch (error) {
      console.error('ZIP validation failed:', error);
      setIsValidZipCode(true); // fallback: still consider valid if regex passed
      return true;
    }
  };

  // Check for required fields before submission
  const validateRequiredFields = (): boolean => {
    if (!email || !password || !parentName || !zipCode || !isValidZipCode) {
      console.log("Missing basic fields:", { email, password, parentName, zipCode, isValidZipCode });
      return false;
    }
    
    // Validate child profiles - each child must have a name and age
    if (childProfiles.length === 0 || !childProfiles.every(child => child.name && child.age)) {
      console.log("Missing child profiles data:", childProfiles);
      return false;
    }
    
    // Check that at least one interest is selected
    if (interests.length === 0) {
      console.log("No interests selected");
      return false;
    }
    
    console.log("All required fields validated successfully");
    return true;
  };

  return {
    // Form state
    email, setEmail,
    password, setPassword,
    parentName, setParentName,
    zipCode, setZipCode,
    referrer, setReferrer,
    childProfiles, setChildProfiles,
    interests, setInterests,
    isValidZipCode, setIsValidZipCode,
    
    // Validation methods
    validateZipCode,
    validateRequiredFields
  };
}
