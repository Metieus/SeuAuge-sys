// Contexto responsável por gerenciar a autenticação com o Supabase
import React, { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser, AuthError } from "@supabase/supabase-js";
import { supabase, UserProfile, authOperations, withTimeout } from "../lib/supabase";
import {
  updateUserProfile,
  UpdateUserInput,
  createUserDocument,
} from "../services/user";
import { getPlanFromToken } from "../services/plan";
import { initializeActivityTracking } from "../services/activity";
import { useAchievementsStore } from "../stores/achievementsStore";
import { useLevelStore } from "../stores/levelStore";
import { useGoalsStore } from "../stores/goalsStore";
import { initializeSyncSystem, stopRealtimeSync } from "../services/sync";
import { dataSyncService } from "../services/dataSync";
import { useUserProfileStore } from "../stores/userProfileStore";

// Production admin check using Supabase user metadata
// Admin emails should NEVER be hardcoded in frontend for production
const isDevelopment = import.meta.env.DEV;
const FALLBACK_ADMIN_EMAILS = isDevelopment ? [
  import.meta.env.VITE_ADMIN_EMAIL || "admin@seuauge.com",
].filter(Boolean) : [];

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan?: string | null;
  isPremium: boolean;
  isAdmin: boolean;
  role?: 'user' | 'admin' | 'moderator';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    birthdate: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (data: UpdateUserInput) => Promise<void>;
  refreshPlan: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Input sanitization helper
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"']/g, '');
};

// Enhanced password validation
const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos um número' };
  }
  return { isValid: true };
};

