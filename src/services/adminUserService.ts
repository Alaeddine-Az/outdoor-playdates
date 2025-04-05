import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  role?: string;
  created_at: string;
  user_metadata?: {
    parent_name?: string;
    [key: string]: any;
  };
}

interface CreateUserData {
  email: string;
  password: string;
  parent_name?: string;
}

// Get the current auth token
export const getAuthToken = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
};

// Fetch users with pagination
export const fetchUsers = async (currentPage: number, perPage: number): Promise<{ users: User[] }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    console.log(`Fetching users with page=${currentPage}, perPage=${perPage}`);
    
    // Make the request to the edge function
    const { data, error } = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      body: { 
        action: 'getUsers',
        page: currentPage,
        per_page: perPage
      }
    });

    if (error) {
      console.error('Error invoking admin-users function:', error);
      throw new Error(error.message || 'Failed to fetch users');
    }
    
    console.log('Fetched user data:', data);
    return data || { users: [] };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    toast({
      title: 'Error fetching users',
      description: error.message || 'Failed to send a request to the edge function',
      variant: 'destructive',
    });
    throw error.message || 'Failed to fetch users';
  }
};

// Create a new user
export const createUser = async (userData: CreateUserData): Promise<any> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      body: {
        action: 'createUser',
        email: userData.email,
        password: userData.password,
        user_metadata: {
          parent_name: userData.parent_name || '',
        },
      },
    });

    if (error) throw new Error(error.message || 'Failed to create user');
    return data;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw error.message || 'Failed to create user';
  }
};

// Update user password
export const updateUserPassword = async ({ userId, password }: { userId: string; password: string }): Promise<any> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        action: 'updatePassword',
        user_id: userId,
        password,
      },
    });

    if (error) throw new Error(error.message || 'Failed to update user password');
    return data;
  } catch (error: any) {
    console.error('Error updating user password:', error);
    throw error.message || 'Failed to update user password';
  }
};

// Delete a user
export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        action: 'deleteUser',
        user_id: userId,
      },
    });

    if (error) throw new Error(error.message || 'Failed to delete user');
    return data;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw error.message || 'Failed to delete user';
  }
};
