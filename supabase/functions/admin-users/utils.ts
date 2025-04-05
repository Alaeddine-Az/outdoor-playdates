
import { corsHeaders } from './config.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { supabaseUrl, supabaseServiceRoleKey } from './config.ts';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export function jsonError(message: string, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export async function parseRequestBody(req: Request) {
  try {
    const text = await req.text();
    if (!text) {
      return {};
    }
    return JSON.parse(text);
  } catch (err) {
    console.error('❌ Failed to parse request body:', err);
    throw new Error('Invalid JSON in request body');
  }
}

export async function verifyAdminAccess(authHeader: string | null) {
  if (!authHeader) {
    console.error('❌ Missing Authorization header');
    throw new Error('Missing Authorization header');
  }

  const jwt = authHeader.replace('Bearer ', '');
  let userId;

  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    userId = payload.sub;
    if (!userId) throw new Error('No user ID in token');
  } catch (err) {
    console.error('❌ Invalid JWT payload:', err);
    throw new Error('Invalid token');
  }

  const { data: isAdmin, error: adminCheckError } = await supabaseAdmin.rpc('is_admin', {
    user_id: userId,
  });

  if (adminCheckError) {
    console.error('❌ Error checking admin status:', adminCheckError);
    throw new Error('Error checking admin status');
  }

  if (!isAdmin) {
    console.warn('⛔ User is not an admin:', userId);
    throw new Error('Unauthorized - Admin access required');
  }

  return userId;
}
