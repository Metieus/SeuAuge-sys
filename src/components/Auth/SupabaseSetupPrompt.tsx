import React from 'react';
import { motion } from 'framer-motion';
import { Database, AlertCircle, ExternalLink, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface SupabaseSetupPromptProps {
  onClose?: () => void;
}

const SupabaseSetupPrompt: React.FC<SupabaseSetupPromptProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Configuração Necessária
            </CardTitle>
            <CardDescription>
              O Supabase precisa ser configurado para habilitar autenticação e funcionalidades completas
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Por que preciso do Supabase?
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Sistema de login e registro de usuários</li>
                    <li>• Armazenamento de dados personalizados</li>
                    <li>• Relatórios e progresso do usuário</li>
                    <li>• Funcionalidades administrativas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white">Como configurar:</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Conecte ao Supabase</p>
                    <p className="text-slate-600 dark:text-slate-400">Use o botão abaixo para conectar via MCP</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Configure suas credenciais</p>
                    <p className="text-slate-600 dark:text-slate-400">Adicione URL e chave do projeto</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Execute o schema SQL</p>
                    <p className="text-slate-600 dark:text-slate-400">Crie as tabelas necessárias no banco</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => window.open('#open-mcp-popover', '_self')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Database className="w-4 h-4 mr-2" />
                Conectar ao Supabase
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.open('https://supabase.com/docs/guides/getting-started', '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Documentação Supabase
              </Button>
              
              {onClose && (
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                  className="w-full"
                >
                  Continuar sem autenticação
                </Button>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
              <p>
                💡 <strong>Dica:</strong> Você pode usar o Supabase gratuitamente para desenvolvimento. 
                Até 500MB de dados e 2GB de largura de banda por mês.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SupabaseSetupPrompt;
