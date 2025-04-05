
import { corsHeaders, supabaseUrl } from './config.ts';
import { supabaseAdmin } from './utils.ts';
import { jsonError } from './utils.ts';

export async function handleGetUsers(body: any) {
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

export async function handleCreateUser(body: any) {
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

export async function handleUpdatePassword(body: any) {
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

export async function handleDeleteUser(body: any) {
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
