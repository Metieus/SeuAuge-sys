import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  TrendingDown, 
  Target, 
  Brain, 
  Activity, 
  Calendar,
  Zap,
  Heart,
  Scale,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Trophy,
  Sparkles,
  Flame,
  Award,
  BarChart3,
  TrendingUp,
  Rocket,
  X
} from 'lucide-react';

// Importar algoritmos avançados
import {
  GeneticFitnessProfile,
  SuccessPredictionAlgorithm,
  AdaptiveNutritionAlgorithm
} from '../../lib/fitness/advanced_fitness_algorithms.js';
import {
  gerarContextoExplicacao,
  gerarExplicacaoFinal,
} from '../../lib/fitness/explicacao';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { UserData, PlanoTreino, WeightLossResults } from '@/types/fitness';

interface ValidationErrors {
  [key: string]: string;
}

const EmagrecimentoAvancado: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<WeightLossResults | null>(null);
  const [explicacao, setExplicacao] = useState<{ paragrafo: string; bullets: string[] } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Algoritmos avançados
  const [successPredictor] = useState(new SuccessPredictionAlgorithm());

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Cores da paleta específica
  const colors = {
    primary: '#1ab894',    // Verde principal
    dark: '#111828',       // Azul escuro
    white: '#ffffff',      // Branco
    primaryLight: '#22d3aa', // Verde mais claro
    primaryDark: '#0f9d7a',  // Verde mais escuro
  };

  // Animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => setAnimationStep(1), 100);
    return () => clearTimeout(timer);
  }, []);

  // Validação de campos obrigatórios
  const validateStep = (stepNumber: number): boolean => {
    const errors: ValidationErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!userData.nome?.trim()) errors.nome = 'Nome é obrigatório';
        if (!userData.idade || userData.idade < 16 || userData.idade > 100) errors.idade = 'Idade deve estar entre 16 e 100 anos';
        if (!userData.sexo) errors.sexo = 'Sexo é obrigatório';
        if (!userData.altura || userData.altura < 100 || userData.altura > 250) errors.altura = 'Altura deve estar entre 100 e 250 cm';
        if (!userData.peso_atual || userData.peso_atual < 30 || userData.peso_atual > 300) errors.peso_atual = 'Peso atual deve estar entre 30 e 300 kg';
        if (!userData.peso_objetivo || userData.peso_objetivo < 30 || userData.peso_objetivo > 300) errors.peso_objetivo = 'Peso objetivo deve estar entre 30 e 300 kg';
        if (userData.peso_objetivo && userData.peso_atual && userData.peso_objetivo >= userData.peso_atual) {
          errors.peso_objetivo = 'Peso objetivo deve ser menor que o peso atual';
        }
        break;
        
      case 2:
        if (!userData.nivel_atividade) errors.nivel_atividade = 'Nível de atividade é obrigatório';
        if (!userData.experiencia_exercicio) errors.experiencia_exercicio = 'Experiência com exercícios é obrigatória';
        if (!userData.confianca_exercicio || userData.confianca_exercicio < 1 || userData.confianca_exercicio > 10) {
          errors.confianca_exercicio = 'Confiança deve estar entre 1 e 10';
        }
        break;
        
      case 3:
        if (!userData.prazo || userData.prazo < 1 || userData.prazo > 104) errors.prazo = 'Prazo deve estar entre 1 e 104 semanas';
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Cálculos avançados com elementos únicos
  const calculateAdvancedMetrics = (data: UserData): WeightLossResults => {
    // 1. Métricas básicas
    const altura_m = data.altura / 100;
    const imc = data.peso_atual / (altura_m * altura_m);
    
    let classificacao_imc = '';
    if (imc < 18.5) classificacao_imc = 'Abaixo do peso';
    else if (imc < 25) classificacao_imc = 'Peso normal';
    else if (imc < 30) classificacao_imc = 'Sobrepeso';
    else if (imc < 35) classificacao_imc = 'Obesidade grau I';
    else if (imc < 40) classificacao_imc = 'Obesidade grau II';
    else classificacao_imc = 'Obesidade grau III';

    // 2. TMB com fórmula Mifflin-St Jeor (mais precisa)
    let tmb: number;
    if (data.sexo === 'masculino') {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) + 5;
    } else {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) - 161;
    }

    // 3. Gasto energético com fatores de atividade refinados
    const fatores_atividade = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725
    };
    const gasto_energetico = tmb * fatores_atividade[data.nivel_atividade];

    // 4. Perfil genético simulado
    const geneticProfile = new GeneticFitnessProfile({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      weight: data.peso_atual,
      activityLevel: data.nivel_atividade
    });

    // 5. Predição de sucesso
    const probabilidade_sucesso = successPredictor.predictWeightLossSuccess({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      activityLevel: data.nivel_atividade,
      confidence: data.confianca_exercicio
    }, []);

    // 6. Déficit calórico personalizado baseado em múltiplos fatores
    let deficit_base = 500; // Déficit padrão para 0.5kg/semana
    
    // Ajustar baseado na predição de sucesso
    if (probabilidade_sucesso < 0.5) {
      deficit_base = 300; // Déficit menor para melhor aderência
    } else if (probabilidade_sucesso > 0.8) {
      deficit_base = 600; // Pode tolerar déficit maior
    }
    
    // Ajustar baseado no perfil genético
    if (geneticProfile.geneticProfile.dominantType === 'endurance') {
      deficit_base *= 1.1; // Melhor resposta a déficit calórico
    }
    
    // Ajustar baseado na idade
    if (data.idade > 40) {
      deficit_base *= 0.9; // Metabolismo mais lento
    }

    const calorias_diarias = Math.max(1200, gasto_energetico - deficit_base);
    const perda_semanal = deficit_base * 7 / 7700; // kg por semana
    const peso_a_perder = data.peso_atual - data.peso_objetivo;
    const tempo_estimado = peso_a_perder / perda_semanal;

    // 7. Identificar fatores de risco
    const fatores_risco: string[] = [];
    if (probabilidade_sucesso < 0.4) {
      fatores_risco.push('Baixa probabilidade de sucesso inicial');
    }
    if (data.idade > 50) {
      fatores_risco.push('Metabolismo mais lento devido à idade');
    }
    if (imc > 35) {
      fatores_risco.push('Obesidade severa - necessário acompanhamento médico');
    }
    if (deficit_base > 600) {
      fatores_risco.push('Déficit calórico alto - risco de perda muscular');
    }

    // 8. Recomendações personalizadas
    const recomendacoes: string[] = [];
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      recomendacoes.push('Foque em treinos de força para preservar massa muscular');
      recomendacoes.push('Inclua exercícios compostos e funcionais');
    } else {
      recomendacoes.push('Priorize exercícios cardiovasculares de baixa intensidade');
      recomendacoes.push('Aumente gradualmente a duração dos treinos');
    }
    
    if (probabilidade_sucesso < 0.6) {
      recomendacoes.push('Comece com metas pequenas e alcançáveis');
      recomendacoes.push('Considere acompanhamento profissional');
    }
    
    if (data.confianca_exercicio < 5) {
      recomendacoes.push('Inicie com exercícios em casa ou caminhadas');
      recomendacoes.push('Busque atividades que você goste');
    }

    // 9. Plano de treino personalizado
    const plano_treino = generatePersonalizedWorkout(data, geneticProfile);
    
    // 10. Plano nutricional adaptativo
    const nutritionAlgorithm = new AdaptiveNutritionAlgorithm(data, 'weight_loss');
    const plano_nutricional = generateNutritionPlan(data, calorias_diarias, nutritionAlgorithm);

    // 11. NOVOS ELEMENTOS ÚNICOS
    const score_motivacional = calculateMotivationalScore(data, probabilidade_sucesso);
    const badges_conquistadas = generateBadges(data, probabilidade_sucesso, imc);
    const nivel_usuario = calculateUserLevel(data, score_motivacional);
    const pontos_experiencia = calculateExperiencePoints(data, probabilidade_sucesso);

    return {
      imc: Math.round(imc * 10) / 10,
      classificacao_imc,
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gasto_energetico),
      calorias_diarias: Math.round(calorias_diarias),
      deficit_calorico: deficit_base,
      perda_semanal: Math.round(perda_semanal * 100) / 100,
      tempo_estimado: Math.round(tempo_estimado),
      probabilidade_sucesso: Math.round(probabilidade_sucesso * 100) / 100,
      perfil_genetico: geneticProfile.geneticProfile,
      fatores_risco,
      recomendacoes_personalizadas: recomendacoes,
      plano_treino,
      plano_nutricional,
      cronograma_adaptativo: generateAdaptiveSchedule(data),
      score_motivacional,
      badges_conquistadas,
      nivel_usuario,
      pontos_experiencia
    };
  };

  // Funções para elementos únicos
  const calculateMotivationalScore = (data: UserData, probabilidade: number): number => {
    let score = 50; // Base
    score += data.confianca_exercicio * 5; // Confiança
    score += probabilidade * 30; // Probabilidade de sucesso
    if (data.experiencia_exercicio === 'avancado') score += 15;
    if (data.nivel_atividade !== 'sedentario') score += 10;
    return Math.min(100, Math.round(score));
  };

  const generateBadges = (data: UserData, probabilidade: number, imc: number): string[] => {
    const badges: string[] = [];
    if (probabilidade > 0.8) badges.push('🏆 Alto Potencial');
    if (data.confianca_exercicio >= 8) badges.push('💪 Confiante');
    if (data.experiencia_exercicio === 'avancado') badges.push('⭐ Experiente');
    if (imc < 25) badges.push('🎯 Peso Ideal');
    if (data.nivel_atividade === 'intenso') badges.push('🔥 Atlético');
    badges.push('🚀 Iniciante Motivado');
    return badges;
  };

  const calculateUserLevel = (data: UserData, score: number): string => {
    if (score >= 90) return 'Elite Fitness';
    if (score >= 75) return 'Avançado';
    if (score >= 60) return 'Intermediário';
    if (score >= 45) return 'Iniciante Plus';
    return 'Iniciante';
  };

  const calculateExperiencePoints = (data: UserData, probabilidade: number): number => {
    let pontos = 100; // Base
    pontos += data.confianca_exercicio * 10;
    pontos += probabilidade * 50;
    if (data.experiencia_exercicio === 'avancado') pontos += 100;
    return Math.round(pontos);
  };

  const generatePersonalizedWorkout = (data: UserData, geneticProfile: any): PlanoTreino => {
    const isBeginnerFriendly = data.experiencia_exercicio === 'iniciante' || data.confianca_exercicio < 5;

    const baseWorkout: PlanoTreino = {
      frequencia_semanal: isBeginnerFriendly ? 3 : 4,
      duracao_sessao: isBeginnerFriendly ? 30 : 45,
      tipo_principal: geneticProfile.geneticProfile.dominantType === 'power' ? 'Força + Cardio' : 'Cardio + Força',
      exercicios: [],
      intensidade: isBeginnerFriendly ? 'Baixa-Moderada' : 'Moderada-Alta'
    };

    if (geneticProfile.geneticProfile.dominantType === 'power') {
      baseWorkout.exercicios = [
        { nome: 'Agachamento', series: 3, repeticoes: '8-12', descanso: '90s', dificuldade: 'Moderada' },
        { nome: 'Flexão de braço', series: 3, repeticoes: '6-10', descanso: '90s', dificuldade: 'Moderada' },
        { nome: 'Prancha', series: 3, repeticoes: '30-60s', descanso: '60s', dificuldade: 'Baixa' },
        { nome: 'Caminhada rápida', series: 1, repeticoes: '20-30min', descanso: '-', dificuldade: 'Baixa' }
      ];
    } else {
      baseWorkout.exercicios = [
        { nome: 'Caminhada/Corrida leve', series: 1, repeticoes: '30-45min', descanso: '-', dificuldade: 'Baixa' },
        { nome: 'Agachamento', series: 2, repeticoes: '12-15', descanso: '60s', dificuldade: 'Baixa' },
        { nome: 'Flexão adaptada', series: 2, repeticoes: '8-12', descanso: '60s', dificuldade: 'Baixa' },
        { nome: 'Alongamento', series: 1, repeticoes: '10min', descanso: '-', dificuldade: 'Muito Baixa' }
      ];
    }

    return baseWorkout;
  };

  const generateNutritionPlan = (data: UserData, calorias: number, algorithm: any) => {
    // Distribuição de macronutrientes para emagrecimento
    const proteina_percent = 0.30; // 30% proteína para preservar massa muscular
    const carbo_percent = 0.35;    // 35% carboidratos
    const gordura_percent = 0.35;  // 35% gorduras

    const proteina_g = Math.round((calorias * proteina_percent) / 4);
    const carbo_g = Math.round((calorias * carbo_percent) / 4);
    const gordura_g = Math.round((calorias * gordura_percent) / 9);

    const mealTiming = algorithm.generateMealTiming(['07:00', '18:00']); // Exemplo de horários

    return {
      calorias_diarias: calorias,
      macronutrientes: {
        proteina: proteina_g,
        carboidratos: carbo_g,
        gorduras: gordura_g
      },
      distribuicao_refeicoes: mealTiming.mainMeals,
      dicas_personalizadas: [
        'Priorize proteínas magras em todas as refeições',
        'Consuma carboidratos complexos preferencialmente',
        'Inclua gorduras boas como abacate e oleaginosas',
        'Beba pelo menos 2L de água por dia'
      ],
      qualidade_nutricional: 'Excelente',
      flexibilidade: 'Alta'
    };
  };

  const generateAdaptiveSchedule = (data: UserData) => {
    return {
      semana_1_2: 'Adaptação - foque na consistência',
      semana_3_4: 'Intensificação gradual',
      semana_5_8: 'Otimização baseada em resultados',
      avaliacoes: 'A cada 2 semanas',
      ajustes_automaticos: 'Baseados no progresso real'
    };
  };

  const handleNext = () => {
    if (step < totalSteps) {
      if (validateStep(step)) {
        setStep(step + 1);
        setValidationErrors({});
      }
    } else {
      if (validateStep(step)) {
        handleCalculate();
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setValidationErrors({});
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);

    // Simular processamento complexo com animações
    await new Promise(resolve => setTimeout(resolve, 3000));

    const calculatedResults = calculateAdvancedMetrics(userData as UserData);
    setResults(calculatedResults);
    const contexto = gerarContextoExplicacao(calculatedResults, userData as UserData);
    const explicacaoGerada = await gerarExplicacaoFinal(contexto);
    setExplicacao(explicacaoGerada);

    await setDoc(doc(db, 'explicacoes', 'usuario_exemplo'), {
      userId: 'usuario_exemplo',
      tipo: 'emagrecimento',
      timestamp: Date.now(),
      paragrafo: explicacaoGerada.paragrafo,
      bullets: explicacaoGerada.bullets,
    });

    setIsCalculating(false);
  };

  const renderValidationError = (field: string) => {
    if (validationErrors[field]) {
      return (
        <div className="flex items-center gap-2 mt-1 text-red-400 text-sm">
          <X className="h-4 w-4" />
          {validationErrors[field]}
        </div>
      );
    }
    return null;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className={`w-full max-w-7xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-3xl">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Scale className="h-8 w-8" />
                </div>
                Dados Pessoais
              </CardTitle>
              <CardDescription className="text-white/90">
                Informações básicas para cálculos personalizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="nome" className="text-gray-700 font-medium text-sm">Nome *</Label>
                  <Input
                    id="nome"
                    value={userData.nome || ''}
                    onChange={(e) => setUserData({...userData, nome: e.target.value})}
                    placeholder="Seu nome"
                    className={`border-2 transition-colors rounded-xl h-14 text-base ${
                      validationErrors.nome ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('nome')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="idade" className="text-gray-700 font-medium text-sm">Idade *</Label>
                  <Input
                    id="idade"
                    type="number"
                    value={userData.idade || ''}
                    onChange={(e) => setUserData({...userData, idade: parseInt(e.target.value)})}
                    placeholder="25"
                    className={`border-2 transition-colors rounded-xl h-14 text-base ${
                      validationErrors.idade ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('idade')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="sexo" className="text-gray-700 font-medium text-sm">Sexo *</Label>
                  <Select onValueChange={(value) => setUserData({...userData, sexo: value as 'masculino' | 'feminino'})}>
                    <SelectTrigger className={`border-2 transition-colors rounded-xl h-14 bg-white text-gray-900 font-medium shadow-sm ${
                      validationErrors.sexo ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-primary hover:border-gray-400'
                    }`}>
                      <SelectValue placeholder="Selecione seu sexo" className="text-gray-900 font-medium" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50">
                      <SelectItem value="masculino" className="hover:bg-blue-50 text-gray-900 font-medium text-base py-4 cursor-pointer">
                        👨 Masculino
                      </SelectItem>
                      <SelectItem value="feminino" className="hover:bg-pink-50 text-gray-900 font-medium text-base py-4 cursor-pointer">
                        👩 Feminino
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {renderValidationError('sexo')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="altura" className="text-gray-700 font-medium text-sm">Altura (cm) *</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={userData.altura || ''}
                    onChange={(e) => setUserData({...userData, altura: parseInt(e.target.value)})}
                    placeholder="175"
                    className={`border-2 transition-colors rounded-xl h-14 text-base ${
                      validationErrors.altura ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('altura')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="peso_atual" className="text-gray-700 font-medium text-sm">Peso Atual (kg) *</Label>
                  <Input
                    id="peso_atual"
                    type="number"
                    step="0.1"
                    value={userData.peso_atual || ''}
                    onChange={(e) => setUserData({...userData, peso_atual: parseFloat(e.target.value)})}
                    placeholder="70.5"
                    className={`border-2 transition-colors rounded-xl h-14 text-base ${
                      validationErrors.peso_atual ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('peso_atual')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="peso_objetivo" className="text-gray-700 font-medium text-sm">Peso Objetivo (kg) *</Label>
                  <Input
                    id="peso_objetivo"
                    type="number"
                    step="0.1"
                    value={userData.peso_objetivo || ''}
                    onChange={(e) => setUserData({...userData, peso_objetivo: parseFloat(e.target.value)})}
                    placeholder="65.0"
                    className={`border-2 transition-colors rounded-xl h-14 text-base ${
                      validationErrors.peso_objetivo ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('peso_objetivo')}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className={`w-full max-w-2xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="h-6 w-6" />
                </div>
                Perfil de Atividade
              </CardTitle>
              <CardDescription className="text-white/90">
                Informações sobre seu nível atual de atividade física
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <Label htmlFor="nivel_atividade" className="text-gray-700 font-medium">Nível de Atividade Atual *</Label>
                <Select onValueChange={(value) => setUserData({...userData, nivel_atividade: value as any})}>
                  <SelectTrigger className={`border-2 transition-colors rounded-xl h-12 ${
                    validationErrors.nivel_atividade ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentario">Sedentário (pouco ou nenhum exercício)</SelectItem>
                    <SelectItem value="leve">Leve (exercício leve 1-3 dias/semana)</SelectItem>
                    <SelectItem value="moderado">Moderado (exercício moderado 3-5 dias/semana)</SelectItem>
                    <SelectItem value="intenso">Intenso (exercício pesado 6-7 dias/semana)</SelectItem>
                  </SelectContent>
                </Select>
                {renderValidationError('nivel_atividade')}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experiencia" className="text-gray-700 font-medium">Experiência com Exercícios *</Label>
                <Select onValueChange={(value) => setUserData({...userData, experiencia_exercicio: value as any})}>
                  <SelectTrigger className={`border-2 transition-colors rounded-xl h-12 ${
                    validationErrors.experiencia_exercicio ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}>
                    <SelectValue placeholder="Selecione sua experiência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante (menos de 6 meses)</SelectItem>
                    <SelectItem value="intermediario">Intermediário (6 meses - 2 anos)</SelectItem>
                    <SelectItem value="avancado">Avançado (mais de 2 anos)</SelectItem>
                  </SelectContent>
                </Select>
                {renderValidationError('experiencia_exercicio')}
              </div>

              <div className="space-y-3">
                <Label htmlFor="confianca" className="text-gray-700 font-medium">Confiança para Exercitar-se (1-10) *</Label>
                <Input
                  id="confianca"
                  type="number"
                  min="1"
                  max="10"
                  value={userData.confianca_exercicio || ''}
                  onChange={(e) => setUserData({...userData, confianca_exercicio: parseInt(e.target.value)})}
                  placeholder="5"
                  className={`border-2 transition-colors rounded-xl h-12 ${
                    validationErrors.confianca_exercicio ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
                {renderValidationError('confianca_exercicio')}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                  <p className="text-sm" style={{ color: colors.primaryDark }}>
                    <Sparkles className="inline h-4 w-4 mr-1" />
                    1 = Muito inseguro, 10 = Muito confiante
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className={`w-full max-w-2xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="h-6 w-6" />
                </div>
                Objetivos e Prazos
              </CardTitle>
              <CardDescription className="text-white/90">
                Defina suas metas e expectativas realistas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-3">
                <Label htmlFor="prazo" className="text-gray-700 font-medium">Prazo para Atingir o Objetivo (semanas) *</Label>
                <Input
                  id="prazo"
                  type="number"
                  value={userData.prazo || ''}
                  onChange={(e) => setUserData({...userData, prazo: parseInt(e.target.value)})}
                  placeholder="12"
                  className={`border-2 transition-colors rounded-xl h-12 ${
                    validationErrors.prazo ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
                {renderValidationError('prazo')}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                  <p className="text-sm" style={{ color: colors.primaryDark }}>
                    <Trophy className="inline h-4 w-4 mr-1" />
                    Recomendado: 0.5-1kg por semana (perda saudável)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="historico" className="text-gray-700 font-medium">Histórico de Dietas Anteriores</Label>
                <Textarea
                  id="historico"
                  value={userData.historico_dietas || ''}
                  onChange={(e) => setUserData({...userData, historico_dietas: e.target.value})}
                  placeholder="Descreva brevemente suas experiências anteriores com dietas..."
                  rows={3}
                  className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl resize-none"
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restricoes" className="text-gray-700 font-medium">Restrições Alimentares</Label>
                <Textarea
                  id="restricoes"
                  value={userData.restricoes_alimentares || ''}
                  onChange={(e) => setUserData({...userData, restricoes_alimentares: e.target.value})}
                  placeholder="Ex: vegetariano, intolerância à lactose, alergias..."
                  rows={2}
                  className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl resize-none"
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className={`w-full max-w-2xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="h-6 w-6" />
                </div>
                Disponibilidade e Preferências
              </CardTitle>
              <CardDescription className="text-white/90">
                Informações para personalizar seu plano de treinos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-3">
                <Label className="text-gray-700 font-medium">Horários Disponíveis para Exercícios</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Manhã (6h-9h)', 'Meio-dia (11h-14h)', 'Tarde (14h-18h)', 'Noite (18h-22h)'].map((horario) => (
                    <label key={horario} className="flex items-center space-x-3 p-3 rounded-xl border cursor-pointer hover:border-primary transition-colors" style={{ backgroundColor: `${colors.primary}05`, borderColor: `${colors.primary}20` }}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded focus:ring-primary"
                        style={{ accentColor: colors.primary }}
                        onChange={(e) => {
                          const horarios = userData.horarios_disponiveis || [];
                          if (e.target.checked) {
                            setUserData({...userData, horarios_disponiveis: [...horarios, horario]});
                          } else {
                            setUserData({...userData, horarios_disponiveis: horarios.filter(h => h !== horario)});
                          }
                        }}
                      />
                      <span className="text-sm font-medium" style={{ color: colors.primaryDark }}>{horario}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700 font-medium">Preferências de Exercício</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Caminhada', 'Corrida', 'Musculação', 'Natação', 'Dança', 'Yoga', 'Ciclismo', 'Exercícios em casa'].map((exercicio) => (
                    <label key={exercicio} className="flex items-center space-x-3 p-3 rounded-xl border cursor-pointer hover:border-primary transition-colors" style={{ backgroundColor: `${colors.primary}05`, borderColor: `${colors.primary}20` }}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded focus:ring-primary"
                        style={{ accentColor: colors.primary }}
                        onChange={(e) => {
                          const preferencias = userData.preferencias_exercicio || [];
                          if (e.target.checked) {
                            setUserData({...userData, preferencias_exercicio: [...preferencias, exercicio]});
                          } else {
                            setUserData({...userData, preferencias_exercicio: preferencias.filter(p => p !== exercicio)});
                          }
                        }}
                      />
                      <span className="text-sm font-medium" style={{ color: colors.primaryDark }}>{exercicio}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className={`w-full max-w-2xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Heart className="h-6 w-6" />
                </div>
                Dados de Composição Corporal
              </CardTitle>
              <CardDescription className="text-white/90">
                Se você tem dados de bioimpedância, inclua aqui para maior precisão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <Alert className="border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                <Info className="h-4 w-4" style={{ color: colors.primary }} />
                <AlertDescription style={{ color: colors.primaryDark }}>
                  Estes dados são opcionais, mas melhoram significativamente a precisão dos cálculos.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="massa_gorda" className="text-gray-700 font-medium">Massa Gorda (%)</Label>
                  <Input
                    id="massa_gorda"
                    type="number"
                    step="0.1"
                    value={userData.massa_gorda || ''}
                    onChange={(e) => setUserData({...userData, massa_gorda: parseFloat(e.target.value)})}
                    placeholder="15.5"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="massa_magra" className="text-gray-700 font-medium">Massa Magra (kg)</Label>
                  <Input
                    id="massa_magra"
                    type="number"
                    step="0.1"
                    value={userData.massa_magra || ''}
                    onChange={(e) => setUserData({...userData, massa_magra: parseFloat(e.target.value)})}
                    placeholder="55.2"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="massa_muscular" className="text-gray-700 font-medium">Massa Muscular (kg)</Label>
                  <Input
                    id="massa_muscular"
                    type="number"
                    step="0.1"
                    value={userData.massa_muscular || ''}
                    onChange={(e) => setUserData({...userData, massa_muscular: parseFloat(e.target.value)})}
                    placeholder="45.8"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hidratacao" className="text-gray-700 font-medium">Hidratação (%)</Label>
                  <Input
                    id="hidratacao"
                    type="number"
                    step="0.1"
                    value={userData.hidratacao || ''}
                    onChange={(e) => setUserData({...userData, hidratacao: parseFloat(e.target.value)})}
                    placeholder="58.5"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
        {/* Elementos de fundo animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ backgroundColor: colors.primary }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" style={{ backgroundColor: colors.primaryLight }}></div>
          <div className="absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" style={{ backgroundColor: colors.primaryDark }}></div>
        </div>

        <div className="text-center space-y-6 z-10 backdrop-blur-sm bg-white/10 p-12 rounded-3xl border border-white/20">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/30 mx-auto" style={{ borderTopColor: colors.primary }}></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-white/20 mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Processando Análise Avançada</h2>
            <p className="text-xl text-gray-200">Aplicando algoritmos de machine learning...</p>
            
            <div className="space-y-3 mt-8">
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }}></div>
                <p className="text-sm">Calculando perfil genético simulado</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-500" style={{ backgroundColor: colors.primaryLight }}></div>
                <p className="text-sm">Analisando fatores preditivos</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-1000" style={{ backgroundColor: colors.primaryDark }}></div>
                <p className="text-sm">Gerando plano personalizado</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-1500" style={{ backgroundColor: colors.primary }}></div>
                <p className="text-sm">Criando elementos únicos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen p-6 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
        {/* Elementos de fundo animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{ backgroundColor: colors.primary }}></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" style={{ backgroundColor: colors.primaryLight }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" style={{ backgroundColor: colors.primaryDark }}></div>
        </div>

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          {/* Header com animação */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-2xl shadow-2xl" style={{ backgroundColor: colors.primary }}>
              <Sparkles className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Análise Completa de Emagrecimento</h1>
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-xl text-gray-300">Plano personalizado baseado em algoritmos científicos avançados</p>
          </div>

          {/* Score Motivacional e Badges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                    <Trophy className="h-6 w-6" />
                  </div>
                  Score Motivacional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white">
                      {results.score_motivacional}
                    </div>
                    <p className="text-xl text-gray-300 mt-2">Pontos de Motivação</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Nível do Usuário</span>
                      <Badge className="text-white" style={{ backgroundColor: colors.primary }}>
                        {results.nivel_usuario}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Pontos de Experiência</span>
                      <span className="font-bold" style={{ color: colors.primary }}>{results.pontos_experiencia} XP</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                    <Award className="h-6 w-6" />
                  </div>
                  Badges Conquistadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {results.badges_conquistadas.map((badge, index) => (
                    <div key={index} className="border rounded-xl p-4 text-center backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <div className="text-2xl mb-2">{badge.split(' ')[0]}</div>
                      <div className="text-sm font-medium" style={{ color: colors.primary }}>{badge.split(' ').slice(1).join(' ')}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Probabilidade de Sucesso */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                  <Brain className="h-6 w-6" />
                </div>
                Predição de Sucesso (IA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={colors.primary}
                          strokeWidth="2"
                          strokeDasharray={`${results.probabilidade_sucesso * 100}, 100`}
                          className="animate-pulse"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{(results.probabilidade_sucesso * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Probabilidade de Sucesso</h3>
                      <Badge 
                        className={`text-lg px-4 py-2 ${
                          results.probabilidade_sucesso > 0.7 
                            ? "text-white" 
                            : results.probabilidade_sucesso > 0.4 
                            ? "text-white" 
                            : "text-white"
                        }`}
                        style={{ 
                          backgroundColor: results.probabilidade_sucesso > 0.7 
                            ? colors.primary 
                            : results.probabilidade_sucesso > 0.4 
                            ? '#f59e0b' 
                            : '#ef4444'
                        }}
                      >
                        {results.probabilidade_sucesso > 0.7 ? "Alta" : results.probabilidade_sucesso > 0.4 ? "Moderada" : "Baixa"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Fatores de Atenção</h4>
                  {results.fatores_risco.length > 0 ? (
                    <div className="space-y-2">
                      {results.fatores_risco.map((fator, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-300">{fator}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 border rounded-lg backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" style={{ color: colors.primary }} />
                        <span className="text-sm" style={{ color: colors.primary }}>Nenhum fator de risco identificado</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}30` }}>
                    <Scale className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: colors.primary }}>IMC</span>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{results.imc}</p>
                <p className="text-sm" style={{ color: colors.primary }}>{results.classificacao_imc}</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}30` }}>
                    <Zap className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: colors.primary }}>TMB</span>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{results.tmb}</p>
                <p className="text-sm" style={{ color: colors.primary }}>kcal/dia</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}30` }}>
                    <Target className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: colors.primary }}>Meta Calórica</span>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{results.calorias_diarias}</p>
                <p className="text-sm" style={{ color: colors.primary }}>kcal/dia</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}30` }}>
                    <TrendingDown className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: colors.primary }}>Perda Semanal</span>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{results.perda_semanal}kg</p>
                <p className="text-sm" style={{ color: colors.primary }}>{results.tempo_estimado} semanas</p>
              </CardContent>
            </Card>
          </div>

          {/* Perfil Genético */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                  <Activity className="h-6 w-6" />
                </div>
                Perfil Genético Simulado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="p-6 border rounded-2xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                    <p className="text-sm mb-2" style={{ color: colors.primary }}>Tipo Dominante</p>
                    <Badge className="text-white text-lg px-4 py-2" style={{ backgroundColor: colors.primary }}>
                      {results.perfil_genetico.dominantType === 'power' ? 'Força/Potência' : 'Resistência'}
                    </Badge>
                  </div>
                </div>
                <div className="text-center">
                  <div className="p-6 border rounded-2xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                    <p className="text-sm mb-2" style={{ color: colors.primary }}>Score Potência</p>
                    <p className="text-4xl font-bold text-white">{results.perfil_genetico.powerScore}/5</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="p-6 border rounded-2xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                    <p className="text-sm mb-2" style={{ color: colors.primary }}>Score Resistência</p>
                    <p className="text-4xl font-bold text-white">{results.perfil_genetico.enduranceScore}/5</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plano de Treino */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                  <Activity className="h-6 w-6" />
                </div>
                Plano de Treino Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Estrutura Semanal</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <Calendar className="h-5 w-5" style={{ color: colors.primary }} />
                      <span style={{ color: colors.primary }}>Frequência: {results.plano_treino.frequencia_semanal}x por semana</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <Clock className="h-5 w-5" style={{ color: colors.primary }} />
                      <span style={{ color: colors.primary }}>Duração: {results.plano_treino.duracao_sessao} minutos</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <Target className="h-5 w-5" style={{ color: colors.primary }} />
                      <span style={{ color: colors.primary }}>Foco: {results.plano_treino.tipo_principal}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <Flame className="h-5 w-5" style={{ color: colors.primary }} />
                      <span style={{ color: colors.primary }}>Intensidade: {results.plano_treino.intensidade}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Exercícios Principais</h4>
                  <div className="space-y-3">
                    {results.plano_treino.exercicios.map((exercicio: any, index: number) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-xl backdrop-blur-sm hover:border-gray-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-white text-lg">{exercicio.nome}</span>
                          <Badge className={`${
                            exercicio.dificuldade === 'Muito Baixa' ? 'bg-green-500' :
                            exercicio.dificuldade === 'Baixa' ? 'bg-yellow-500' :
                            exercicio.dificuldade === 'Moderada' ? 'bg-orange-500' : 'bg-red-500'
                          }`}>
                            {exercicio.dificuldade}
                          </Badge>
                        </div>
                        <div className="text-gray-300 text-sm">
                          <span className="font-medium">{exercicio.series}x{exercicio.repeticoes}</span>
                          {exercicio.descanso !== '-' && <span className="ml-2">• Descanso: {exercicio.descanso}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plano Nutricional */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                  <Heart className="h-6 w-6" />
                </div>
                Plano Nutricional Adaptativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Macronutrientes Diários</h4>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium" style={{ color: colors.primary }}>Proteínas:</span>
                        <span className="font-bold text-white text-xl">{results.plano_nutricional.macronutrientes.proteina}g</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium" style={{ color: colors.primary }}>Carboidratos:</span>
                        <span className="font-bold text-white text-xl">{results.plano_nutricional.macronutrientes.carboidratos}g</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium" style={{ color: colors.primary }}>Gorduras:</span>
                        <span className="font-bold text-white text-xl">{results.plano_nutricional.macronutrientes.gorduras}g</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <p className="text-sm" style={{ color: colors.primary }}>Qualidade</p>
                      <p className="text-white font-bold">{results.plano_nutricional.qualidade_nutricional}</p>
                    </div>
                    <div className="text-center p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <p className="text-sm" style={{ color: colors.primary }}>Flexibilidade</p>
                      <p className="text-white font-bold">{results.plano_nutricional.flexibilidade}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Dicas Personalizadas</h4>
                  <div className="space-y-3">
                    {results.plano_nutricional.dicas_personalizadas.map((dica: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 border rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                        <span style={{ color: colors.primary }}>{dica}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendações Personalizadas */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                  <Rocket className="h-6 w-6" />
                </div>
                Recomendações Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.recomendacoes_personalizadas.map((recomendacao, index) => (
                  <div key={index} className="group p-6 border rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg group-hover:bg-opacity-50 transition-colors" style={{ backgroundColor: `${colors.primary}30` }}>
                        <CheckCircle className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <span className="leading-relaxed" style={{ color: colors.primary }}>{recomendacao}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cronograma Adaptativo */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                  <Calendar className="h-6 w-6" />
                </div>
                Cronograma Adaptativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 border rounded-2xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg" style={{ color: colors.primary }}>Semanas 1-2:</span>
                    <span style={{ color: colors.primary }}>{results.cronograma_adaptativo.semana_1_2}</span>
                  </div>
                </div>
                <div className="p-6 border rounded-2xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg" style={{ color: colors.primary }}>Semanas 3-4:</span>
                    <span style={{ color: colors.primary }}>{results.cronograma_adaptativo.semana_3_4}</span>
                  </div>
                </div>
                <div className="p-6 border rounded-2xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg" style={{ color: colors.primary }}>Semanas 5-8:</span>
                    <span style={{ color: colors.primary }}>{results.cronograma_adaptativo.semana_5_8}</span>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>

        {explicacao && (
          <Card>
            <CardHeader>
              <CardTitle>📖 Entenda seu Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-800 whitespace-pre-line">{explicacao.paragrafo}</p>
              <ul className="list-disc pl-5 space-y-2">
                {explicacao.bullets.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-6 justify-center pt-8">
            <Button
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
              variant="default"
              size="default"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Imprimir Plano
            </Button>
            <Button
              onClick={() => navigate('/progress')}
              className="text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: colors.primary }}
              variant="default"
              size="default"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Iniciar Acompanhamento
            </Button>
            <Button
              onClick={() => {
                setResults(null);
                setStep(1);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
              variant="default"
              size="default"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Nova Análise
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
      {/* Elementos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{ backgroundColor: colors.primary }}></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" style={{ backgroundColor: colors.primaryLight }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" style={{ backgroundColor: colors.primaryDark }}></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header com animação */}
        <div className={`text-center space-y-4 transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-lg" style={{ backgroundColor: colors.primary }}>
            <Sparkles className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Emagrecimento Inteligente</h1>
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="text-xl text-gray-200">Análise avançada com algoritmos de machine learning</p>
        </div>

        {/* Progress Bar com design moderno */}
        <div className={`w-full max-w-3xl mx-auto transition-all duration-700 delay-300 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex justify-between text-sm text-gray-200 mb-4">
            <span className="font-medium">Passo {step} de {totalSteps}</span>
            <span className="font-medium">{Math.round(progress)}% completo</span>
          </div>
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full overflow-hidden"
            />
            <div className="absolute inset-0 rounded-full opacity-80" 
                 style={{width: `${progress}%`, backgroundColor: colors.primary}}></div>
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {Array.from({length: totalSteps}, (_, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i + 1 <= step 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-300 border border-white/30'
              }`} style={{ backgroundColor: i + 1 <= step ? colors.primary : 'transparent' }}>
                {i + 1 <= step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex justify-center">
          {renderStep()}
        </div>

        {/* Navigation Buttons com design moderno e melhor organização */}
        <div className={`flex justify-center items-center gap-8 mt-12 transition-all duration-700 delay-500 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {step > 1 && (
            <Button
              onClick={handlePrevious}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold backdrop-blur-sm hover:scale-105 transition-all duration-300"
              variant="default"
              size="default"
            >
              ← Anterior
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="text-white px-12 py-6 rounded-2xl text-xl font-semibold shadow-2xl hover:scale-105 transition-all duration-300 min-w-[180px]"
            style={{ backgroundColor: colors.primary }}
            variant="default"
            size="default"
          >
            {step === totalSteps ? (
              <>
                <Rocket className="mr-3 h-6 w-6" />
                Calcular Plano
              </>
            ) : (
              <>
                Próximo →
              </>
            )}
          </Button>
        </div>

        {/* Mostrar erros de validação se houver */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="fixed bottom-4 right-4 max-w-md">
            <Alert className="bg-red-500/20 border-red-500/30 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                Por favor, corrija os campos obrigatórios destacados em vermelho.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

    </div>
  );
};

export default EmagrecimentoAvancado;

