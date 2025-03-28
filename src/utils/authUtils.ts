
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to check if a user is an admin
 */
export const checkAdminStatus = async (user: User | null): Promise<boolean> => {
  // Return early if no user is provided
  if (!user) return false;
  
  // Check if email is admin@admin.com (case insensitive)
  if (user.email?.toLowerCase() === 'admin@admin.com') {
    return true;
  }
  
  try {
    // Check admin status via RPC
    const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    return !!data;
  } catch (err) {
    console.error('Exception checking admin status:', err);
    return false;
  }
};
