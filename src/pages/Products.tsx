import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock products data
  const products = [
    {
      id: 1,
      name: "Kit Proteína Whey Premium",
      description: "Proteína de alta qualidade para ganho de massa muscular",
      price: 129.90,
      originalPrice: 149.90,
      category: "suplementos",
      rating: 4.8,
      reviews: 124,
      image: "/api/placeholder/300/200",
      tags: ["Bestseller", "Desconto"],
      inStock: true
    },
    {
      id: 2,
      name: "Plano Alimentar Personalizado",
      description: "Dieta customizada baseada nos seus objetivos e preferências",
      price: 79.90,
      originalPrice: null,
      category: "planos",
      rating: 4.9,
      reviews: 89,
      image: "/api/placeholder/300/200",
      tags: ["Novo"],
      inStock: true
    },
    {
      id: 3,
      name: "Kit Treino em Casa",
      description: "Equipamentos básicos para treinar no conforto de casa",
      price: 199.90,
      originalPrice: 249.90,
      category: "equipamentos",
      rating: 4.7,
      reviews: 67,
      image: "/api/placeholder/300/200",
      tags: ["Promoção"],
      inStock: true
    },
    {
      id: 4,
      name: "Consultoria Fitness Individual",
      description: "Sessão individual com personal trainer certificado",
      price: 89.90,
      originalPrice: null,
      category: "servicos",
      rating: 5.0,
      reviews: 43,
      image: "/api/placeholder/300/200",
      tags: ["Premium"],
      inStock: false
    }
  ];

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'suplementos', label: 'Suplementos' },
    { value: 'planos', label: 'Planos' },
    { value: 'equipamentos', label: 'Equipamentos' },
    { value: 'servicos', label: 'Serviços' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'bestseller': return 'bg-yellow-100 text-yellow-800';
      case 'novo': return 'bg-green-100 text-green-800';
      case 'desconto': return 'bg-red-100 text-red-800';
      case 'promoção': return 'bg-orange-100 text-orange-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Produtos
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Encontre os melhores produtos para seus objetivos fitness
          </p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className={`text-xs ${getTagColor(tag)}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {/* Favorite */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-slate-600 hover:text-red-500"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                    <span className="text-white font-semibold">Fora de Estoque</span>
                  </div>
                )}
              </div>

              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? 'Comprar' : 'Indisponível'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}>
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Products;
