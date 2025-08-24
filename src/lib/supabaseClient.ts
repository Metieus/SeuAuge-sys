import { createClient } from '@supabase/supabase-js';

// Verificação de variáveis obrigatórias
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Development mode check
const isDevelopment = import.meta.env.DEV;

// Create a mock client for development when credentials are missing
const createMockClient = () => {
  const mockError = new Error('Supabase not configured. Please connect to Supabase to enable authentication.');
  
  return {
    auth: {
      signInWithPassword: () => Promise.reject(mockError),
      signUp: () => Promise.reject(mockError),
      signOut: () => Promise.reject(mockError),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      resetPasswordForEmail: () => Promise.reject(mockError),
      resend: () => Promise.reject(mockError),
      onAuthStateChange: (callback: Function) => {
        // Mock empty subscription
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.reject(mockError),
      update: () => Promise.reject(mockError),
      delete: () => Promise.reject(mockError),
    }),
    realtime: {
      channel: () => ({
        on: () => ({}),
        subscribe: () => ({}),
        unsubscribe: () => ({}),
      })
    }
  };
};

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== '' && 
  supabaseAnonKey !== '' &&
  supabaseUrl.includes('.supabase.co') &&
  !supabaseUrl.includes('demo-project') &&
  !supabaseAnonKey.includes('demo-key');

// Create either real or mock client
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        // Configure URLs for email verification and password reset
        redirectTo: `${window.location.origin}/auth/confirm`,
      },
      global: {
        headers: {
          'x-application-name': 'healthflix',
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
        heartbeatIntervalMs: 30000,
        reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 10000),
      },
      db: {
        schema: 'public',
      },
    })
  : createMockClient() as any;

// Export configuration status
export const isSupabaseConfigured = hasValidCredentials;

// Helper function to add timeout to Supabase operations
export const withTimeout = <T>(
  promise: Promise<T>, 
  timeoutMs: number = 30000, 
  operation: string = 'Operation'
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`${operation} timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
};

// Enhanced auth operations with timeout and configuration check
export const authOperations = {
  async signInWithPassword(email: string, password: string) {
    if (!hasValidCredentials) {
      throw new Error('Supabase not configured. Please set up your Supabase credentials.');
    }
    return withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      15000,
      'Login'
    );
  },

  async signUp(email: string, password: string, options?: any) {
    if (!hasValidCredentials) {
      throw new Error('Supabase not configured. Please set up your Supabase credentials.');
    }
    return withTimeout(
      supabase.auth.signUp({ email, password, options }),
      20000,
      'Registration'
    );
  },

  async signOut() {
    if (!hasValidCredentials) {
      return { error: null };
    }
    return withTimeout(
      supabase.auth.signOut(),
      10000,
      'Logout'
    );
  },

  async getSession() {
    if (!hasValidCredentials) {
      return { data: { session: null }, error: null };
    }
    return withTimeout(
      supabase.auth.getSession(),
      10000,
      'Get Session'
    );
  },

  async getUser() {
    if (!hasValidCredentials) {
      return { data: { user: null }, error: null };
    }
    return withTimeout(
      supabase.auth.getUser(),
      10000,
      'Get User'
    );
  },

  async resetPasswordForEmail(email: string, redirectTo?: string) {
    if (!hasValidCredentials) {
      throw new Error('Supabase not configured. Please set up your Supabase credentials.');
    }
    const finalRedirectTo = redirectTo || `${window.location.origin}/auth/reset-password`;
    return withTimeout(
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: finalRedirectTo,
      }),
      15000,
      'Password Reset'
    );
  },

  async resendConfirmation(email: string, redirectTo?: string) {
    if (!hasValidCredentials) {
      throw new Error('Supabase not configured. Please set up your Supabase credentials.');
    }
    const finalRedirectTo = redirectTo || `${window.location.origin}/auth/confirm`;
    return withTimeout(
      supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: finalRedirectTo,
        }
      }),
      15000,
      'Resend Confirmation'
    );
  },
};

// Database types for better type safety
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan?: string | null;
  role?: 'user' | 'admin' | 'moderator';
  birthdate?: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export default supabase;
