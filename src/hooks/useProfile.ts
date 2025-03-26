
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching profile for user ID:", user.id);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
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
          .eq('parent_id', user.id);

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
  }, [user]);

  return { profile, children, loading, error };
};
