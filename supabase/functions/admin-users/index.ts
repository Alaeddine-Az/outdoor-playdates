
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_id: user.id
    })

    if (adminCheckError || !isAdmin) {
      console.error('Admin check error:', adminCheckError)
      return new Response(JSON.stringify({ error: 'Unauthorized - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Parse request body
    const requestBody = await req.json()
    const { action } = requestBody
    
    // Handle different actions based on the action parameter
    if (req.method === 'POST') {
      console.log('Handling action:', action)
      
      // List users
      if (action === 'list') {
        const page = requestBody.page || 1
        const perPage = requestBody.per_page || 10
        
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
        )
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error fetching users:', errorText)
          throw new Error(`Error fetching users: ${errorText}`)
        }
        
        const data = await response.json()
        console.log('Retrieved users:', data.users?.length || 0)
        
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Create user
      else if (action === 'create') {
        const { email, password, user_metadata } = requestBody
        
        if (!email || !password) {
          return new Response(JSON.stringify({ error: 'Email and password are required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
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
        )
        
        const data = await response.json()
        
        if (response.ok) {
          return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      }
      
      // Update user password
      else if (action === 'update_password') {
        const { user_id, password } = requestBody
        
        if (!user_id || !password) {
          return new Response(JSON.stringify({ error: 'User ID and password are required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
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
        )
        
        const data = await response.json()
        
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Delete user
      else if (action === 'delete') {
        const { user_id } = requestBody
        
        if (!user_id) {
          return new Response(JSON.stringify({ error: 'User ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
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
        )
        
        if (response.ok) {
          return new Response(JSON.stringify({ success: true, message: 'User deleted successfully' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          const data = await response.json()
          return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      }
    }

    // If no action matches or method not supported
    return new Response(JSON.stringify({ error: 'Invalid action or method' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
