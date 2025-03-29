
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
}

// Create a Supabase client with the admin key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''

serve(async (req) => {
  console.log(`Admin-users function called with method: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create a Supabase client with the user's JWT
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    )

    // Check if the user is an admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('User not found in token');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_id: user.id
    })

    if (adminCheckError || !isAdmin) {
      console.error('Admin check error:', adminCheckError || 'User is not an admin');
      return new Response(JSON.stringify({ error: 'Unauthorized - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body:', requestBody);
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const action = requestBody.action;
    console.log(`Processing action: ${action}`);

    // Handle different actions
    switch (action) {
      case 'getUsers':
        return await handleGetUsers(requestBody);
      case 'createUser':
        return await handleCreateUser(requestBody);
      case 'updatePassword':
        return await handleUpdatePassword(requestBody);
      case 'deleteUser':
        return await handleDeleteUser(requestBody);
      default:
        console.error('Unknown action:', action);
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Handler functions for each action
  async function handleGetUsers(body) {
    console.log('Processing GET users request');
    
    const page = body.page || 1;
    const perPage = body.per_page || 10;
    
    console.log(`Fetching users with page=${page}, perPage=${perPage}`);
    
    try {
      // Fetch users using the Supabase Admin API
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
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching users:', response.status, errorText);
        return new Response(JSON.stringify({ error: `Error fetching users: ${response.status} ${errorText}` }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const data = await response.json();
      console.log(`Successfully fetched ${data.users?.length || 0} users`);
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error in handleGetUsers:', error);
      return new Response(JSON.stringify({ error: error.message || 'Error fetching users' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  async function handleCreateUser(body) {
    console.log('Processing CREATE user request');
    const { email, password, user_metadata } = body;
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    try {
      // Create user using the Supabase Admin API
      const response = await fetch(
        `${supabaseUrl}/auth/v1/admin/users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            email_confirm: true,
            user_metadata
          }),
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('User created successfully');
        return new Response(JSON.stringify(data), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        console.error('Error creating user:', data);
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('Error in handleCreateUser:', error);
      return new Response(JSON.stringify({ error: error.message || 'Error creating user' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  async function handleUpdatePassword(body) {
    console.log('Processing UPDATE password request');
    const { user_id, password } = body;
    
    if (!user_id || !password) {
      return new Response(JSON.stringify({ error: 'User ID and password are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    try {
      // Update user password using the Supabase Admin API
      const response = await fetch(
        `${supabaseUrl}/auth/v1/admin/users/${user_id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password
          }),
        }
      );
      
      const data = await response.json();
      console.log('Password update response:', response.status);
      
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error in handleUpdatePassword:', error);
      return new Response(JSON.stringify({ error: error.message || 'Error updating password' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  async function handleDeleteUser(body) {
    console.log('Processing DELETE user request');
    const { user_id } = body;
    
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    try {
      // Delete user using the Supabase Admin API
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
      
      if (response.ok) {
        console.log('User deleted successfully');
        return new Response(JSON.stringify({ success: true, message: 'User deleted successfully' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const data = await response.json();
        console.error('Error deleting user:', data);
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('Error in handleDeleteUser:', error);
      return new Response(JSON.stringify({ error: error.message || 'Error deleting user' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
})
