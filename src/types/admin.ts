
import { Json } from '@/integrations/supabase/types';

export interface EarlySignup {
  id: string;
  email: string;
  parent_name: string;
  location: string | null;
  children: Json[] | null;
  interests: string[] | null;
  status: 'pending' | 'approved' | 'rejected' | 'converted' | 'onboarding_complete';
  created_at: string | null;
  invited_at: string | null;
  converted_at?: string | null;
  converted_user_id?: string | null;
  referrer?: string | null;
  updated_at?: string | null;
  phone?: string | null;
}
