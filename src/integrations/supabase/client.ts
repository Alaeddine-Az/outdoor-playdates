
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use direct values instead of env vars for client-side code
// These are public, publishable keys so they can be included directly in the client code
const SUPABASE_URL = 'https://ettaveklarzlydmmtvel.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dGF2ZWtsYXJ6bHlkbW10dmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDgzMTEsImV4cCI6MjA1Nzk4NDMxMX0.WgymI4Fly2o_ynPTeN5b8exdpWLFjJiF1jGpE438gJo';

// Add console log to confirm connection initialization
console.log('🔌 Initializing Supabase connection...');

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'goplaynow-auth',
    storage: localStorage,
    autoRefreshToken: true,
  }
});

console.log('✅ Supabase client initialized successfully');
