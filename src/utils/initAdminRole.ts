import { supabase } from '@/integrations/supabase/client';

export const initializeAdminRole = async () => {
  try {
    // Get all users with email admin@admin.com
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'admin@admin.com')
      .single();
      
    if (userError || !userData?.id) {
      console.error('Error fetching admin user:', userError);
      return { success: false, error: userError };
    }
    
    const adminUserId = userData.id;
    
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
    
    // 🔥 Trace log before inserting into user_roles
    console.trace('🔥 INSERT to user_roles from initializeAdminRole()', {
      user_id: adminUserId,
      role: 'admin',
      context: 'Ensuring admin@admin.com has admin role'
    });

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
