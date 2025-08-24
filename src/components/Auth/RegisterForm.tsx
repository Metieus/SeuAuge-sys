import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Calendar, Ruler, Weight } from 'lucide-react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { validatePassword, validateEmail, validateName, validateBirthdate, validateNumeric, sanitizeInput } from '../../lib/validation';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import EmailVerificationPrompt from './EmailVerificationPrompt';
import SupabaseSetupPrompt from './SupabaseSetupPrompt';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    weight: '',
    height: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time password strength validation
    if (field === 'password') {
      const validation = validatePassword(value);
      setPasswordStrength(validation.strength);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || 'Nome inválido';
    }

    // Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Formato de email inválido';
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0] || 'Senha inválida';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    // Birthdate validation
    const birthdateValidation = validateBirthdate(formData.birthdate);
    if (!birthdateValidation.isValid) {
      newErrors.birthdate = birthdateValidation.error || 'Data de nascimento inválida';
    }

    // Weight validation (optional)
    const weightValidation = validateNumeric(formData.weight, 30, 300, 'Peso');
    if (!weightValidation.isValid) {
      newErrors.weight = weightValidation.error || 'Peso inválido';
    }

    // Height validation (optional)
    const heightValidation = validateNumeric(formData.height, 100, 250, 'Altura');
    if (!heightValidation.isValid) {
      newErrors.height = heightValidation.error || 'Altura inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        birthdate: formData.birthdate,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
      };

      await register(
        sanitizedData.email,
        sanitizedData.password,
        sanitizedData.name,
        sanitizedData.birthdate
      );

      // Show email verification prompt instead of immediate navigation
      setRegisteredEmail(sanitizedData.email);
      setShowEmailVerification(true);
    } catch (error: unknown) {
      console.error('Registration error:', error);

      // Handle specific error codes
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      // Show setup prompt if Supabase is not configured
      if (errorMessage.includes('Sistema de autenticação não configurado') ||
          errorMessage.includes('Supabase not configured') ||
          (!isSupabaseConfigured && (errorMessage.includes('conexão') || errorMessage.includes('Failed to fetch') || errorMessage.includes('network')))) {
        setShowSetupPrompt(true);
      } else if (errorMessage.includes('email-already-in-use') || errorMessage.includes('User already registered')) {
        setErrors({ email: 'Este email já está em uso. Tente fazer login.' });
      } else if (errorMessage.includes('weak-password')) {
        setErrors({ password: 'Senha muito fraca. Use pelo menos 6 caracteres.' });
      } else if (errorMessage.includes('invalid-email')) {
        setErrors({ email: 'Email inválido. Verifique o formato.' });
      } else if (errorMessage.includes('Email not confirmed')) {
        // If user tries to register with unconfirmed email, show verification prompt
        setRegisteredEmail(formData.email.trim().toLowerCase());
        setShowEmailVerification(true);
      } else {
        setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'strong': return 'bg-primary';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Fraca';
      case 'medium': return 'Média';
      case 'strong': return 'Forte';
    }
  };

  return (
    <>
      {showSetupPrompt && (
        <SupabaseSetupPrompt onClose={() => setShowSetupPrompt(false)} />
      )}

      {showEmailVerification && (
        <EmailVerificationPrompt
          email={registeredEmail}
          onClose={() => setShowEmailVerification(false)}
          onResendSuccess={() => {
            // Optionally navigate after successful resend
            // navigate('/preferences');
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Criar sua conta
        </h2>
        <p className="text-slate-600 text-sm sm:text-base">
          Comece sua jornada de transformação hoje mesmo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all duration-300"
              placeholder="Digite seu nome"
              required
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </motion.p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Endereço de Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all duration-300"
              placeholder="Digite seu email"
              required
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Data de nascimento */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Data de nascimento
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) => handleInputChange('birthdate', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all duration-300"
              required
            />
          </div>
          {errors.birthdate && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.birthdate}
            </motion.p>
          )}
        </motion.div>

        {/* Peso e Altura (opcionais) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Peso (kg)
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-300"
                placeholder="70"
              />
            </div>
            {errors.weight && (
              <p className="text-red-600 text-xs mt-1">{errors.weight}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Altura (cm)
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                min="100"
                max="250"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-300"
                placeholder="170"
              />
            </div>
            {errors.height && (
              <p className="text-red-600 text-xs mt-1">{errors.height}</p>
            )}
          </div>
        </motion.div>

        {/* Senha */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all duration-300"
              placeholder="Digite sua senha"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%' }}
                  />
                </div>
                <span className="text-slate-600">{getPasswordStrengthText()}</span>
              </div>
            </div>
          )}

          {errors.password && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Confirmar Senha */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all duration-300"
              placeholder="Confirme sua senha"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        {/* General error */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <p className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.general}
            </p>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base min-h-[44px] transform hover:scale-105 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Criando conta...
              </div>
            ) : (
              'Criar conta'
            )}
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg transition-all duration-300 text-base border border-slate-300 hover:border-primary"
          >
            Já tem uma conta? <span className="text-primary font-semibold">Fazer login</span>
          </button>
        </motion.div>
      </form>
    </motion.div>
    </>
  );
};

export default RegisterForm;
