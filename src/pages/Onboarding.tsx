import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, Target, User, Dumbbell, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    goals: [] as string[],
    fitnessLevel: '',
    timeAvailable: '',
    preferredActivities: [] as string[],
  });
  const navigate = useNavigate();

  const steps = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao HealthFlix!',
      subtitle: 'Vamos configurar sua jornada fitness personalizada',
      icon: <User className="w-8 h-8" />,
    },
    {
      id: 'goals',
      title: 'Quais são seus objetivos?',
      subtitle: 'Selecione todos que se aplicam',
      icon: <Target className="w-8 h-8" />,
    },
    {
      id: 'fitness-level',
      title: 'Qual seu nível de condicionamento?',
      subtitle: 'Isso nos ajuda a personalizar seus treinos',
      icon: <Dumbbell className="w-8 h-8" />,
    },
    {
      id: 'time',
      title: 'Quanto tempo você tem disponível?',
      subtitle: 'Por dia para exercícios',
      icon: <Calendar className="w-8 h-8" />,
    },
    {
      id: 'complete',
      title: 'Tudo pronto!',
      subtitle: 'Sua jornada personalizada está configurada',
      icon: <CheckCircle className="w-8 h-8" />,
    },
  ];

  const goalOptions = [
    { id: 'weight-loss', label: 'Perder peso', emoji: '🔥' },
    { id: 'muscle-gain', label: 'Ganhar massa muscular', emoji: '💪' },
    { id: 'endurance', label: 'Melhorar resistência', emoji: '🏃' },
    { id: 'strength', label: 'Aumentar força', emoji: '🏋️' },
    { id: 'flexibility', label: 'Aumentar flexibilidade', emoji: '🧘' },
    { id: 'wellness', label: 'Bem-estar geral', emoji: '✨' },
  ];

  const fitnessLevels = [
    { id: 'beginner', label: 'Iniciante', description: 'Pouca ou nenhuma experiência' },
    { id: 'intermediate', label: 'Intermediário', description: 'Alguns meses de experiência' },
    { id: 'advanced', label: 'Avançado', description: 'Mais de 1 ano de experiência' },
  ];

  const timeOptions = [
    { id: '15-30', label: '15-30 minutos' },
    { id: '30-45', label: '30-45 minutos' },
    { id: '45-60', label: '45-60 minutos' },
    { id: '60+', label: 'Mais de 1 hora' },
  ];

  const handleGoalToggle = (goalId: string) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('onboarding-completed', 'true');
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'welcome': return true;
      case 'goals': return userData.goals.length > 0;
      case 'fitness-level': return userData.fitnessLevel !== '';
      case 'time': return userData.timeAvailable !== '';
      case 'complete': return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎯</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Vamos começar!
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Em apenas alguns passos, criaremos um plano fitness totalmente personalizado para você.
              </p>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {step.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goalOptions.map((goal) => (
                <motion.button
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userData.goals.includes(goal.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.emoji}</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {goal.label}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'fitness-level':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {step.subtitle}
              </p>
            </div>
            <div className="space-y-3">
              {fitnessLevels.map((level) => (
                <motion.button
                  key={level.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setUserData(prev => ({ ...prev, fitnessLevel: level.id }))}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    userData.fitnessLevel === level.id
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-slate-900 dark:text-white mb-1">
                    {level.label}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {level.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'time':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {step.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {timeOptions.map((time) => (
                <motion.button
                  key={time.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserData(prev => ({ ...prev, timeAvailable: time.id }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userData.timeAvailable === time.id
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-slate-900 dark:text-white">
                    {time.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Parabéns!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Seu perfil foi criado com sucesso. Agora você pode acessar treinos e planos
                personalizados baseados nas suas preferências.
              </p>
              <div className="bg-primary/10 rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-2">Próximos passos:</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 text-left space-y-1">
                  <li>✓ Explore os módulos fitness personalizados</li>
                  <li>✓ Acesse seus treinos recomendados</li>
                  <li>✓ Acompanhe seu progresso</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Passo {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
