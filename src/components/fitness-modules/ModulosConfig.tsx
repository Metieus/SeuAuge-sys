import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingDown, 
  TrendingUp, 
  RotateCcw, 
  Zap,
  Target,
  Brain,
  Activity,
  Users,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

// Importar todos os módulos especializados
const EmagrecimentoAvancado = lazy(() => import('./EmagrecimentoAvancado'));
const GanhoMassaMuscular = lazy(() => import('./GanhoMassaMuscular'));
const RecomposicaoCorporal = lazy(() => import('./RecomposicaoCorporal'));
const PerformanceAtletica = lazy(() => import('./PerformanceAtletica'));

// Configuração dos módulos
export const MODULOS_CONFIG = {
  emagrecimento: {
    id: 'emagrecimento',
    nome: 'Emagrecimento Inteligente',
    descricao: 'Perda de peso sustentável com algoritmos adaptativos',
    icone: TrendingDown,
    cor: 'from-red-500 to-pink-600',
    corFundo: 'from-red-50 to-pink-100',
    componente: EmagrecimentoAvancado,
    rota: '/emagrecimento',
    nivel_dificuldade: 'Iniciante a Avançado',
    tempo_estimado: '8-24 semanas',
    caracteristicas: [
      'Algoritmos de predição de sucesso',
      'Personalização baseada em metabolismo',
      'Estratégias anti-platô',
      'Monitoramento de aderência',
      'Ajustes automáticos de calorias'
    ],
    ideal_para: [
      'Pessoas com sobrepeso ou obesidade',
      'Quem já tentou dietas sem sucesso',
      'Busca por emagrecimento sustentável',
      'Necessita de acompanhamento científico'
    ],
    resultados_esperados: {
      peso: '0.5-1kg por semana',
      gordura: '1-2% por mês',
      massa_muscular: 'Preservação total',
      energia: 'Melhora significativa'
    }
  },
  
  ganho_massa: {
    id: 'ganho_massa',
    nome: 'Ganho de Massa Muscular',
    descricao: 'Hipertrofia otimizada com ciência e personalização',
    icone: TrendingUp,
    cor: 'from-green-500 to-emerald-600',
    corFundo: 'from-green-50 to-emerald-100',
    componente: GanhoMassaMuscular,
    rota: '/ganho-massa',
    nivel_dificuldade: 'Iniciante a Profissional',
    tempo_estimado: '12-48 semanas',
    caracteristicas: [
      'Algoritmos de hipertrofia avançados',
      'Periodização automática',
      'Análise de potencial genético',
      'Otimização de volume e intensidade',
      'Nutrição para máximo anabolismo'
    ],
    ideal_para: [
      'Iniciantes no treino de força',
      'Atletas buscando massa muscular',
      'Pessoas com dificuldade para ganhar peso',
      'Quem quer otimizar hipertrofia'
    ],
    resultados_esperados: {
      massa_muscular: '0.5-2kg por mês',
      forca: '10-30% em 12 semanas',
      peso: '1-3kg por mês',
      definicao: 'Melhora gradual'
    }
  },
  
  recomposicao: {
    id: 'recomposicao',
    nome: 'Recomposição Corporal',
    descricao: 'Perca gordura e ganhe músculo simultaneamente',
    icone: RotateCcw,
    cor: 'from-purple-500 to-violet-600',
    corFundo: 'from-purple-50 to-violet-100',
    componente: RecomposicaoCorporal,
    rota: '/recomposicao',
    nivel_dificuldade: 'Intermediário a Avançado',
    tempo_estimado: '16-52 semanas',
    caracteristicas: [
      'Ciclagem calórica inteligente',
      'Treino híbrido força + cardio',
      'Timing nutricional otimizado',
      'Monitoramento de composição corporal',
      'Estratégias anti-catabolismo'
    ],
    ideal_para: [
      'Pessoas com experiência em treino',
      'Quem quer definição sem perder músculo',
      'Atletas em off-season',
      'Busca por transformação completa'
    ],
    resultados_esperados: {
      gordura: '-0.5-1% por mês',
      massa_muscular: '+0.2-0.5kg por mês',
      definicao: 'Melhora significativa',
      performance: 'Manutenção ou melhora'
    }
  },
  
  performance: {
    id: 'performance',
    nome: 'Performance Atlética',
    descricao: 'Otimização científica para máximo desempenho esportivo',
    icone: Zap,
    cor: 'from-orange-500 to-red-600',
    corFundo: 'from-orange-50 to-red-100',
    componente: PerformanceAtletica,
    rota: '/performance',
    nivel_dificuldade: 'Intermediário a Profissional',
    tempo_estimado: '12-52 semanas',
    caracteristicas: [
      'Periodização científica',
      'Análise de testes de performance',
      'Nutrição para atletas',
      'Protocolos de recuperação',
      'Monitoramento de overtraining'
    ],
    ideal_para: [
      'Atletas competitivos',
      'Praticantes de esportes específicos',
      'Quem busca performance máxima',
      'Preparação para competições'
    ],
    resultados_esperados: {
      forca: '5-25% melhora',
      potencia: '8-30% melhora',
      resistencia: '10-40% melhora',
      velocidade: '3-15% melhora'
    }
  }
};

