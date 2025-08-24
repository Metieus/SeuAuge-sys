import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Bell, Palette, Globe, Shield, Volume2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const PreferencesSetup: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const [preferences, setPreferences] = useState({
    // Profile preferences
    displayName: '',
    profileVisibility: 'private',
    
    // Notification preferences
    workoutReminders: true,
    progressUpdates: true,
    emailNotifications: true,
    pushNotifications: true,
    
    // App preferences
    soundEffects: true,
    hapticFeedback: true,
    autoPlay: false,
    
    // Privacy preferences
    shareProgress: false,
    allowAnalytics: true,
    dataSaving: false,
  });

  const [loading, setLoading] = useState(false);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save preferences to localStorage or API
      localStorage.setItem('user-preferences', JSON.stringify(preferences));
      
      // Show success message
      alert('Preferências salvas com sucesso!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Erro ao salvar preferências. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Preferências
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Configure sua experiência personalizada
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil
              </CardTitle>
              <CardDescription>
                Configure como seu perfil aparece para outros usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nome de exibição
                </label>
                <input
                  type="text"
                  value={preferences.displayName}
                  onChange={(e) => handlePreferenceChange('displayName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
                  placeholder="Como você quer ser chamado"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Visibilidade do perfil
                </label>
                <select
                  value={preferences.profileVisibility}
                  onChange={(e) => handlePreferenceChange('profileVisibility', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
                >
                  <option value="private">Privado</option>
                  <option value="friends">Apenas amigos</option>
                  <option value="public">Público</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Escolha quando e como receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Lembretes de treino
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Receba lembretes para não perder seus treinos
                  </p>
                </div>
                <Switch
                  checked={preferences.workoutReminders}
                  onCheckedChange={(checked) => handlePreferenceChange('workoutReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Atualizações de progresso
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Notificações sobre marcos e conquistas
                  </p>
                </div>
                <Switch
                  checked={preferences.progressUpdates}
                  onCheckedChange={(checked) => handlePreferenceChange('progressUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Email
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Receber notificações por email
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Push notifications
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Notificações no dispositivo
                  </p>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tema
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Idioma
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Efeitos sonoros
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Sons de feedback durante exercícios
                  </p>
                </div>
                <Switch
                  checked={preferences.soundEffects}
                  onCheckedChange={(checked) => handlePreferenceChange('soundEffects', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Vibração
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Feedback tátil em dispositivos móveis
                  </p>
                </div>
                <Switch
                  checked={preferences.hapticFeedback}
                  onCheckedChange={(checked) => handlePreferenceChange('hapticFeedback', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacidade
              </CardTitle>
              <CardDescription>
                Controle seus dados e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Compartilhar progresso
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Permitir que outros vejam seu progresso
                  </p>
                </div>
                <Switch
                  checked={preferences.shareProgress}
                  onCheckedChange={(checked) => handlePreferenceChange('shareProgress', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Análise de dados
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Ajudar a melhorar o app com dados anônimos
                  </p>
                </div>
                <Switch
                  checked={preferences.allowAnalytics}
                  onCheckedChange={(checked) => handlePreferenceChange('allowAnalytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Economia de dados
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Reduzir qualidade de vídeos e imagens
                  </p>
                </div>
                <Switch
                  checked={preferences.dataSaving}
                  onCheckedChange={(checked) => handlePreferenceChange('dataSaving', checked)}
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                  Excluir todos os dados
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Save Button (Mobile) */}
      <div className="lg:hidden">
        <Button onClick={handleSave} disabled={loading} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Preferências'}
        </Button>
      </div>
    </div>
  );
};

export default PreferencesSetup;