// Get user profile from Supabase
const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  // Function to initialize all user systems with debounce to prevent multiple simultaneous calls
  let initializationPromise: Promise<void> | null = null;
  const initializeUserSystems = async (supabaseUser: SupabaseUser, userPlan?: string) => {
    // Prevent multiple simultaneous initializations
    if (initializationPromise) {
      return initializationPromise;
    }

    initializationPromise = (async () => {
      try {
        setIsInitializing(true);

        // Initialize systems with timeout protection
        const initPromises = [];

        // Initialize user profile
        const profileStore = useUserProfileStore.getState();
        initPromises.push(
          withTimeout(
            profileStore.loadProfile(supabaseUser.id),
            5000,
            'Load Profile'
          )
        );

        // Initialize activity tracking (handles daily login)
        initPromises.push(
          withTimeout(
            initializeActivityTracking(),
            3000,
            'Activity Tracking'
          )
        );

        // Initialize achievements
        const achievementsStore = useAchievementsStore.getState();
        initPromises.push(
          withTimeout(
            achievementsStore.initializeAchievements(),
            3000,
            'Achievements'
          )
        );

        // Check daily login for level system
        const levelStore = useLevelStore.getState();
        initPromises.push(
          withTimeout(
            levelStore.checkDailyLogin(),
            2000,
            'Daily Login Check'
          )
        );

        // Wait for all critical initializations with individual error handling
        const results = await Promise.allSettled(initPromises);
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const operations = ['Load Profile', 'Activity Tracking', 'Achievements', 'Daily Login Check'];
            console.warn(`Failed to initialize ${operations[index]}:`, result.reason);
          }
        });

        // Non-critical initializations (can fail without blocking login)
        try {
          // Generate smart goals if none exist
          const goalsStore = useGoalsStore.getState();
          if (goalsStore.goals.length === 0) {
            setTimeout(() => {
              goalsStore.generateSmartGoals({ plan: userPlan });
            }, 1000);
          }

          // Reset daily challenges if needed (new day)
          const today = new Date().toDateString();
          const lastResetDate = localStorage.getItem('lastChallengeReset');
          if (lastResetDate !== today) {
            goalsStore.resetDailyChallenges();
            localStorage.setItem('lastChallengeReset', today);
          }

          // Initialize sync system asynchronously
          setTimeout(async () => {
            try {
              await withTimeout(initializeSyncSystem(), 5000, 'Sync System');
              dataSyncService.startAutoSync(15); // Sync every 15 minutes
            } catch (error) {
              console.warn('Failed to initialize sync system:', error);
            }
          }, 2000);
        } catch (error) {
          console.warn('Failed to initialize non-critical systems:', error);
        }

      } catch (error) {
        console.error('Erro ao inicializar sistemas do usuário:', error);
        // Don't throw the error to prevent login from failing
      } finally {
        setIsInitializing(false);
        initializationPromise = null;
      }
    })();

    return initializationPromise;
  };

  const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    const planFromToken = await getPlanFromToken();
    const plan = planFromToken;

    // Get user profile data
    const profile = await getUserProfile(supabaseUser.id);

    // Production admin check using user metadata and profile role
    let isAdmin = false;
    let role: 'user' | 'admin' | 'moderator' = 'user';

    // Check user metadata for admin role
    if (supabaseUser.user_metadata?.role === 'admin') {
      isAdmin = true;
      role = 'admin';
    } else if (supabaseUser.user_metadata?.role === 'moderator') {
      role = 'moderator';
    } else if (profile?.role) {
      // Fallback to profile role
      role = profile.role;
      isAdmin = role === 'admin';
    } else {
      // Development fallback only
      if (isDevelopment && !isAdmin) {
        isAdmin = FALLBACK_ADMIN_EMAILS.includes(supabaseUser.email || '');
        if (isAdmin) role = 'admin';
      }
    }

    // Initialize user systems for authenticated user
    try {
      await initializeUserSystems(supabaseUser, plan);
    } catch (error) {
      console.error('Erro ao inicializar sistemas do usuário:', error);
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: sanitizeInput(profile?.name || supabaseUser.user_metadata?.name || ""),
      avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || undefined,
      plan,
      isPremium: !!plan, // Tem plano = é premium
      isAdmin,
      role,
    };
  };

  useEffect(() => {
    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await authOperations.getSession();

        if (session?.user) {
          const mapped = await mapSupabaseUser(session.user);
          setUser(mapped);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        // Continue loading even if session check fails
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            const mapped = await mapSupabaseUser(session.user);
            setUser(mapped);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error mapping Supabase user:', error);
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Input validation and sanitization
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('Formato de email inválido');
    }

    try {
      const { data, error } = await authOperations.signInWithPassword(
        sanitizedEmail,
        password
      );

      if (error) throw error;

      if (data.user) {
        const mapped = await mapSupabaseUser(data.user);
        setUser(mapped);

        // Audit log (in production, send to secure logging service)
        if (import.meta.env.DEV) {
          console.log("Usuario autenticado:", mapped.email, "Role:", mapped.role);
        }
      }
    } catch (err: AuthError | any) {
      // Enhanced error handling without exposing sensitive information
      console.error("Login error:", err.message);

      if (err.message?.includes('Supabase not configured')) {
        throw new Error("Sistema de autenticação não configurado. Por favor, configure o Supabase primeiro.");
      } else if (err.message?.includes('Invalid login credentials')) {
        throw new Error("Email ou senha incorretos. Verifique suas credenciais.");
      } else if (err.message?.includes('Too many requests')) {
        throw new Error("Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.");
      } else if (err.message?.includes('Email not confirmed')) {
        throw new Error("Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.");
      } else if (err.message?.includes('User not found')) {
        throw new Error("Usuário não encontrado. Verifique o email digitado ou crie uma nova conta.");
      } else if (err.message?.includes('timeout')) {
        throw new Error("Tempo limite excedido. Verifique sua conexão com a internet e tente novamente.");
      } else if (err.message?.includes('network') || err.message?.includes('Failed to fetch')) {
        throw new Error("Erro de conexão. Verifique sua internet e se o Supabase está configurado corretamente.");
      } else {
        throw new Error("Erro interno. Tente novamente em alguns minutos.");
      }
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    birthdate: string,
  ) => {
    // Input validation and sanitization
    if (!email || !password || !name || !birthdate) {
      throw new Error('Todos os campos são obrigatórios');
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedName = sanitizeInput(name);
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('Formato de email inválido');
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message || 'Senha inválida');
    }

    // Name validation
    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      throw new Error('Nome deve ter entre 2 e 50 caracteres');
    }

    // Age validation (basic check for reasonable birth date)
    const birthDate = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13 || age > 120) {
      throw new Error('Data de nascimento inválida');
    }

    try {
      const { data, error } = await authOperations.signUp(
        sanitizedEmail,
        password,
        {
          data: {
            name: sanitizedName,
            birthdate,
            role: 'user', // Default role
          },
        }
      );

      if (error) throw error;

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: sanitizedEmail,
            name: sanitizedName,
            birthdate,
            role: 'user',
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        const mapped = await mapSupabaseUser(data.user);
        setUser(mapped);

        // Initialize systems for new user with welcome bonus
        try {
          await initializeUserSystems(data.user, null);
          
          const levelStore = useLevelStore.getState();
          levelStore.addXP(50, '🎉 Bem-vindo ao Meu Auge!', 'bonus');
        } catch (error) {
          console.error('Erro ao inicializar sistemas para novo usuário:', error);
        }

        // Audit log
        if (import.meta.env.DEV) {
          console.log("Usuario registrado:", mapped.email);
        }
      }
    } catch (err: AuthError | any) {
      console.error("Registration error:", err.message);

      if (err.message?.includes('User already registered')) {
        throw new Error("Este email já está em uso. Tente fazer login ou use outro email.");
      } else if (err.message?.includes('Password should be at least')) {
        throw new Error("Senha muito fraca. Use uma senha com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.");
      } else if (err.message?.includes('Signups not allowed')) {
        throw new Error("Registros temporariamente desabilitados. Entre em contato com o suporte.");
      } else if (err.message?.includes('timeout')) {
        throw new Error("Tempo limite excedido. Verifique sua conexão e tente novamente.");
      } else if (err.message?.includes('network')) {
        throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        throw new Error("Erro no registro. Tente novamente em alguns minutos.");
      }
    }
  };

  const logout = async () => {
    try {
      const { error } = await authOperations.signOut();
      if (error) throw error;

      setUser(null);

      // Stop real-time sync
      stopRealtimeSync();

      // Stop auto sync
      dataSyncService.stopAutoSync();

      // Clear user profile
      const profileStore = useUserProfileStore.getState();
      profileStore.clearProfile();

      if (import.meta.env.DEV) {
        console.log("Usuario desconectado");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if signOut fails
      setUser(null);
      stopRealtimeSync();
      dataSyncService.stopAutoSync();

      const profileStore = useUserProfileStore.getState();
      profileStore.clearProfile();
    }
  };

  const updateUser = async (data: UpdateUserInput) => {
    try {
      // Sanitize input data
      const sanitizedData = {
        ...data,
        name: data.name ? sanitizeInput(data.name) : undefined,
      };
      
      await updateUserProfile(sanitizedData);
      
      // Update user profile store
      const profileStore = useUserProfileStore.getState();
      await profileStore.updateProfile(sanitizedData);
      
      // Update profile in database
      if (user?.id) {
        const { error } = await supabase
          .from('user_profiles')
          .update(sanitizedData)
          .eq('id', user.id);

        if (error) {
          console.error('Error updating user profile:', error);
        }
      }

      // Get current user and re-map
      const { data: { user: currentUser } } = await authOperations.getUser();
      if (currentUser) {
        const mapped = await mapSupabaseUser(currentUser);
        setUser(mapped);
      }
    } catch (err) {
      console.error("Update user error:", err);
      throw err;
    }
  };

  const refreshPlan = async () => {
    try {
      const { data: { user: currentUser } } = await authOperations.getUser();
      if (!currentUser) return;

      const newPlan = await withTimeout(getPlanFromToken(true), 5000, 'Refresh Plan');
      setUser((prev) =>
        prev ? { ...prev, plan: newPlan, isPremium: !!newPlan } : prev,
      );
    } catch (error) {
      console.error("Refresh plan error:", error);
      // Don't throw error to avoid breaking the app
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    refreshPlan,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
