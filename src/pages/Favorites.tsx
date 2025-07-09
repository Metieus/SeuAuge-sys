import React, { useState } from 'react';
import { Heart, Play, ShoppingBag } from 'lucide-react';
import VideoCard from '../components/Videos/VideoCard';
import ProductCard from '../components/Products/ProductCard';
import { useFavoritesStore } from '../stores/favoritesStore';
import ComingSoon from '../components/Common/ComingSoon';
import { storeEnabled } from '../lib/config';

const Favorites: React.FC = () => {
  const { favoriteVideos, favoriteProducts } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<'videos' | 'products'>('videos');

  const tabs = [
    { id: 'videos', label: 'Vídeos', icon: Play, count: favoriteVideos.length },
    ...(storeEnabled
      ? [{ id: 'products', label: 'Produtos', icon: ShoppingBag, count: favoriteProducts.length }]
      : [])
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Heart className="w-8 h-8 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">Meus Favoritos</h1>
          <p className="text-slate-400">Seus vídeos e produtos salvos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 rounded-lg p-1 inline-flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'videos' | 'products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'videos' && (
          <div>
            {favoriteVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Nenhum vídeo favorito ainda</h3>
                <p className="text-slate-400 mb-4">Comece a explorar e adicione vídeos aos seus favoritos</p>
                <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Explorar Vídeos
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          storeEnabled ? (
            <div>
              {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Nenhum produto favorito ainda</h3>
                  <p className="text-slate-400 mb-4">Comece a comprar e adicione produtos aos seus favoritos</p>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Explorar Produtos
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ComingSoon title="Produtos em Breve" description="Você poderá favoritar produtos em breve." />
          )
        )}
      </div>
    </div>
  );
};
export default Favorites;