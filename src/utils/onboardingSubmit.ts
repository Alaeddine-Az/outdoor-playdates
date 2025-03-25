
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';
import type { ChildInfo } from '@/components/onboarding/ChildProfileStep';

export interface OnboardingSubmitData {
  email: string;
  password: string;
  parentName: string;
  zipCode: string;
  referrer: string;
  childProfiles: ChildInfo[];
  interests: string[];
}

export async function submitOnboardingData(
  data: OnboardingSubmitData,
  onSuccess?: (email: string) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert childProfiles to the correct JSON format for Supabase
    const childrenData = data.childProfiles as unknown as Json[];

    // Prepare the data for early_signups table
    const signupData = {
      email: data.email,
      parent_name: data.parentName,
      location: data.zipCode,
      referrer: data.referrer || null,
      interests: data.interests,
      children: childrenData,
      status: 'pending', // Set initial status
    };

    console.log("Saving signup data:", signupData);

    // Save to early_signups with upsert to handle the unique email constraint
    const { error: signupError } = await supabase
      .from('early_signups')
      .upsert(signupData, {
        onConflict: 'email'
      });

    if (signupError) {
      console.error('Error saving early signup data:', signupError);
      return { 
        success: false, 
        error: 'There was an error saving your information. Please try again.' 
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Signup error:', err);
    return {
      success: false,
      error: err.message || 'There was an error creating your account. Please try again.'
    };
  }
}
