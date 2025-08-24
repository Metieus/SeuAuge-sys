import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Download, Filter, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock reports data
  const reports = [
    {
      id: 1,
      title: "Relatório de Progresso - Emagrecimento",
      description: "Análise completa do seu progresso de perda de peso nos últimos 30 dias",
      type: "fitness",
      date: "2024-01-15",
      status: "completed",
      metrics: {
        weightLoss: "-2.5kg",
        workouts: 24,
        avgCalories: 1850
      }
    },
    {
      id: 2,
      title: "Relatório Nutricional",
      description: "Acompanhamento da sua dieta e ingestão de macronutrientes",
      type: "nutrition",
      date: "2024-01-10",
      status: "completed",
      metrics: {
        avgProtein: "125g",
        avgCarbs: "180g",
        avgFat: "65g"
      }
    },
    {
      id: 3,
      title: "Análise de Performance Atlética",
      description: "Métricas de performance e evolução nos treinos",
      type: "performance",
      date: "2024-01-05",
      status: "completed",
      metrics: {
        strengthGain: "+15%",
        endurance: "+20%",
        consistency: "92%"
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-slate-600 bg-slate-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fitness': return <TrendingUp className="w-5 h-5" />;
      case 'nutrition': return <BarChart3 className="w-5 h-5" />;
      case 'performance': return <Calendar className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Relatórios
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Acompanhe seu progresso com relatórios detalhados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {[
                { value: '7d', label: 'Últimos 7 dias' },
                { value: '30d', label: 'Últimos 30 dias' },
                { value: '90d', label: 'Últimos 3 meses' },
                { value: '1y', label: 'Último ano' }
              ].map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Status:
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                      {report.status === 'completed' ? 'Concluído' : 
                       report.status === 'processing' ? 'Processando' : 'Pendente'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Data:
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(report.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Metrics Preview */}
                  {report.status === 'completed' && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-medium mb-2">Métricas Principais:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(report.metrics).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </Button>
                    {report.status === 'completed' && (
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {reports.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Nenhum relatório disponível
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                Complete alguns treinos e módulos fitness para gerar seus primeiros relatórios
              </p>
              <Button>
                Começar Agora
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;
