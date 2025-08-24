import React from 'react';
import { AlertTriangle, Database, CheckCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

const SupabaseStatus: React.FC = () => {
  if (isSupabaseConfigured) {
    return null; // Don't show anything when properly configured
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Modo Desenvolvimento
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Supabase não configurado. Algumas funcionalidades estão limitadas.
            </p>
            <button
              onClick={() => window.open('#open-mcp-popover', '_self')}
              className="text-xs text-amber-600 hover:text-amber-800 underline mt-1 font-medium"
            >
              Conectar Supabase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseStatus;
