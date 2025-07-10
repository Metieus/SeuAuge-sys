export interface UserData {
  nome: string;
  idade: number;
  sexo: 'masculino' | 'feminino';
  altura: number;
  peso_atual: number;
  peso_objetivo: number;
  prazo: number;
  nivel_atividade: 'sedentario' | 'leve' | 'moderado' | 'intenso';
  experiencia_exercicio: 'iniciante' | 'intermediario' | 'avancado';
  confianca_exercicio: number; // 1-10
  historico_dietas?: string;
  restricoes_alimentares?: string;
  horarios_disponiveis?: string[];
  preferencias_exercicio?: string[];
  massa_gorda?: number;
  massa_magra?: number;
  massa_muscular?: number;
  hidratacao?: number;
  gordura_visceral?: number;
}

import type { Exercicio } from './exercicio';
export interface PlanoTreino {
  frequencia_semanal: number;
  duracao_sessao: number;
  tipo_principal: string;
  exercicios: Exercicio[];
  intensidade: string;
}

export interface WeightLossResults {
  imc: number;
  classificacao_imc: string;
  tmb: number;
  gasto_energetico: number;
  calorias_diarias: number;
  deficit_calorico: number;
  perda_semanal: number;
  tempo_estimado: number;
  probabilidade_sucesso: number;
  perfil_genetico: any;
  fatores_risco: string[];
  recomendacoes_personalizadas: string[];
  plano_treino: PlanoTreino;
  plano_nutricional: any;
  cronograma_adaptativo: any;
  score_motivacional: number;
  badges_conquistadas: string[];
  nivel_usuario: string;
  pontos_experiencia: number;
}
