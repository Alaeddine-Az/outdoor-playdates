
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import type { ChildInfo } from '@/components/onboarding/ChildProfileStep';

export interface OnboardingSubmitData {
  email: string;
  phone?: string;
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
      phone: data.phone || 'None provided',
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
    if (!data.email) {
      console.error("❌ Missing email");
      return {
        success: false,
        error: 'Email is required.'
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
    const childrenData = data.childProfiles.map(child => child as Json);

    // Prepare data for early_signups table with clean formatting
    const signupData = {
      email: data.email,
      phone: data.phone || null,
      parent_name: data.parentName,
      location: data.zipCode,
      referrer: data.referrer || null,
      interests: data.interests,
      children: childrenData, // ✅ Now safely jsonb[]
      status: 'pending',
    };

    console.log("📦 Final payload:", JSON.stringify(signupData, null, 2));

    // Save to early_signups table without creating an auth account
    const { error: signupError } = await supabase
      .from('early_signups')
      .insert(signupData);
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
