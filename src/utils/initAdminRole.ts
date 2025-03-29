
import { supabase } from '@/integrations/supabase/client';

export const initializeAdminRole = async () => {
  try {
    // Get the user ID for admin@admin.com
    const { data: userData, error: userError } = await supabase.auth.admin
      .getUserByEmail('admin@admin.com');
      
    if (userError || !userData?.user?.id) {
      console.error('Error fetching admin user:', userError);
      return { success: false, error: userError };
    }
    
    const adminUserId = userData.user.id;
    
    // Check if the role already exists
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', adminUserId)
      .eq('role', 'admin')
      .single();
      
    if (!checkError && existingRole) {
      console.log('Admin role already assigned');
      return { success: true, message: 'Admin role already assigned' };
    }
    
    // Insert admin role if it doesn't exist
    const { data: insertData, error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: adminUserId,
        role: 'admin'
      });
      
    if (insertError) {
      console.error('Error assigning admin role:', insertError);
      return { success: false, error: insertError };
    }
    
    return { success: true, message: 'Admin role assigned successfully' };
  } catch (error) {
    console.error('Exception while initializing admin role:', error);
    return { success: false, error };
  }
};
