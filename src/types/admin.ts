
import { Json } from '@/integrations/supabase/types';

export interface EarlySignup {
  id: string;
  email: string;
  parent_name: string;
  location: string | null;
  children: Json[] | null;
  interests: string[] | null;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  created_at: string | null;
  invited_at: string | null;
  child_age?: string | null;
  child_name?: string | null;
  converted_at?: string | null;
  converted_user_id?: string | null;
  referrer?: string | null;
  updated_at?: string | null;
}
