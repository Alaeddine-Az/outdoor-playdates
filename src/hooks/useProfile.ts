
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useProfile = (profileId?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [children, setChildren] = useState([]);
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
        // Determine which user ID to use for profile lookup
        const targetUserId = profileId || user.id;
        
        // Check if this is the current user's profile
        setIsCurrentUser(targetUserId === user.id);

        console.log("Fetching profile for user ID:", targetUserId);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single();

        if (profileError) {
          console.error('Error loading profile:', profileError);
          setError("Failed to load profile data");
          throw profileError;
        }

        console.log("Profile data fetched:", profileData);
        setProfile(profileData);

        // Fetch children
        const { data: childrenData, error: childrenError } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', targetUserId);

        if (childrenError) {
          console.error('Error loading children:', childrenError);
          throw childrenError;
        }

        console.log("Children data fetched:", childrenData);
        setChildren(childrenData || []);
      } catch (error) {
        console.error('Error in profile hook:', error);
        setError("Failed to load user data");
        // Don't show toast here as we're handling the error in the component
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, profileId]);

  return { profile, children, loading, error, isCurrentUser };
};
