
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ParentProfile, ChildProfile } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function useProfile(profileId?: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isCurrentUser = !profileId || profileId === user?.id;
  const targetId = profileId || user?.id;

  useEffect(() => {
    if (!targetId) {
      setLoading(false);
      return;
    }

    async function loadProfile() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch parent profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch children
        const { data: childrenData, error: childrenError } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', targetId);

        if (childrenError) throw childrenError;
        setChildren(childrenData || []);
      } catch (e: any) {
        console.error('Error loading profile:', e);
        setError(e.message);
        toast({
          title: 'Error loading profile',
          description: e.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [targetId]);

  const updateProfile = async (updates: Partial<ParentProfile>) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      return { success: true };
    } catch (e: any) {
      console.error('Error updating profile:', e);
      toast({
        title: 'Error updating profile',
        description: e.message,
        variant: 'destructive',
      });
      return { success: false, error: e.message };
    }
  };

  const addChild = async (childData: Omit<ChildProfile, 'id' | 'parent_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('children')
        .insert([{ ...childData, parent_id: user.id }])
        .select();

      if (error) throw error;

      if (data) {
        setChildren(prev => [...prev, data[0]]);
        toast({
          title: 'Child added',
          description: `${childData.name} has been successfully added to your profile.`,
        });
      }
      
      return { success: true, data };
    } catch (e: any) {
      console.error('Error adding child:', e);
      toast({
        title: 'Error adding child',
        description: e.message,
        variant: 'destructive',
      });
      return { success: false, error: e.message };
    }
  };

  const updateChild = async (childId: string, updates: Partial<ChildProfile>) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', childId)
        .eq('parent_id', user.id);

      if (error) throw error;

      setChildren(prev => 
        prev.map(child => child.id === childId ? { ...child, ...updates } : child)
      );
      
      toast({
        title: 'Child updated',
        description: 'Child profile has been successfully updated.',
      });
      
      return { success: true };
    } catch (e: any) {
      console.error('Error updating child:', e);
      toast({
        title: 'Error updating child',
        description: e.message,
        variant: 'destructive',
      });
      return { success: false, error: e.message };
    }
  };

  return {
    profile,
    children,
    loading,
    error,
    isCurrentUser,
    updateProfile,
    addChild,
    updateChild
  };
}
