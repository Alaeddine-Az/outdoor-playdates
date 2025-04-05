
export interface User {
  id: string;
  email: string;
  role?: string;
  created_at: string;
  updated_at?: string;
  user_metadata?: {
    parent_name?: string;
    [key: string]: any;
  };
}

export interface CreateUserData {
  email: string;
  password: string;
  parent_name?: string;
}

export interface UpdateUserPasswordData {
  userId: string;
  password: string;
}
