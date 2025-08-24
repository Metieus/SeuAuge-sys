// Correções para problemas comuns de autenticação
import { supabase } from './supabaseClient';
import { authOperations } from './supabase';

// Interface para problemas de autenticação
export interface AuthProblem {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  fix: () => Promise<{ success: boolean; message: string; details?: string }>;
  check: () => Promise<{ hasProblem: boolean; details?: string }>;
}

// Problema 1: Sessão expirada ou inválida
export const sessionExpiredProblem: AuthProblem = {
  id: 'session_expired',
  name: 'Sessão Expirada',
  description: 'A sessão do usuário expirou ou se tornou inválida',
  severity: 'medium',
  check: async () => {
    try {
      const { data, error } = await authOperations.getSession();
      if (error) {
        return { hasProblem: true, details: error.message };
      }
      if (!data.session) {
        return { hasProblem: true, details: 'Nenhuma sessão ativa encontrada' };
      }
      return { hasProblem: false };
    } catch (error) {
      return { hasProblem: true, details: 'Erro ao verificar sessão' };
    }
  },
  fix: async () => {
    try {
      // Tentar renovar a sessão
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        return { success: false, message: 'Falha ao renovar sessão', details: error.message };
      }
      if (data.session) {
        return { success: true, message: 'Sessão renovada com sucesso' };
      } else {
        return { success: false, message: 'Sessão não pôde ser renovada - faça login novamente' };
      }
    } catch (error) {
      return { success: false, message: 'Erro ao renovar sessão', details: 'Erro desconhecido' };
    }
  }
};

// Problema 2: Token de acesso inválido
export const invalidTokenProblem: AuthProblem = {
  id: 'invalid_token',
  name: 'Token de Acesso Inválido',
  description: 'O token de acesso está inválido ou corrompido',
  severity: 'high',
  check: async () => {
    try {
      const { data, error } = await authOperations.getUser();
      if (error && error.message.includes('JWT')) {
        return { hasProblem: true, details: 'Token JWT inválido' };
      }
      return { hasProblem: false };
    } catch (error) {
      return { hasProblem: true, details: 'Erro ao verificar token' };
    }
  },
  fix: async () => {
    try {
      // Forçar logout e limpar tokens
      await authOperations.signOut();
      return { success: true, message: 'Tokens limpos - faça login novamente' };
    } catch (error) {
      return { success: false, message: 'Erro ao limpar tokens', details: 'Erro desconhecido' };
    }
  }
};

// Problema 3: Problemas de conectividade
export const connectivityProblem: AuthProblem = {
  id: 'connectivity',
  name: 'Problemas de Conectividade',
  description: 'Problemas de conexão com o Supabase',
  severity: 'high',
  check: async () => {
    try {
      const startTime = Date.now();
      const { data, error } = await authOperations.getSession();
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return { hasProblem: true, details: `Erro de conexão: ${error.message}` };
      }
      if (responseTime > 5000) {
        return { hasProblem: true, details: `Resposta lenta: ${responseTime}ms` };
      }
      return { hasProblem: false };
    } catch (error) {
      return { hasProblem: true, details: 'Falha na conexão com Supabase' };
    }
  },
  fix: async () => {
    try {
      // Tentar reconectar
      const { data, error } = await authOperations.getSession();
      if (error) {
        return { success: false, message: 'Falha na reconexão', details: error.message };
      }
      return { success: true, message: 'Conexão restaurada' };
    } catch (error) {
      return { success: false, message: 'Erro na reconexão', details: 'Verifique sua internet' };
    }
  }
};

// Problema 4: Perfil de usuário não encontrado
export const missingProfileProblem: AuthProblem = {
  id: 'missing_profile',
  name: 'Perfil de Usuário Não Encontrado',
  description: 'O perfil do usuário não existe no banco de dados',
  severity: 'medium',
  check: async () => {
    try {
      const { data: { user } } = await authOperations.getUser();
      if (!user) {
        return { hasProblem: true, details: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        return { hasProblem: true, details: 'Perfil não encontrado no banco' };
      }
      return { hasProblem: false };
    } catch (error) {
      return { hasProblem: true, details: 'Erro ao verificar perfil' };
    }
  },
  fix: async () => {
    try {
      const { data: { user } } = await authOperations.getUser();
      if (!user) {
        return { success: false, message: 'Usuário não autenticado' };
      }

      // Criar perfil básico
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || 'Usuário',
          role: 'user'
        });

      if (error) {
        return { success: false, message: 'Erro ao criar perfil', details: error.message };
      }
      return { success: true, message: 'Perfil criado com sucesso' };
    } catch (error) {
      return { success: false, message: 'Erro ao criar perfil', details: 'Erro desconhecido' };
    }
  }
};