// Componente de seleção de módulos
const ModuleSelector: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Sistema de Fitness Inteligente
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Módulos especializados com algoritmos científicos avançados para cada objetivo específico
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              IA Personalizada
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Baseado em Ciência
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Resultados Comprovados
            </Badge>
          </div>
          <nav className="flex justify-center gap-2 flex-wrap pt-4">
            <Link to="/emagrecimento" className="gradient-emagrecimento text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
              🔥 Emagrecimento
            </Link>
            <Link to="/ganho-massa" className="gradient-ganho-massa text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
              💪 Ganho de Massa
            </Link>
            <Link to="/recomposicao" className="gradient-recomposicao text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
              🔄 Recomposição
            </Link>
            <Link to="/performance" className="gradient-performance text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
              ⚡ Performance
            </Link>
          </nav>
        </div>

        {/* Módulos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(MODULOS_CONFIG).map((modulo) => {
            const IconeComponente = modulo.icone;
            
            return (
              <Card 
                key={modulo.id} 
                className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${modulo.corFundo}`}
              >
                {/* Gradient overlay */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${modulo.cor} opacity-10 rounded-full -mr-16 -mt-16`}></div>
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${modulo.cor} text-white`}>
                      <IconeComponente className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">
                        {modulo.nome}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {modulo.descricao}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Informações básicas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nível</p>
                      <p className="text-sm text-gray-600">{modulo.nivel_dificuldade}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Duração</p>
                      <p className="text-sm text-gray-600">{modulo.tempo_estimado}</p>
                    </div>
                  </div>

                  {/* Características principais */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Características</h4>
                    <div className="space-y-1">
                      {modulo.caracteristicas.slice(0, 3).map((caracteristica, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-700">{caracteristica}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ideal para */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Ideal Para</h4>
                    <div className="flex flex-wrap gap-2">
                      {modulo.ideal_para.slice(0, 2).map((perfil, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {perfil}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Resultados esperados */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Resultados Esperados</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(modulo.resultados_esperados).slice(0, 4).map(([metrica, valor]) => (
                        <div key={metrica} className="flex justify-between">
                          <span className="capitalize text-gray-600">{metrica.replace('_', ' ')}:</span>
                          <span className="font-medium text-gray-800">{valor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botão de ação */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${modulo.cor} hover:opacity-90 text-white`}
                    onClick={() => window.location.href = modulo.rota}
                  >
                    Iniciar {modulo.nome}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Seção de comparação */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center">Comparação de Módulos</CardTitle>
            <CardDescription className="text-center">
              Escolha o módulo ideal para seu objetivo atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Módulo</th>
                    <th className="text-center p-3">Dificuldade</th>
                    <th className="text-center p-3">Duração</th>
                    <th className="text-center p-3">Foco Principal</th>
                    <th className="text-center p-3">Melhor Para</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(MODULOS_CONFIG).map((modulo) => (
                    <tr key={modulo.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <modulo.icone className="h-4 w-4" />
                          <span className="font-medium">{modulo.nome}</span>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant="outline" className="text-xs">
                          {modulo.nivel_dificuldade.split(' ')[0]}
                        </Badge>
                      </td>
                      <td className="text-center p-3">{modulo.tempo_estimado}</td>
                      <td className="text-center p-3">
                        {modulo.id === 'emagrecimento' && 'Perda de Peso'}
                        {modulo.id === 'ganho_massa' && 'Ganho Muscular'}
                        {modulo.id === 'recomposicao' && 'Transformação'}
                        {modulo.id === 'performance' && 'Performance'}
                      </td>
                      <td className="text-center p-3">{modulo.ideal_para[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Seção de tecnologia */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-0">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Brain className="h-6 w-6" />
              Tecnologia Avançada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-semibold mb-2">Algoritmos Científicos</h4>
                  <p className="text-sm text-gray-600">
                    Baseados em pesquisas científicas recentes e machine learning
                  </p>
                </div>
              </div>
              <div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-semibold mb-2">Personalização Total</h4>
                  <p className="text-sm text-gray-600">
                    Adaptação baseada em genética, metabolismo e preferências
                  </p>
                </div>
              </div>
              <div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-semibold mb-2">Resultados Comprovados</h4>
                  <p className="text-sm text-gray-600">
                    Metodologias testadas e validadas por profissionais
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente principal com roteamento
const FitnessModulesApp: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<ModuleSelector />} />
        <Route
          path="/emagrecimento"
          element={
            <Suspense fallback={<div className="p-4">Carregando...</div>}>
              <EmagrecimentoAvancado />
            </Suspense>
          }
        />
        <Route
          path="/ganho-massa"
          element={
            <Suspense fallback={<div className="p-4">Carregando...</div>}>
              <GanhoMassaMuscular />
            </Suspense>
          }
        />
        <Route
          path="/recomposicao"
          element={
            <Suspense fallback={<div className="p-4">Carregando...</div>}>
              <RecomposicaoCorporal />
            </Suspense>
          }
        />
        <Route
          path="/performance"
          element={
            <Suspense fallback={<div className="p-4">Carregando...</div>}>
              <PerformanceAtletica />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
};

export default FitnessModulesApp;
export { ModuleSelector };

