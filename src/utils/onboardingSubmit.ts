
import { supabase } from '@/integrations/supabase/client';
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
): Promise<{ success: boolean; error?: string }> {
  try {
    // Enhanced debugging: Log all data with clear structure
    console.log("📝 SUBMITTING ONBOARDING DATA:", {
      email: data.email,
      parentName: data.parentName,
      zipCode: data.zipCode,
      referrer: data.referrer || 'None provided',
      children: {
        count: data.childProfiles.length,
        details: data.childProfiles
      },
      interests: {
        count: data.interests.length,
        selected: data.interests
      }
    });

    // Comprehensive validation checks
    if (!data.email || !data.password) {
      console.error("❌ Missing credentials");
      return {
        success: false,
        error: 'Email and password are required.'
      };
    }

    if (!data.parentName || !data.zipCode) {
      console.error("❌ Missing profile information");
      return {
        success: false,
        error: 'Parent name and location are required.'
      };
    }

    if (data.childProfiles.length === 0) {
      console.error("❌ No children added");
      return {
        success: false,
        error: 'Please add at least one child profile.'
      };
    }

    for (const child of data.childProfiles) {
      if (!child.name || !child.age) {
        console.error("❌ Incomplete child data", child);
        return {
          success: false,
          error: 'Please complete all child profile information.'
        };
      }
    }

    if (data.interests.length === 0) {
      console.error("❌ No interests selected");
      return {
        success: false,
        error: 'Please select at least one interest.'
      };
    }

    // Convert childProfiles to JSON format for Supabase
    const childrenData = data.childProfiles as unknown as Json[];

    // Prepare data for early_signups table with clean formatting
    const signupData = {
      email: data.email,
      parent_name: data.parentName,
      location: data.zipCode,
      referrer: data.referrer || null,
      interests: data.interests,
      children: childrenData,
      status: 'pending',
    };

    console.log("🔄 Saving to Supabase:", signupData);

    // Use upsert with conflict handling but without returning option
    const { error: signupError } = await supabase
      .from('early_signups')
      .upsert(signupData, {
        onConflict: 'email'
      });

    if (signupError) {
      console.error('❌ Supabase Error:', signupError);
      
      // Provide more specific error messages based on error code
      if (signupError.code === '23505') {
        return { 
          success: false, 
          error: 'This email is already registered. Please use a different email address.' 
        };
      }
      
      return { 
        success: false, 
        error: 'Database error: ' + signupError.message
      };
    }

    console.log("✅ Signup successful!");
    return { success: true };
  } catch (err: any) {
    console.error('❌ Unexpected error:', err);
    return {
      success: false,
      error: 'There was an unexpected error. Please try again later.'
    };
  }
}
