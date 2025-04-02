import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
};

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ Missing Authorization header');
      return jsonError('Missing Authorization header', 401);
    }

    const jwt = authHeader.replace('Bearer ', '');
    let userId;

    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      userId = payload.sub;
      if (!userId) throw new Error('No user ID in token');
    } catch (err) {
      console.error('❌ Invalid JWT payload:', err);
      return jsonError('Invalid token', 401);
    }

    const { data: isAdmin, error: adminCheckError } = await supabaseAdmin.rpc('is_admin', {
      user_id: userId,
    });

    if (adminCheckError) {
      console.error('❌ Error checking admin status:', adminCheckError);
      return jsonError('Error checking admin status', 500);
    }

    if (!isAdmin) {
      console.warn('⛔ User is not an admin:', userId);
      return jsonError('Unauthorized - Admin access required', 403);
    }

    let body;
    try {
      const text = await req.text();
      if (!text) {
        body = {}; // Empty body
      } else {
        body = JSON.parse(text);
      }
    } catch (err) {
      console.error('❌ Failed to parse request body:', err);
      return jsonError('Invalid JSON in request body', 400);
    }

    const action = body?.action || '';
    switch (action) {
      case 'getUsers':
        return await handleGetUsers(body);
      case 'createUser':
        return await handleCreateUser(body);
      case 'updatePassword':
        return await handleUpdatePassword(body);
      case 'deleteUser':
        return await handleDeleteUser(body);
      default:
        console.warn('❓ Unknown action:', action);
        return jsonError(`Unknown or missing action: ${action}`, 400);
    }

  } catch (error) {
    console.error('🔥 Uncaught server error:', error);
    return jsonError(error.message || 'Internal server error', 500);
  }
});

function jsonError(message: string, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleGetUsers(body: any) {
  const page = body.page || 1;
  const perPage = body.per_page || 10;

  try {
    console.log(`📋 Fetching users page=${page}, perPage=${perPage}`);
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=${perPage}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    console.log(`✅ Users fetched successfully, count: ${data?.users?.length || 0}`);
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error in handleGetUsers:', err);
    return jsonError('Error fetching users', 500);
  }
}

async function handleCreateUser(body: any) {
  const { email, password, user_metadata } = body;

  if (!email || !password) {
    return jsonError('Email and password are required', 400);
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error in handleCreateUser:', err);
    return jsonError('Error creating user', 500);
  }
}

async function handleUpdatePassword(body: any) {
  const { user_id, password } = body;
  if (!user_id || !password) {
    return jsonError('User ID and password are required', 400);
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user_id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error in handleUpdatePassword:', err);
    return jsonError('Error updating password', 500);
  }
}

async function handleDeleteUser(body: any) {
  const { user_id } = body;
  if (!user_id) {
    return jsonError('User ID is required', 400);
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error in handleDeleteUser:', err);
    return jsonError('Error deleting user', 500);
  }
}
