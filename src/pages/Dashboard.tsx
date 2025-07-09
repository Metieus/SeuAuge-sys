import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/Products/ProductCard';
import { mockProducts } from '../data/mockData';
import AppCard from '../components/Apps/AppCard';
import { apps } from '../data/apps';
import ComingSoon from '../components/Common/ComingSoon';
import { storeEnabled } from '../lib/config';

const Dashboard: React.FC = () => {
  

  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative z-10 px-8 py-12 lg:px-12 lg:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Jornada Completa de Bem-estar
            </h1>
            <p className="text-lg text-primary mb-6">
              Transforme sua saúde com nosso programa abrangente de 12 semanas com treinos especializados, orientação nutricional e práticas de mindfulness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Assistir Agora
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors">
                Adicionar à Lista
              </button>
            </div>
          </div>
        </div>
        
        {/* Hero image */}
        <img
          className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-30"
          src="https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Healthy lifestyle"
        />
      </div>


      {/* Aplicativos */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Aplicativos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      {/* Health Products Store */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Loja de Produtos de Saúde</h2>
          {storeEnabled && (
            <Link to="/store" className="text-primary hover:text-primary font-medium">
              Ver Todos
            </Link>
          )}
        </div>
        {storeEnabled ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <ComingSoon
            title="Em breve"
            description="Nossa loja de produtos estará disponível em breve."
          />
        )}
      </section>

    </div>
  );
};
export default Dashboard;