// Problema 5: Configuração incorreta de CORS
export const corsProblem: AuthProblem = {
  id: 'cors',
  name: 'Problema de CORS',
  description: 'Configuração incorreta de CORS',
  severity: 'medium',
  check: async () => {
    try {
      const currentOrigin = window.location.origin;
      const isLocalhost = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');
      
      if (!isLocalhost) {
        // Em produção, verificar se há erros de CORS
        const { data, error } = await authOperations.getSession();
        if (error && error.message.includes('CORS')) {
          return { hasProblem: true, details: 'Erro de CORS detectado' };
        }
      }
      return { hasProblem: false };
    } catch (error) {
      return { hasProblem: true, details: 'Erro ao verificar CORS' };
    }
  },
  fix: async () => {
    return { 
      success: false, 
      message: 'CORS deve ser configurado no servidor', 
      details: 'Adicione sua origem às configurações de CORS do Supabase' 
    };
  }
};

// Lista de todos os problemas
export const authProblems: AuthProblem[] = [
  sessionExpiredProblem,
  invalidTokenProblem,
  connectivityProblem,
  missingProfileProblem,
  corsProblem
];

// Função para diagnosticar todos os problemas
export const diagnoseAuthProblems = async (): Promise<{
  problems: Array<{ problem: AuthProblem; hasProblem: boolean; details?: string }>;
  summary: { total: number; critical: number; high: number; medium: number; low: number };
}> => {
  const results = await Promise.all(
    authProblems.map(async (problem) => {
      const check = await problem.check();
      return { problem, hasProblem: check.hasProblem, details: check.details };
    })
  );

  const summary = {
    total: results.filter(r => r.hasProblem).length,
    critical: results.filter(r => r.hasProblem && r.problem.severity === 'critical').length,
    high: results.filter(r => r.hasProblem && r.problem.severity === 'high').length,
    medium: results.filter(r => r.hasProblem && r.problem.severity === 'medium').length,
    low: results.filter(r => r.hasProblem && r.problem.severity === 'low').length,
  };

  return { problems: results, summary };
};

// Função para aplicar correções automáticas
export const applyAuthFixes = async (): Promise<{
  applied: Array<{ problem: AuthProblem; success: boolean; message: string; details?: string }>;
  summary: { total: number; successful: number; failed: number };
}> => {
  const { problems } = await diagnoseAuthProblems();
  const problemsToFix = problems.filter(p => p.hasProblem);

  const results = await Promise.all(
    problemsToFix.map(async ({ problem }) => {
      const fix = await problem.fix();
      return { problem, success: fix.success, message: fix.message, details: fix.details };
    })
  );

  const summary = {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
  };

  return { applied: results, summary };
};

// Função para limpar dados de autenticação corrompidos
export const clearAuthData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Limpar localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Limpar sessionStorage
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

    // Fazer logout do Supabase
    await authOperations.signOut();

    return { success: true, message: 'Dados de autenticação limpos com sucesso' };
  } catch (error) {
    return { success: false, message: 'Erro ao limpar dados de autenticação' };
  }
};

// Função para verificar se o usuário precisa fazer login novamente
export const needsReauthentication = async (): Promise<boolean> => {
  try {
    const { data, error } = await authOperations.getSession();
    if (error) return true;
    if (!data.session) return true;
    
    // Verificar se o token está próximo de expirar (menos de 5 minutos)
    const expiresAt = data.session.expires_at;
    if (expiresAt) {
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiresAt - now;
      if (timeUntilExpiry < 300) { // 5 minutos
        return true;
      }
    }
    
    return false;
  } catch (error) {
    return true;
  }
};

// Função para forçar renovação de sessão
export const forceSessionRefresh = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      return { success: false, message: 'Falha ao renovar sessão' };
    }
    if (data.session) {
      return { success: true, message: 'Sessão renovada com sucesso' };
    } else {
      return { success: false, message: 'Sessão não pôde ser renovada' };
    }
  } catch (error) {
    return { success: false, message: 'Erro ao renovar sessão' };
  }
};
