import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  user_id: string;
  parent_name: string;
  // Add other profile fields here as needed
}

interface Child {
  id: string;
  name: string;
  parent_id: string;
  // Add other child fields here
}

export const useProfile = (profileId?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const targetUserId = profileId || user.id;
        setIsCurrentUser(targetUserId === user.id);

        console.log("Fetching profile for user ID:", targetUserId);

        // FIXED: Match user using 'user_id' instead of 'id'
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', targetUserId)
          .single();

        if (profileError) {
          console.error('Error loading profile:', profileError);
          setError("Failed to load profile data");
          throw profileError;
        }

        console.log("Profile data fetched:", profileData);
        setProfile(profileData);

        // Fetch children linked to this profile
        const { data: childrenData, error: childrenError } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', profileData.id); // use internal profile ID here

        if (childrenError) {
          console.error('Error loading children:', childrenError);
          throw childrenError;
        }

        console.log("Children data fetched:", childrenData);
        setChildren(childrenData || []);
      } catch (error) {
        console.error('Error in profile hook:', error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, profileId]);

  return { profile, children, loading, error, isCurrentUser };
};
