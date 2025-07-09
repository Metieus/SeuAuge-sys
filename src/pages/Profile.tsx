import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  TrendingUp, 
  Award, 
  Heart, 
  Activity,
  Calendar,
  Target,
  Zap,
  ChevronRight,
  Settings,
  Bell,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PLANS } from '../data/plans';
import { updateUserProfile, getUserData } from '@/services/user';
import { updateUserPlan } from '../services/plan';
import { useProgressStore } from '../stores/progressStore';
import { getUserMetrics } from '../services/user';
import type { UserData } from '@/services/user';

const Profile: React.FC = () => {
  const { user, refreshPlan } = useAuth();
  const planName = PLANS.find((p) => p.id === (user?.plan ?? 'A'))?.name ?? 'Gratuito';
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
  });
  const [userData, setUserData] = useState<UserData | null>(null);
  const { metrics, setMetrics } = useProgressStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const saved = await getUserMetrics();
      if (saved) {
        setMetrics(saved);
      }
      const data = await getUserData(user.id);
      if (data) {
        setUserData(data);
        setFormData({ name: data.name ?? '', birthdate: data.birthdate ?? '' });
      }
    }
    load();
  }, [user, setMetrics]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida.');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    if (formData.name.trim().length < 2 || formData.name.trim().length > 50) {
      toast.error('Nome deve ter entre 2 e 50 caracteres');
      return;
    }
    const birth = new Date(formData.birthdate);
    const age = new Date().getFullYear() - birth.getFullYear();
    if (age > 100 || age < 16) {
      toast.error('Idade deve estar entre 16 e 100 anos.');
      return;
    }
    try {
      setSaving(true);
      await updateUserProfile({ name: formData.name, birthdate: formData.birthdate, file });
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      toast.error('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || '',
      birthdate: userData?.birthdate || '',
    });
    setFile(null);
    setPreview(null);
    setIsEditing(false);
  };

  const handleCancelSubscription = async () => {
    try {
      await updateUserPlan('A');
      await refreshPlan();
    } catch (err) {
      console.error('Erro ao cancelar assinatura', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Activity },
    { id: 'metrics', label: 'Métricas', icon: TrendingUp },
    { id: 'activity', label: 'Atividade', icon: Calendar },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const achievements = [
    { title: 'Primeira Semana', description: 'Completou 7 dias consecutivos', icon: '🏆', color: 'bg-yellow-500' },
    { title: 'Hidratação Master', description: 'Meta de água atingida 30 dias', icon: '💧', color: 'bg-blue-500' },
    { title: 'Força Total', description: 'Ganhou 5kg de massa muscular', icon: '💪', color: 'bg-red-500' },
    { title: 'Zen Master', description: 'Meditou por 100 horas', icon: '🧘', color: 'bg-purple-500' },
  ];

  const quickStats = [
    { label: 'Vídeos Assistidos', value: '47', change: '+12%', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Produtos Comprados', value: '12', change: '+3', icon: Award, color: 'text-blue-400' },
    { label: 'Favoritos', value: '23', change: '+5', icon: Heart, color: 'text-pink-400' },
    { label: 'Streak Atual', value: '15 dias', change: 'Novo recorde!', icon: Zap, color: 'text-yellow-400' },
  ];

  const bodyMetrics = [
    { label: 'Peso Corporal', value: metrics.totalWeight, unit: 'kg', trend: 'down' },
    { label: 'IMC', value: metrics.bmi, unit: '', trend: 'stable' },
    { label: 'Gordura Corporal', value: metrics.bodyFatPercent, unit: '%', trend: 'down' },
    { label: 'Massa Muscular', value: metrics.skeletalMuscleMass, unit: 'kg', trend: 'up' },
    { label: 'Água Corporal', value: metrics.totalBodyWater, unit: 'L', trend: 'stable' },
    { label: 'TMB', value: metrics.bmr, unit: 'kcal', trend: 'up' },
  ];

  const recentActivities = [
    { action: 'Assistiu', item: 'Yoga Matinal Energizante', time: '2 horas atrás', type: 'video' },
    { action: 'Comprou', item: 'Whey Protein Premium', time: '1 dia atrás', type: 'purchase' },
    { action: 'Adicionou aos favoritos', item: 'HIIT Cardio Explosivo', time: '2 dias atrás', type: 'favorite' },
    { action: 'Completou', item: 'Meditação para Alívio do Estresse', time: '3 dias atrás', type: 'complete' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video': return '📹';
      case 'purchase': return '🛒';
      case 'favorite': return '❤️';
      case 'complete': return '✅';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Header com animação */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Meu Perfil
            </h1>
            <p className="text-slate-400 mt-1">Gerencie suas informações e acompanhe seu progresso</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-105">
              <Bell className="w-5 h-5 text-slate-400" />
            </button>
            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-105">
              <Shield className="w-5 h-5 text-slate-400" />
            </button>
            {!isEditing ? (
              <>
                {user?.plan && user.plan !== 'A' && (
                  <button
                    onClick={handleCancelSubscription}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar Assinatura</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Salvando...' : 'Salvar'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card com design melhorado */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 animate-slide-up">
          <div className="h-32 bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            <div className="absolute top-4 right-4">
              <div className="inline-flex items-center px-4 py-2 bg-black/30 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
                <Award className="w-4 h-4 mr-2" />
                {planName}
              </div>
            </div>
          </div>
          
          <div className="-mt-16 p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar melhorado */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center ring-4 ring-white/10 shadow-2xl transition-all duration-300 group-hover:scale-105">
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              {/* Info do usuário */}
              <div className="flex-1 text-center lg:text-left">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{user?.name}</h2>
                      <p className="text-slate-400 text-lg">{userData?.name || 'Usuário'}</p>
                    </div>
                    
                    {/* Quick metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                      {[
                        { label: 'Peso', value: `${metrics.totalWeight}kg`, color: 'text-blue-400' },
                        { label: 'IMC', value: metrics.bmi, color: 'text-green-400' },
                        { label: 'Gordura', value: `${metrics.bodyFatPercent}%`, color: 'text-yellow-400' },
                        { label: 'Músculo', value: `${metrics.skeletalMuscleMass}kg`, color: 'text-purple-400' },
                      ].map((metric, index) => (
                        <div key={index} className="bg-slate-700/50 rounded-xl p-3 sm:p-4 text-center hover:bg-slate-700/70 transition-all duration-200">
                          <div className={`text-lg sm:text-xl font-bold ${metric.color}`}>{metric.value}</div>
                          <div className="text-slate-400 text-xs sm:text-sm">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-2xl">
                    {/* Informações básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Nome Completo</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            if (value.length <= 50) setFormData({ ...formData, name: value });
                          }}
                          className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Data de Nascimento</label>
                        <input
                          type="date"
                          value={formData.birthdate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const age = new Date().getFullYear() - new Date(e.target.value).getFullYear();
                            if (age <= 100) setFormData({ ...formData, birthdate: e.target.value });
                          }}
                          className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Idade</label>
                        <input
                          type="number"
                          value={formData.birthdate ? new Date().getFullYear() - new Date(formData.birthdate).getFullYear() : ''}
                          disabled
                          className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 opacity-70"
                        />
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs de navegação */}
        <div className="flex flex-wrap gap-2 bg-slate-800/50 p-2 rounded-2xl backdrop-blur-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo das tabs */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats melhorados */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-200`} />
                        <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-slate-400 text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </section>

              {/* Conquistas */}
              <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-yellow-400" />
                  Conquistas Recentes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-200 hover:scale-105 group cursor-pointer"
                    >
                      <div className={`w-12 h-12 ${achievement.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-200`}>
                        {achievement.icon}
                      </div>
                      <h4 className="font-semibold text-white mb-1">{achievement.title}</h4>
                      <p className="text-slate-400 text-sm">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'metrics' && (
            <section className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-emerald-400" />
                  Métricas Corporais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bodyMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">{metric.label}</span>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {metric.value} <span className="text-lg text-slate-400">{metric.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'activity' && (
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-400" />
                Atividade Recente
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <div className="text-white">
                          <span className="text-slate-300">{activity.action}</span>
                          <span className="text-primary ml-1 font-medium">{activity.item}</span>
                        </div>
                        <div className="text-slate-400 text-sm">{activity.time}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-slate-400" />
                Configurações
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Notificações', description: 'Gerencie suas preferências de notificação', icon: Bell },
                  { title: 'Privacidade', description: 'Controle suas configurações de privacidade', icon: Shield },
                  { title: 'Metas', description: 'Defina e acompanhe suas metas pessoais', icon: Target },
                  { title: 'Conta', description: 'Configurações da sua conta', icon: User },
                ].map((setting, index) => {
                  const Icon = setting.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <Icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-200" />
                        <div>
                          <div className="text-white font-medium">{setting.title}</div>
                          <div className="text-slate-400 text-sm">{setting.description}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

    </div>
  );
};

export default Profile;

