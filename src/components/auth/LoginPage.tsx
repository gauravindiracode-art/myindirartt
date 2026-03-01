import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const { signInWithGoogle, signInWithMicrosoft } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [microsoftLoading, setMicrosoftLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Sign-in failed. Please try again.');
      console.error(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleMicrosoft = async () => {
    setMicrosoftLoading(true);
    setError('');
    try {
      await signInWithMicrosoft();
    } catch (err) {
      setError('Sign-in failed. Please try again.');
      console.error(err);
    } finally {
      setMicrosoftLoading(false);
    }
  };

  const anyLoading = googleLoading || microsoftLoading;

  return (
    <div className="min-h-screen bg-neu flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gold rounded-2xl flex items-center justify-center mb-4 neu">
            <span className="text-primary text-3xl font-bold">IU</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Indira University</h1>
          <p className="text-slate-500 text-sm mt-1">Student & Employee Portal</p>
        </div>

        {/* Sign-in card */}
        <div className="bg-neu rounded-2xl p-8 neu">
          <h2 className="text-lg font-semibold text-slate-800 text-center mb-2">
            Welcome
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            Sign in with your university account
          </p>

          <button
            onClick={handleGoogle}
            disabled={anyLoading}
            className="w-full flex items-center justify-center gap-3 bg-neu rounded-xl px-4 py-3 text-sm font-medium text-slate-700 neu-sm hover:neu-inset-sm transition-all disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {googleLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={handleMicrosoft}
            disabled={anyLoading}
            className="w-full flex items-center justify-center gap-3 bg-neu rounded-xl px-4 py-3 text-sm font-medium text-slate-700 neu-sm hover:neu-inset-sm transition-all disabled:opacity-50"
          >
            {microsoftLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
            )}
            {microsoftLoading ? 'Signing in...' : 'Sign in with Microsoft'}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}
        </div>

        <p className="text-slate-400 text-xs text-center mt-6">
          Powered by Indira University IT Department
        </p>
      </div>
    </div>
  );
}
