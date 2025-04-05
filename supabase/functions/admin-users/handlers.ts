
import { corsHeaders } from './config.ts';
import { jsonError, parseRequestBody, verifyAdminAccess, supabaseAdmin } from './utils.ts';
import { handleGetUsers, handleCreateUser, handleUpdatePassword, handleDeleteUser } from './userActions.ts';

export async function handleRequest(req: Request) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    
    // Verify admin access
    await verifyAdminAccess(authHeader);
    
    // Parse the request body
    const body = await parseRequestBody(req);
    
    // Route to the appropriate handler based on the action
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
}
