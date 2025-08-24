import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  Wrench,
  Shield,
  Trash2
} from 'lucide-react';
import { 
  diagnoseAuthProblems, 
  applyAuthFixes, 
  clearAuthData,
  forceSessionRefresh,
  needsReauthentication
} from '../../lib/authFixes';
import toast from 'react-hot-toast';

const AuthFixer: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixResults, setFixResults] = useState<any>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics(null);
    setFixResults(null);

    try {
      const results = await diagnoseAuthProblems();
      setDiagnostics(results);
    } catch (error) {
      console.error('Erro no diagnóstico:', error);
      toast.error('Erro ao executar diagnóstico');
    } finally {
      setIsRunning(false);
    }
  };

  const applyFixes = async () => {
    setIsFixing(true);
    setFixResults(null);

    try {
      const results = await applyAuthFixes();
      setFixResults(results);
      
      if (results.summary.successful > 0) {
        toast.success(`${results.summary.successful} problemas corrigidos automaticamente`);
      }
      if (results.summary.failed > 0) {
        toast.error(`${results.summary.failed} problemas não puderam ser corrigidos automaticamente`);
      }
    } catch (error) {
      console.error('Erro ao aplicar correções:', error);
      toast.error('Erro ao aplicar correções');
    } finally {
      setIsFixing(false);
    }
  };

  const handleClearAuthData = async () => {
    if (!confirm('Tem certeza? Isso irá limpar todos os dados de autenticação e você precisará fazer login novamente.')) {
      return;
    }

    try {
      const result = await clearAuthData();
      if (result.success) {
        toast.success('Dados de autenticação limpos');
        // Recarregar a página para forçar novo login
        window.location.reload();
      } else {
        toast.error('Erro ao limpar dados');
      }
    } catch (error) {
      toast.error('Erro ao limpar dados de autenticação');
    }
  };

  const handleForceRefresh = async () => {
    try {
      const result = await forceSessionRefresh();
      if (result.success) {
        toast.success('Sessão renovada com sucesso');
        runDiagnostics(); // Re-executar diagnóstico
      } else {
        toast.error('Falha ao renovar sessão');
      }
    } catch (error) {
      toast.error('Erro ao renovar sessão');
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'low': return <Shield className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Corretor de Autenticação
          </h1>
          <p className="text-gray-600">
            Diagnostica e corrige problemas de autenticação automaticamente
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Diagnosticando...' : 'Executar Diagnóstico'}
          </button>

          <button
            onClick={applyFixes}
            disabled={isFixing || !diagnostics || diagnostics.summary.total === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Wrench className={`w-4 h-4 ${isFixing ? 'animate-spin' : ''}`} />
            {isFixing ? 'Corrigindo...' : 'Aplicar Correções'}
          </button>

          <button
            onClick={handleForceRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <RefreshCw className="w-4 h-4" />
            Renovar Sessão
          </button>

          <button
            onClick={handleClearAuthData}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Dados
          </button>
        </div>

        {/* Resumo do Diagnóstico */}
        {diagnostics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{diagnostics.summary.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{diagnostics.summary.critical}</div>
              <div className="text-sm text-red-600">Críticos</div>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{diagnostics.summary.high}</div>
              <div className="text-sm text-orange-600">Altos</div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{diagnostics.summary.medium}</div>
              <div className="text-sm text-yellow-600">Médios</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{diagnostics.summary.low}</div>
              <div className="text-sm text-blue-600">Baixos</div>
            </div>
          </motion.div>
        )}

        {/* Lista de Problemas */}
        {diagnostics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Problemas Detectados</h3>
            {diagnostics.problems.map((item: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  item.hasProblem 
                    ? getSeverityColor(item.problem.severity)
                    : 'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {item.hasProblem ? (
                      getSeverityIcon(item.problem.severity)
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.problem.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.problem.description}</p>
                      {item.hasProblem && item.details && (
                        <p className="text-xs text-gray-500 mt-2 bg-white p-2 rounded border">
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.hasProblem 
                        ? getSeverityColor(item.problem.severity).replace('text-', 'bg-').replace(' border-', ' text-')
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.hasProblem ? item.problem.severity.toUpperCase() : 'OK'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Resultados das Correções */}
        {fixResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Resultados das Correções</h3>
            
            {/* Resumo */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{fixResults.summary.total}</div>
                <div className="text-sm text-gray-600">Tentativas</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{fixResults.summary.successful}</div>
                <div className="text-sm text-green-600">Sucessos</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{fixResults.summary.failed}</div>
                <div className="text-sm text-red-600">Falhas</div>
              </div>
            </div>

            {/* Detalhes */}
            <div className="space-y-2">
              {fixResults.applied.map((result: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{result.problem.name}</h4>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-gray-500 mt-1 bg-white p-2 rounded border">
                          {result.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Ações Recomendadas */}
        {diagnostics && diagnostics.summary.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <h3 className="font-semibold text-blue-900 mb-2">Ações Recomendadas:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Clique em "Aplicar Correções" para tentar corrigir automaticamente</li>
              <li>• Se houver falhas, tente "Renovar Sessão" ou "Limpar Dados"</li>
              <li>• Para problemas de CORS, configure no painel do Supabase</li>
              <li>• Se os problemas persistirem, entre em contato com o suporte</li>
            </ul>
          </motion.div>
        )}

        {/* Status de Sucesso */}
        {diagnostics && diagnostics.summary.total === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg text-center"
          >
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900">Sistema Funcionando Perfeitamente!</h3>
            <p className="text-sm text-green-800">
              Nenhum problema de autenticação foi detectado.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthFixer;
