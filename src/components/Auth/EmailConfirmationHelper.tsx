import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Send,
  Eye,
  EyeOff,
  Clock,
  UserCheck
} from 'lucide-react';
import { authOperations } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface EmailConfirmationHelperProps {
  email?: string;
  onSuccess?: () => void;
}

const EmailConfirmationHelper: React.FC<EmailConfirmationHelperProps> = ({ 
  email: initialEmail,
  onSuccess 
}) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      toast.error('Digite um email válido');
      return;
    }

    try {
      setIsResending(true);
      await authOperations.resend({
        type: 'signup',
        email: email.trim(),
      });
      
      toast.success('Email de confirmação reenviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Erro ao reenviar email:', error);
      
      if (error.message?.includes('already confirmed')) {
        toast.success('Este email já foi confirmado! Você pode fazer login.');
        setShowLoginForm(true);
      } else if (error.message?.includes('not found')) {
        toast.error('Email não encontrado. Verifique se está correto.');
      } else {
        toast.error('Erro ao reenviar email. Tente novamente.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckConfirmation = async () => {
    if (!email.trim()) {
      toast.error('Digite um email válido');
      return;
    }

    try {
      setIsChecking(true);
      // Tentar fazer login para verificar se o email foi confirmado
      const { data, error } = await authOperations.signInWithPassword({
        email: email.trim(),
        password: 'temp-check-password', // Senha temporária para teste
      });

      if (error) {
        if (error.message?.includes('Email not confirmed')) {
          toast.error('Email ainda não foi confirmado. Verifique sua caixa de entrada.');
        } else if (error.message?.includes('Invalid login credentials')) {
          toast.success('Email confirmado! Agora você pode fazer login.');
          setShowLoginForm(true);
        } else {
          toast.error('Erro ao verificar confirmação: ' + error.message);
        }
      }
    } catch (error: any) {
      console.error('Erro ao verificar confirmação:', error);
      toast.error('Erro ao verificar confirmação. Tente novamente.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Preencha email e senha');
      return;
    }

    try {
      setIsLoggingIn(true);
      const { data, error } = await authOperations.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message?.includes('Email not confirmed')) {
          toast.error('Email não confirmado. Verifique sua caixa de entrada.');
        } else if (error.message?.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error('Erro no login: ' + error.message);
        }
      } else {
        toast.success('Login realizado com sucesso!');
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error('Erro no login. Tente novamente.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4"
    >
      <div className="flex items-center space-x-3">
        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          Problema com Confirmação de Email?
        </h3>
      </div>

      <p className="text-blue-700 dark:text-blue-300 text-sm">
        Se você não recebeu o email de confirmação ou está tendo problemas para fazer login, 
        use as opções abaixo:
      </p>

      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:text-white"
            placeholder="Digite seu email"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleResendConfirmation}
            disabled={isResending || !email.trim()}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isResending ? 'Reenviando...' : 'Reenviar Email'}
          </button>

          <button
            onClick={handleCheckConfirmation}
            disabled={isChecking || !email.trim()}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserCheck className="w-4 h-4 mr-2" />
            )}
            {isChecking ? 'Verificando...' : 'Verificar Confirmação'}
          </button>
        </div>

        {/* Login Form */}
        {showLoginForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-blue-200 dark:border-blue-700 pt-4 space-y-4"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Email confirmado! Faça login abaixo:
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:text-white"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoggingIn || !password.trim()}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 mr-2" />
              )}
              {isLoggingIn ? 'Fazendo Login...' : 'Fazer Login'}
            </button>
          </motion.div>
        )}

        {/* Help Tips */}
        <div className="bg-blue-100 dark:bg-blue-800/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm">
            💡 Dicas para resolver problemas:
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Verifique sua caixa de spam/lixo eletrônico</li>
            <li>• Aguarde alguns minutos após o registro</li>
            <li>• Certifique-se de que o email está correto</li>
            <li>• Tente reenviar o email de confirmação</li>
            <li>• Se o problema persistir, entre em contato com o suporte</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailConfirmationHelper;
