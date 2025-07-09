import React from 'react';
import { Clock } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = 'Em breve',
  description = 'Estamos trabalhando para disponibilizar esta funcionalidade em breve.'
}) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
    <Clock className="w-16 h-16 text-primary" />
    <h1 className="text-3xl font-bold text-white">{title}</h1>
    <p className="text-slate-400 max-w-md">{description}</p>
  </div>
);

export default ComingSoon;
