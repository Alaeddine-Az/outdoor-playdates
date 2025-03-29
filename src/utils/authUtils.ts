
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to check if a user is an admin
 */
export const checkAdminStatus = async (user: User | null): Promise<boolean> => {
  // Return early if no user is provided
  if (!user) return false;
  
  console.log("Checking admin status for user:", user.id);
  
  try {
    // Always check directly for the specific admin email first
    if (user.email?.toLowerCase() === 'alaeddine.azaiez@gmail.com') {
      console.log("Admin email match found");
      return true;
    }
    
    // Check admin status via the user_roles table
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (error) {
      console.error('Error checking admin status via roles table:', error);
    }
    
    if (data) {
      console.log("Admin role found in database");
      return true;
    }
    
    // Fall back to RPC if implemented
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin', { user_id: user.id });
      if (rpcError) {
        console.error('Error checking admin status via RPC:', rpcError);
      } else if (rpcData) {
        console.log("Admin status confirmed via RPC");
        return true;
      }
    } catch (err) {
      console.error('Exception checking admin status via RPC:', err);
    }
    
    return false;
  } catch (err) {
    console.error('Exception in checkAdminStatus:', err);
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
