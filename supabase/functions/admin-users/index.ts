import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ✅ Decode the JWT manually
    const jwt = authHeader.replace('Bearer ', '');
    let userId;
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      userId = payload.sub;
    } catch (e) {
      console.error('Invalid JWT payload', e);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ✅ Call the is_admin function securely
    const { data: isAdmin, error: adminCheckError } = await supabaseAdmin.rpc('is_admin', {
      user_id: userId
    });

    if (adminCheckError || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Parse body
    const body = await req.json();
    const action = body.action;

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
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Error in admin-users:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // --- Handlers below ---

  async function handleGetUsers(body) {
    const page = body.page || 1;
    const perPage = body.per_page || 10;

    const response = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  async function handleCreateUser(body) {
    const { email, password, user_metadata } = body;

    const response = await fetch(
      `${supabaseUrl}/auth/v1/admin/users`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, email_confirm: true, user_metadata }),
      }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  async function handleUpdatePassword(body) {
    const { user_id, password } = body;

    const response = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${user_id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  async function handleDeleteUser(body) {
    const { user_id } = body;

    const response = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${user_id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          'Content-Type': 'application/json',
        },
      }
    );
    return new Response(await response.text(), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
