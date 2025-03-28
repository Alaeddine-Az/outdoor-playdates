
import { useAuthSession } from './useAuthSession';
import { useSignUp } from './useSignUp';
import { useSignIn } from './useSignIn';
import { useSignOut } from './useSignOut';

export function useAuthProvider() {
  // Get session data first
  const { session, user, loading, isAdmin } = useAuthSession();
  
  // Then initialize auth operation hooks that depend on session data
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();

  return {
    session,
    user,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut
  };
}
