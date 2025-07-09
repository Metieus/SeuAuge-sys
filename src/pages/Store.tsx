import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/Products/ProductCard';
import ProductModal from '../components/Products/ProductModal';
import { mockProducts } from '../data/mockData';
import type { Product } from '../stores/cartStore';
import AppCard from '../components/Apps/AppCard';
import { apps } from '../data/apps';
import ComingSoon from '../components/Common/ComingSoon';
import { storeEnabled } from '../lib/config';

const Store: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'apps'>('products');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProduct, setSelectedProduct] = useState(null as Product | null);

  if (!storeEnabled) {
    return (
      <ComingSoon
        title="Loja em Breve"
        description="Nossos produtos e aplicativos estarão disponíveis em breve."
      />
    );
  }

  const categories = ['Todos', 'Suplementos', 'Equipamentos', 'Vitaminas', 'Bem-estar', 'Recuperação'];
  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'price-low', label: 'Preço: Menor para Maior' },
    { value: 'price-high', label: 'Preço: Maior para Menor' },
    { value: 'rating', label: 'Avaliação' }
  ];

  const filteredAndSortedProducts = mockProducts
    .filter(product => selectedCategory === 'Todos' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Loja</h1>
          <p className="text-slate-400">Produtos e aplicativos para seu bem-estar</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'apps'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Apps
          </button>
        </div>
      </div>

      {activeTab === 'products' && (
        <>
          {/* Filters */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-slate-400 mr-2" />
              <span className="font-medium text-white">Filtros e Ordenação</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>

          {/* Empty state */}
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">Nenhum produto encontrado com os filtros selecionados</div>
              <button
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSortBy('name');
                }}
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {selectedProduct && (
            <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
          )}
        </>
      )}

      {activeTab === 'apps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;