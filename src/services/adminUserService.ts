
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

    const response = await supabase.functions.invoke('admin-users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { 
        page: currentPage,
        per_page: perPage
      }
    });

    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    toast({
      title: 'Error fetching users',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};

// Create a new user
export const createUser = async (userData: CreateUserData): Promise<any> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        email: userData.email,
        password: userData.password,
        user_metadata: {
          parent_name: userData.parent_name || '',
        },
      },
    });

    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user password
export const updateUserPassword = async ({ userId, password }: { userId: string; password: string }): Promise<any> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await supabase.functions.invoke('admin-users', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        user_id: userId,
        password,
      },
    });

    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await supabase.functions.invoke('admin-users', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        user_id: userId,
      },
    });

    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
