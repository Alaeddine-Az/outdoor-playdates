// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ettaveklarzlydmmtvel.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dGF2ZWtsYXJ6bHlkbW10dmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDgzMTEsImV4cCI6MjA1Nzk4NDMxMX0.WgymI4Fly2o_ynPTeN5b8exdpWLFjJiF1jGpE438gJo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);