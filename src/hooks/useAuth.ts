import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local "soft auth" takes precedence if present
    const raw = localStorage.getItem('local_auth_session');
    if (raw) {
      try {
        const localSession = JSON.parse(raw);
        setSession(localSession);
        setUser(localSession?.user ?? null);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem('local_auth_session');
      }
    }

    // Fallback to Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string, followerCount?: number) => {
    // Soft auth: allow any email containing '@' and any password
    if (!email || !email.includes('@') || !password) {
      return { error: new Error('Please enter a valid email and password') };
    }

    try {
      const idBase = typeof btoa === 'function' ? btoa(email).replace(/=+$/, '') : Math.random().toString(36).slice(2);
      const localUser = {
        id: `local-${idBase}`,
        email,
        app_metadata: { provider: 'local', providers: ['local'] },
        user_metadata: {
          display_name: displayName || email.split('@')[0],
          follower_count: followerCount ?? 0,
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        role: 'authenticated',
      } as unknown as User;

      const localSession = {
        access_token: 'local-access-token',
        refresh_token: 'local-refresh-token',
        token_type: 'bearer',
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // 1 year
        user: localUser,
      } as unknown as Session;

      localStorage.setItem('local_auth_session', JSON.stringify(localSession));
      setUser(localUser);
      setSession(localSession);
      setLoading(false);
      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Soft auth: allow any email containing '@' and any password
    if (!email || !email.includes('@') || !password) {
      return { error: new Error('Please enter a valid email and password') };
    }

    try {
      const idBase = typeof btoa === 'function' ? btoa(email).replace(/=+$/, '') : Math.random().toString(36).slice(2);
      const localUser = {
        id: `local-${idBase}`,
        email,
        app_metadata: { provider: 'local', providers: ['local'] },
        user_metadata: {
          display_name: email.split('@')[0],
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        role: 'authenticated',
      } as unknown as User;

      const localSession = {
        access_token: 'local-access-token',
        refresh_token: 'local-refresh-token',
        token_type: 'bearer',
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
        user: localUser,
      } as unknown as Session;

      localStorage.setItem('local_auth_session', JSON.stringify(localSession));
      setUser(localUser);
      setSession(localSession);
      setLoading(false);
      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('local_auth_session');
      setUser(null);
      setSession(null);
      setLoading(false);
      // Also sign out from Supabase if there was a session
      await supabase.auth.signOut();
      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };
};