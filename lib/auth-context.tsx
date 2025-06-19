import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseService } from './supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    
    let mounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthProvider: Initial session check', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          error: error?.message 
        });
        
        if (mounted) {
          setUserState(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('AuthProvider: Error getting session', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed', { 
          event, 
          hasSession: !!session, 
          hasUser: !!session?.user 
        });
        
        if (mounted) {
          setUserState(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('AuthProvider: Signing out...');
      await supabaseService.signOut();
      setUserState(null);
      console.log('AuthProvider: Sign out successful');
    } catch (error) {
      console.error('AuthProvider: Error signing out:', error);
    }
  };

  const setUser = (user: User | null) => {
    console.log('AuthProvider: Setting user manually', { 
      hasUser: !!user, 
      userId: user?.id 
    });
    setUserState(user);
  };

  const value = {
    user,
    loading,
    signOut,
    setUser,
  };

  console.log('AuthProvider: Current state', { 
    hasUser: !!user, 
    loading, 
    userId: user?.id 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 