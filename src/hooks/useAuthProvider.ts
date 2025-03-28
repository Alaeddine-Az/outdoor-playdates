
import { useAuthSession } from './useAuthSession';
import { useSignUp } from './useSignUp';
import { useSignIn } from './useSignIn';
import { useSignOut } from './useSignOut';

export function useAuthProvider() {
  const { session, user, loading, isAdmin } = useAuthSession();
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
