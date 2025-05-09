import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    console.log("Create admin function called");

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const adminEmail = "Alaeddine.azaiez@gmail.com";
    const adminPassword = "@1234admin";

    const { data: existingUsers, error: searchError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1,
      page: 1,
      filter: { email: adminEmail }
    });

    if (searchError) {
      console.error("Error checking for existing user:", searchError);
      throw new Error(`Error checking for existing user: ${searchError.message}`);
    }

    console.log("Existing users check result:", existingUsers);

    if (existingUsers && existingUsers.users.length > 0) {
      const existingUser = existingUsers.users[0];
      console.log("User already exists:", existingUser.id);

      const { data: roleData, error: roleCheckError } = await supabaseAdmin
        .from('user_roles')
        .select('*')
        .eq('user_id', existingUser.id)
        .eq('role', 'admin')
        .single();

      if (roleCheckError && roleCheckError.code !== 'PGRST116') {
        console.error("Error checking role:", roleCheckError);
      }

      if (!roleData) {
        console.log("Assigning admin role to existing user");

        // 🔥 Trace before inserting role
        console.trace("🔥 INSERT to user_roles from create-admin (existing user path)", {
          user_id: existingUser.id,
          role: 'admin'
        });

        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: existingUser.id,
            role: 'admin'
          });

        if (roleError) {
          console.error("Error assigning role:", roleError);
          throw new Error(`Error assigning admin role: ${roleError.message}`);
        }
      }

      return new Response(JSON.stringify({
        message: "Admin user already exists and has admin privileges",
        userId: existingUser.id,
        email: existingUser.email
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log("Creating new admin user");

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        parent_name: "Admin User"
      }
    });

    if (createError) {
      console.error("Error creating user:", createError);
      throw new Error(`Error creating admin user: ${createError.message}`);
    }

    console.log("User created:", userData.user.id);

    // 🔥 Trace before inserting role for newly created user
    console.trace("🔥 INSERT to user_roles from create-admin (new user path)", {
      user_id: userData.user.id,
      role: 'admin'
    });

    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error("Error assigning role:", roleError);
      throw new Error(`Error assigning admin role: ${roleError.message}`);
    }

    console.log("Admin role assigned successfully");

    return new Response(JSON.stringify({
      message: "Admin user created successfully",
      userId: userData.user.id,
      email: userData.user.email
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in create-admin function:', error);

    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
