export interface ContextoExplicacao {
  nome: string;
  idade: number;
  sexo: 'masculino' | 'feminino';
  tipoGenetico: string;
  powerScore: number;
  enduranceScore: number;
  probabilidade: number;
  calorias: number;
  tipoTreino: string;
  frequencia: number;
  intensidade: string;
  experiencia: string;
  confianca: number;
  recomendacoes: string[];
}

import type { UserData, WeightLossResults } from '@/types/fitness';

export function gerarContextoExplicacao(results: WeightLossResults, user: UserData): ContextoExplicacao {
  return {
    nome: user.nome,
    idade: user.idade,
    sexo: user.sexo,
    tipoGenetico: results.perfil_genetico.dominantType,
    powerScore: results.perfil_genetico.powerScore,
    enduranceScore: results.perfil_genetico.enduranceScore,
    probabilidade: results.probabilidade_sucesso,
    calorias: results.calorias_diarias,
    tipoTreino: results.plano_treino.tipo_principal,
    frequencia: results.plano_treino.frequencia_semanal,
    intensidade: results.plano_treino.intensidade,
    experiencia: user.experiencia_exercicio,
    confianca: user.confianca_exercicio,
    recomendacoes: results.recomendacoes_personalizadas,
  };
}

export async function gerarExplicacaoFinal(contexto: ContextoExplicacao): Promise<{ paragrafo: string; bullets: string[] }> {
  const bullets = [
    `Perfil genético dominante: ${contexto.tipoGenetico} (power ${contexto.powerScore}/5, endurance ${contexto.enduranceScore}/5)`,
    `Treino principal: ${contexto.tipoTreino} – ${contexto.frequencia}x por semana`,
    `Intensidade ${contexto.intensidade} para nível ${contexto.experiencia}`,
    `Calorias diárias sugeridas: ${contexto.calorias}`,
    ...contexto.recomendacoes,
  ];

  const prompt = `Crie um parágrafo curto e motivacional explicando de forma amigável o plano de emagrecimento para ${contexto.nome} (${contexto.idade} anos, sexo ${contexto.sexo}). O treino é focado em ${contexto.tipoTreino} com intensidade ${contexto.intensidade} e frequência de ${contexto.frequencia} vezes por semana. As calorias recomendadas são ${contexto.calorias} por dia. Use tom encorajador e cite a probabilidade de sucesso de ${(contexto.probabilidade*100).toFixed(0)}%.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error('OpenAI request failed');

    const data = await response.json();
    const paragrafo = data.choices?.[0]?.message?.content?.trim() || '';

    return { paragrafo, bullets };
  } catch (err) {
    return {
      paragrafo:
        'Não foi possível gerar a mensagem motivacional no momento. Siga seu plano e mantenha o foco!',
      bullets,
    };
  }
}
