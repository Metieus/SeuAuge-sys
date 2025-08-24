import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { authOperations } from '../../lib/supabase';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import LanguageSelector from '../LanguageSelector';
import SupabaseSetupPrompt from './SupabaseSetupPrompt';
import toast from 'react-hot-toast';
import EmailConfirmationHelper from './EmailConfirmationHelper';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginProgress, setLoginProgress] = useState<string>('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError(t('auth.fill_all_fields'));
      return;
    }

    if (!validateEmail(email.trim())) {
      setError(t('auth.invalid_email'));
      return;
    }

    setError(null);
    setLoading(true);
    setLoginProgress('');

    try {
      // Step 1: Authenticate
      setLoginProgress(t('auth.verifying_credentials'));
      await login(email.trim(), password);

      // Step 2: Loading user data
      setLoginProgress(t('auth.loading_profile'));

      // Small delay to show progress feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Redirect
      setLoginProgress(t('auth.redirecting'));
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Login error:', error);

      // Enhanced error handling
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      if (errorMessage.includes('Email não confirmado')) {
        setNeedsEmailConfirmation(true);
        setError('Email não confirmado. Use as opções abaixo para resolver.');
      } else if (errorMessage.includes('timeout')) {
        const timeoutMsg = t('auth.connection_timeout');
        setError(timeoutMsg);
        toast.error(timeoutMsg, { duration: 6000 });
      } else if (errorMessage.includes('network')) {
        const networkMsg = t('auth.network_error');
        setError(networkMsg);
        toast.error(networkMsg, { duration: 6000 });
      } else if (errorMessage.includes('Invalid login credentials')) {
        setError(t('auth.invalid_credentials'));
      } else if (errorMessage.includes('Too many requests')) {
        setError(t('auth.too_many_attempts'));
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setLoginProgress('');
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError(t('auth.enter_email_for_reset'));
      return;
    }

    if (!validateEmail(email.trim())) {
      setError(t('auth.invalid_email'));
      return;
    }

    try {
      setLoading(true);
      await authOperations.resetPasswordForEmail(email.trim());
      setResetEmailSent(true);
      setError(null);
      toast.success(t('auth.reset_email_sent'));
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.message?.includes('not found')) {
        setError(t('auth.email_not_found'));
      } else if (error.message?.includes('Too many requests')) {
        setError(t('auth.too_many_reset_attempts'));
      } else {
        setError(t('auth.reset_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForgotPasswordMode(false);
    setResetEmailSent(false);
    setNeedsEmailConfirmation(false);
    setError(null);
    setEmail('');
    setPassword('');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {forgotPasswordMode ? t('auth.forgot_password') : t('auth.welcome_back')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {forgotPasswordMode 
              ? t('auth.enter_email_for_reset')
              : t('auth.sign_in_to_continue')
            }
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
            </div>
          </motion.div>
        )}

        {loginProgress && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 dark:text-blue-200 text-sm">{loginProgress}</span>
            </div>
          </motion.div>
        )}

        {!forgotPasswordMode && !resetEmailSent && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder={t('auth.email_placeholder')}
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder={t('auth.password_placeholder')}
                  disabled={loading}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('auth.forgot_password')}?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {loading ? t('auth.signing_in') : t('auth.sign_in')}
            </button>
          </form>
        )}

        {forgotPasswordMode && !resetEmailSent && (
          <div className="space-y-6">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder={t('auth.email_placeholder')}
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              onClick={handleForgotPassword}
              disabled={loading || !email.trim()}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {loading ? t('auth.sending') : t('auth.send_reset_email')}
            </button>
          </div>
        )}

        {resetEmailSent && (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t('auth.reset_email_sent')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t('auth.check_email_for_reset')}
            </p>
          </div>
        )}

        {forgotPasswordMode && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={resetForm}
            className="w-full text-slate-600 hover:text-primary font-medium py-2 text-sm transition-colors"
          >
            {t('auth.back_to_login')}
          </motion.button>
        )}

        {/* Email Confirmation Helper */}
        {needsEmailConfirmation && (
          <div className="mt-6">
            <EmailConfirmationHelper 
              email={email}
              onSuccess={() => {
                setNeedsEmailConfirmation(false);
                setError(null);
                navigate('/dashboard');
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          {t('auth.no_account')}{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            {t('auth.create_account')}
          </button>
        </p>
      </div>

      <LanguageSelector />
    </motion.div>
  );
};

export default LoginForm;
