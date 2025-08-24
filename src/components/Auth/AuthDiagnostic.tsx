import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { authOperations } from '../../lib/supabase';

interface DiagnosticResult {
  name: string;
  status: 'checking' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const AuthDiagnostic: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'checking' | 'success' | 'error' | 'warning'>('checking');

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    setOverallStatus('checking');

    const newResults: DiagnosticResult[] = [];

    // 1. Verificar variáveis de ambiente
    newResults.push({
      name: 'Variáveis de Ambiente',
      status: 'checking',
      message: 'Verificando configuração...'
    });
    setResults([...newResults]);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      newResults[0] = {
        name: 'Variáveis de Ambiente',
        status: 'error',
        message: 'Variáveis de ambiente não configuradas',
        details: `VITE_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}\nVITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅' : '❌'}`
      };
    } else {
      newResults[0] = {
        name: 'Variáveis de Ambiente',
        status: 'success',
        message: 'Variáveis de ambiente configuradas corretamente',
        details: `URL: ${supabaseUrl.substring(0, 30)}...\nKey: ${supabaseKey.substring(0, 20)}...`
      };
    }
    setResults([...newResults]);

    // 2. Verificar conexão com Supabase
    newResults.push({
      name: 'Conexão Supabase',
      status: 'checking',
      message: 'Testando conexão...'
    });
    setResults([...newResults]);

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        newResults[1] = {
          name: 'Conexão Supabase',
          status: 'error',
          message: 'Erro na conexão com Supabase',
          details: error.message
        };
      } else {
        newResults[1] = {
          name: 'Conexão Supabase',
          status: 'success',
          message: 'Conexão com Supabase estabelecida',
          details: data.session ? 'Usuário autenticado' : 'Nenhum usuário autenticado'
        };
      }
    } catch (error) {
      newResults[1] = {
        name: 'Conexão Supabase',
        status: 'error',
        message: 'Falha na conexão com Supabase',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
    setResults([...newResults]);

    // 3. Verificar operações de autenticação
    newResults.push({
      name: 'Operações de Auth',
      status: 'checking',
      message: 'Testando operações...'
    });
    setResults([...newResults]);

    try {
      // Testar getSession
      const { data, error } = await authOperations.getSession();
      if (error) {
        newResults[2] = {
          name: 'Operações de Auth',
          status: 'error',
          message: 'Erro nas operações de autenticação',
          details: error.message
        };
      } else {
        newResults[2] = {
          name: 'Operações de Auth',
          status: 'success',
          message: 'Operações de autenticação funcionando',
          details: 'getSession executado com sucesso'
        };
      }
    } catch (error) {
      newResults[2] = {
        name: 'Operações de Auth',
        status: 'error',
        message: 'Falha nas operações de autenticação',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
    setResults([...newResults]);

    // 4. Verificar banco de dados
    newResults.push({
      name: 'Banco de Dados',
      status: 'checking',
      message: 'Testando acesso ao banco...'
    });
    setResults([...newResults]);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      if (error) {
        newResults[3] = {
          name: 'Banco de Dados',
          status: 'error',
          message: 'Erro no acesso ao banco de dados',
          details: error.message
        };
      } else {
        newResults[3] = {
          name: 'Banco de Dados',
          status: 'success',
          message: 'Acesso ao banco de dados funcionando',
          details: 'Consulta executada com sucesso'
        };
      }
    } catch (error) {
      newResults[3] = {
        name: 'Banco de Dados',
        status: 'error',
        message: 'Falha no acesso ao banco de dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
    setResults([...newResults]);

    // 5. Verificar configuração de CORS
    newResults.push({
      name: 'Configuração CORS',
      status: 'checking',
      message: 'Verificando CORS...'
    });
    setResults([...newResults]);

    const currentOrigin = window.location.origin;
    const isLocalhost = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');
    
    if (isLocalhost) {
      newResults[4] = {
        name: 'Configuração CORS',
        status: 'success',
        message: 'CORS configurado para desenvolvimento',
        details: `Origin: ${currentOrigin}`
      };
    } else {
      newResults[4] = {
        name: 'Configuração CORS',
        status: 'warning',
        message: 'Verificar configuração de CORS para produção',
        details: `Origin: ${currentOrigin}`
      };
    }
    setResults([...newResults]);

    // Determinar status geral
    const errorCount = newResults.filter(r => r.status === 'error').length;
    const warningCount = newResults.filter(r => r.status === 'warning').length;

    if (errorCount > 0) {
      setOverallStatus('error');
    } else if (warningCount > 0) {
      setOverallStatus('warning');
    } else {
      setOverallStatus('success');
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Diagnóstico de Autenticação
          </h1>
          <p className="text-gray-600">
            Verificando configurações e conectividade do sistema de autenticação
          </p>
        </div>

        {/* Status Geral */}
        <div className={`p-4 rounded-lg border ${getStatusColor(overallStatus)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(overallStatus)}
              <div>
                <h3 className="font-semibold text-gray-900">
                  Status Geral: {
                    overallStatus === 'success' ? 'Tudo Funcionando' :
                    overallStatus === 'error' ? 'Problemas Detectados' :
                    overallStatus === 'warning' ? 'Atenção Necessária' :
                    'Verificando...'
                  }
                </h3>
                <p className="text-sm text-gray-600">
                  {overallStatus === 'success' ? 'Sistema de autenticação funcionando corretamente' :
                   overallStatus === 'error' ? 'Foram encontrados problemas que precisam ser corrigidos' :
                   overallStatus === 'warning' ? 'Algumas configurações precisam de atenção' :
                   'Executando verificações...'}
                </p>
              </div>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Verificando...' : 'Verificar Novamente'}
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{result.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  {result.details && (
                    <pre className="text-xs text-gray-500 mt-2 bg-white p-2 rounded border overflow-x-auto">
                      {result.details}
                    </pre>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ações Recomendadas */}
        {overallStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <h3 className="font-semibold text-red-900 mb-2">Ações Recomendadas:</h3>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Verifique se as variáveis de ambiente estão configuradas corretamente</li>
              <li>• Confirme se o projeto Supabase está ativo e acessível</li>
              <li>• Verifique se as políticas de segurança do banco estão configuradas</li>
              <li>• Teste a conectividade de rede</li>
            </ul>
          </motion.div>
        )}

        {overallStatus === 'warning' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <h3 className="font-semibold text-yellow-900 mb-2">Recomendações:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Configure CORS adequadamente para produção</li>
              <li>• Verifique as configurações de segurança</li>
              <li>• Teste em ambiente de produção</li>
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthDiagnostic;
