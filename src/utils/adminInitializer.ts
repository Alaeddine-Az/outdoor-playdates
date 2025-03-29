
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Function to ensure admin@admin.com has admin privileges
export const ensureAdminUser = async () => {
  try {
    // First check if the user exists in auth
    const adminEmail = 'admin@admin.com';
    
    // Check for admin role
    const { data: existingRoles, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('role', 'admin');
      
    if (roleError) {
      console.error('Error checking existing admin roles:', roleError);
      return;
    }
    
    // Find the user ID for admin@admin.com
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', adminEmail)
      .single();
      
    if (userError) {
      if (userError.code !== 'PGRST116') { // Not found error
        console.error('Error finding admin user:', userError);
      }
      return;
    }
    
    const adminUserId = userData.id;
    
    // Check if admin role exists for this user
    const adminRoleExists = existingRoles?.some(role => role.user_id === adminUserId);
    
    if (!adminRoleExists) {
      // Add admin role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: adminUserId,
          role: 'admin'
        });
        
      if (insertError) {
        console.error('Error assigning admin role:', insertError);
        return;
      }
      
      console.log('Admin role assigned to admin@admin.com');
    } else {
      console.log('admin@admin.com already has admin role');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};
