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
  EyeOff
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

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setIsResending(true);
    try {
      const { error } = await authOperations.resendConfirmation(email);
      
      if (error) {
        toast.error(`Erro ao reenviar confirmação: ${error.message}`);
      } else {
        toast.success('Email de confirmação reenviado! Verifique sua caixa de entrada');
      }
    } catch (error) {
      toast.error('Erro ao reenviar confirmação');
      console.error('Resend confirmation error:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckConfirmation = async () => {
    if (!email || !password) {
      toast.error('Por favor, insira email e senha');
      return;
    }

    setIsChecking(true);
    try {
      const { data, error } = await authOperations.signInWithPassword(email, password);
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Email ainda não foi confirmado. Verifique sua caixa de entrada');
        } else {
          toast.error(`Erro de login: ${error.message}`);
        }
      } else if (data.user) {
        toast.success('Email confirmado! Login realizado com sucesso');
        onSuccess?.();
      }
    } catch (error) {
      toast.error('Erro ao verificar confirmação');
      console.error('Check confirmation error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDirectLogin = async () => {
    if (!email || !password) {
      toast.error('Por favor, insira email e senha');
      return;
    }

    setIsLoggingIn(true);
    try {
      const { data, error } = await authOperations.signInWithPassword(email, password);
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Email não confirmado. Clique em "Reenviar Confirmação"');
        } else {
          toast.error(`Erro de login: ${error.message}`);
        }
      } else if (data.user) {
        toast.success('Login realizado com sucesso!');
        onSuccess?.();
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Confirmação de Email
          </h2>
          <p className="text-gray-600 text-sm">
            Seu email precisa ser confirmado para acessar a conta
          </p>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!!initialEmail}
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Reenviar Confirmação */}
          <button
            onClick={handleResendConfirmation}
            disabled={isResending || !email}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isResending ? 'Reenviando...' : 'Reenviar Confirmação'}
          </button>

          {/* Verificar Confirmação */}
          <button
            onClick={handleCheckConfirmation}
            disabled={isChecking || !email || !password}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Verificando...' : 'Verificar Confirmação'}
          </button>

          {/* Tentar Login Direto */}
          <button
            onClick={handleDirectLogin}
            disabled={isLoggingIn || !email || !password}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isLoggingIn ? 'Fazendo Login...' : 'Tentar Login'}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Instruções:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Verifique sua caixa de entrada (e spam)</li>
            <li>• Clique no link de confirmação no email</li>
            <li>• Se não recebeu, clique em "Reenviar Confirmação"</li>
            <li>• Após confirmar, tente fazer login novamente</li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">
            Problemas comuns:
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Email não aparece? Verifique a pasta spam</li>
            <li>• Link expirado? Reenvie a confirmação</li>
            <li>• Ainda com problemas? Entre em contato</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailConfirmationHelper;
