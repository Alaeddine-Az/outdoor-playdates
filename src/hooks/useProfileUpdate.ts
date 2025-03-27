
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
        // In a real app, you would validate postal code with an API
        // and get the city name. Here we'll just use the one entered.
        derivedCity = city || 'Unknown City';
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
