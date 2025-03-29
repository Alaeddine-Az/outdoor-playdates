
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to check if a user is an admin
 */
export const checkAdminStatus = async (user: User | null): Promise<boolean> => {
  // Return early if no user is provided
  if (!user) return false;
  
  // Check if email is admin@admin.com (quick check)
  if (user.email?.toLowerCase() === 'admin@admin.com') {
    // Verify in database to be sure
    try {
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

/**
 * Assign admin role to a user by email
 */
export const assignAdminRole = async (email: string): Promise<{success: boolean, message?: string, error?: any}> => {
  try {
    // Find the user by email
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .limit(1);
      
    if (userError) {
      console.error('Error finding user:', userError);
      return { success: false, error: userError };
    }
    
    if (!users || users.length === 0) {
      return { success: false, message: 'User not found' };
    }
    
    const userId = users[0].id;
    
    // Check if role already exists
    const { data: existingRoles, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin');
      
    if (!roleCheckError && existingRoles && existingRoles.length > 0) {
      return { success: true, message: 'User already has admin role' };
    }
    
    // Insert the admin role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
      });
      
    if (insertError) {
      console.error('Error assigning admin role:', insertError);
      return { success: false, error: insertError };
    }
    
    return { success: true, message: 'Admin role assigned successfully' };
  } catch (error) {
    console.error('Exception in assignAdminRole:', error);
    return { success: false, error };
  }
};
