
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAvatarUpload } from './useAvatarUpload';
import { ParentProfile } from '@/types';

export const useProfileUpdate = (userId: string | undefined, profile: ParentProfile | null) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const { uploadAvatar, isUploading } = useAvatarUpload(userId);

  // Helper function to convert ZIP code to city name
  const convertZipToCity = async (zipCode: string): Promise<string> => {
    try {
      // In a real app, you would call a ZIP code API here
      // For demo purposes, we'll use a simple mapping
      // This would be replaced with an actual API call in production
      
      // Sample mapping for demo
      const zipMap: Record<string, string> = {
        '90210': 'Beverly Hills',
        '10001': 'New York',
        '60601': 'Chicago',
        '75001': 'Dallas',
        '33101': 'Miami',
        'V6B': 'Vancouver',
        'T2P': 'Calgary',
        'M5V': 'Toronto',
      };
      
      // Get first 3-5 characters of ZIP to do a lookup
      const zipPrefix = zipCode.substring(0, Math.min(5, zipCode.length));
      
      // Return the mapped city or a default with the ZIP
      return zipMap[zipPrefix] || `${zipCode.substring(0, 3)} Area`;
    } catch (error) {
      console.error('Error converting ZIP to city:', error);
      return 'Unknown Location';
    }
  };

  const updateProfile = async (
    name: string,
    description: string,
    location: string,
    city: string,
    interests: string[],
    avatarFile: File | null
  ) => {
    if (!userId) return;
    
    try {
      setIsSaving(true);
      
      // Upload avatar if changed
      let finalAvatarUrl = profile?.avatar_url || null;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) finalAvatarUrl = uploadedUrl;
      }
      
      // Validate postal code and derive city
      let derivedCity = city;
      if (location !== profile?.location) {
        // Convert ZIP code to city name
        derivedCity = await convertZipToCity(location);
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          parent_name: name,
          description,
          location,
          city: derivedCity,
          interests,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Redirect to profile page
      navigate('/parent-profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    updateProfile,
    isSaving,
    isUploading
  };
};
