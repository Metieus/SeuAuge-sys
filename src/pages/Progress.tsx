import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useProgressStore } from '../stores/progressStore';
import Report from '../components/Report';

const Progress: React.FC = () => {
  const { weightLoss, metrics, reportData, setMetrics } = useProgressStore();
  const [showReport, setShowReport] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formMetrics, setFormMetrics] = useState(metrics);

  const handleSaveMetrics = () => {
    setMetrics(formMetrics);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormMetrics(metrics);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <TrendingUp className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Meu Progresso</h1>
      </div>

      {weightLoss && (
        <section className="bg-slate-800 rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white">Emagrecendo bem</h2>
          <p className="text-slate-400">
            Objetivo: {weightLoss.targetWeight}kg em {weightLoss.goalTime} semanas
          </p>
          <p className="text-slate-400">IMC atual: {weightLoss.imc.toFixed(1)} ({weightLoss.classificacaoImc})</p>
          <p className="text-slate-400">Peso ideal: {weightLoss.idealWeight.toFixed(1)}kg</p>
          <p className="text-slate-400">Déficit diário sugerido: {weightLoss.dailyDeficit} kcal</p>
          <button
            onClick={() => setShowReport(true)}
            className="mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
          >
            Ver minhas metas
          </button>
        </section>
      )}

      <section className="bg-slate-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Composição Corporal</h2>
          {!isEditing ? (
            <button
              onClick={() => {
                setFormMetrics(metrics);
                setIsEditing(true);
              }}
              className="text-sm text-primary hover:underline"
            >
              Editar
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSaveMetrics}
                className="px-3 py-1 rounded-md bg-primary text-white text-sm"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 rounded-md bg-slate-600 text-white text-sm"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Peso (kg)', key: 'totalWeight' },
              { label: 'IMC', key: 'bmi' },
              { label: 'Água Total (L)', key: 'totalBodyWater' },
              { label: 'Água Intracelular (L)', key: 'intracellularWater' },
              { label: 'Água Extracelular (L)', key: 'extracellularWater' },
              { label: 'Massa Magra (kg)', key: 'leanMass' },
              { label: 'Massa Muscular (kg)', key: 'skeletalMuscleMass' },
              { label: 'Massa de Gordura (kg)', key: 'bodyFatMass' },
              { label: '% Gordura Corporal', key: 'bodyFatPercent' },
              { label: 'Gordura Braços (%)', key: 'fatArms' },
              { label: 'Gordura Tronco (%)', key: 'fatTrunk' },
              { label: 'Gordura Pernas (%)', key: 'fatLegs' },
              { label: 'Massa Óssea (kg)', key: 'boneMass' },
              { label: 'TMB (kcal)', key: 'bmr' },
              { label: 'Relação ECW/ICW', key: 'ecwIcwRatio' },
              { label: 'Equilíbrio Muscular (%)', key: 'muscleSymmetry' },
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">{field.label}</label>
                <input
                  type="number"
                  value={formMetrics[field.key as keyof typeof formMetrics]}
                  onChange={(e) =>
                    setFormMetrics({ ...formMetrics, [field.key]: Number(e.target.value) })
                  }
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-300">
            <div>
              <span className="font-medium text-white">Peso Corporal:</span> {metrics.totalWeight}kg
            </div>
            <div>
              <span className="font-medium text-white">IMC:</span> {metrics.bmi}
            </div>
            <div>
              <span className="font-medium text-white">Água Corporal Total:</span> {metrics.totalBodyWater}L
            </div>
            <div>
              <span className="font-medium text-white">Água Intracelular:</span> {metrics.intracellularWater}L
            </div>
            <div>
              <span className="font-medium text-white">Água Extracelular:</span> {metrics.extracellularWater}L
            </div>
            <div>
              <span className="font-medium text-white">Massa Magra:</span> {metrics.leanMass}kg
            </div>
            <div>
              <span className="font-medium text-white">Massa Muscular Esquelética:</span> {metrics.skeletalMuscleMass}kg
            </div>
            <div>
              <span className="font-medium text-white">Massa de Gordura:</span> {metrics.bodyFatMass}kg
            </div>
            <div>
              <span className="font-medium text-white">% Gordura Corporal:</span> {metrics.bodyFatPercent}%
            </div>
            <div>
              <span className="font-medium text-white">Gordura Braços:</span> {metrics.fatArms}%
            </div>
            <div>
              <span className="font-medium text-white">Gordura Tronco:</span> {metrics.fatTrunk}%
            </div>
            <div>
              <span className="font-medium text-white">Gordura Pernas:</span> {metrics.fatLegs}%
            </div>
            <div>
              <span className="font-medium text-white">Massa Óssea:</span> {metrics.boneMass}kg
            </div>
            <div>
              <span className="font-medium text-white">TMB:</span> {weightLoss?.tmb ?? metrics.bmr} kcal
            </div>
            <div>
              <span className="font-medium text-white">Calorias Diárias:</span> {weightLoss?.caloriasDiarias ?? 0} kcal
            </div>
            <div>
              <span className="font-medium text-white">Relação ECW/ICW:</span> {metrics.ecwIcwRatio}
            </div>
            <div>
              <span className="font-medium text-white">Equilíbrio Muscular:</span> {metrics.muscleSymmetry}%
            </div>
          </div>
        )}
      </section>
      {showReport && weightLoss && (
        <div className="fixed inset-0 z-10 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-y-auto max-h-full">
            <Report data={reportData} onBack={() => setShowReport(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
