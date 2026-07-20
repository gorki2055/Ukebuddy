import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to home
  if (user) {
    navigate('/');
    return null;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              streak: 0,
            }
          }
        });
        if (error) throw error;
        // In many cases Supabase requires email verification unless disabled in dashboard
        alert('Check your email for the confirmation link! (Unless auto-confirm is enabled)');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow w-full mx-auto flex flex-col items-center justify-center py-xl">
      <div className="bg-surface-container-low p-lg md:p-xl rounded-2xl w-[400px] max-w-[90vw] card-shadow">
        <h1 className="text-headline-md font-headline-md text-on-surface mb-sm text-center">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p className="text-body-md text-on-surface-variant text-center mb-lg">
          {isLogin 
            ? 'Sign in to access your saved chords and practice sessions.' 
            : 'Join Uke Quest to take your playing to the next level.'}
        </p>

        {error && (
          <div className="bg-error-container text-on-error-container p-sm rounded-lg mb-md text-body-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-md">
          {!isLogin && (
            <div>
              <label className="block text-label-md font-label-md text-on-surface mb-xs" htmlFor="displayName">
                Name (Optional)
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-sm py-sm bg-surface-container border border-outline focus:border-primary rounded-lg text-body-md text-on-surface outline-none transition-colors"
                placeholder="How should we call you?"
              />
            </div>
          )}
          <div>
            <label className="block text-label-md font-label-md text-on-surface mb-xs" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-sm py-sm bg-surface-container border border-outline focus:border-primary rounded-lg text-body-md text-on-surface outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-label-md font-label-md text-on-surface mb-xs" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-sm py-sm bg-surface-container border border-outline focus:border-primary rounded-lg text-body-md text-on-surface outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-on-primary py-sm rounded-full text-label-lg font-label-lg transition-colors mt-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-lg text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-primary hover:text-primary/80 text-label-md font-label-md transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
