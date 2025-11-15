import { Button } from '../../components/ui/button';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { Loader2 } from 'lucide-react';
import { showError } from '../../utils/toast';

interface GoogleLoginButtonProps {
  onSuccess: (email: string, name: string) => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function GoogleLoginButton({ onSuccess, loading, setLoading }: GoogleLoginButtonProps) {
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (user?.email) {
        await onSuccess(user.email, user.displayName || user.email.split('@')[0]);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      showError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="h-4 w-4"
          />
          Continue with Google
        </>
      )}
    </Button>
  );
}
