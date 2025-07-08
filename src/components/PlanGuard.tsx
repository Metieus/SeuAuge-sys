// Componente que restringe acesso conforme o plano do usuário
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import usePlan from '../hooks/usePlan';

const BYPASS_PLAN_GUARD = import.meta.env.VITE_BYPASS_PLAN_GUARD === 'true';

interface PlanGuardProps {
  allowedPlans: string[];
  redirectTo?: string;
  children: React.ReactNode;
}

const PlanGuard: React.FC<PlanGuardProps> = ({
  allowedPlans,
  redirectTo = '/payment',
  children,
}) => {
  if (BYPASS_PLAN_GUARD) {
    return <>{children}</>;
  }

  const { plan, loading } = usePlan();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!plan || !allowedPlans.includes(plan)) {
    console.log('Acesso negado. Plano atual:', plan);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-950 text-center space-y-4">
        <p>
          Este conteúdo está disponível no{' '}
          {allowedPlans.length > 1 ? `Planos ${allowedPlans.join(' ou ')}` : `Plano ${allowedPlans[0]}`}
        </p>
        <Navigate to={redirectTo} replace state={{ from: location }} />
      </div>
    );
  }

  return <>{children}</>;
};

export default PlanGuard;

