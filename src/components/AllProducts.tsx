import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Heart, ShoppingCart, Package, Grid, List, Filter, SlidersHorizontal, Search, Eye, Crown, Sparkles, Gem, Zap, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import { buildImageUrl, apiCall, API_ENDPOINTS } from '../config/api';
import { addToCartUnified } from '../utils/cartUtils';
import { isInWishlist, addToWishlist, removeFromWishlist } from '../utils/wishlistUtils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number;
  mainImage: string;
  detailedImages: string[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

const AllProducts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  useEffect(() => {
    loadData();
    
    // Check for search params
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) {
      setSelectedCategory(parseInt(category));
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        apiCall(API_ENDPOINTS.PRODUCTS),
        apiCall(API_ENDPOINTS.CATEGORIES)
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (categoryId) {
      newSearchParams.set('category', categoryId.toString());
    } else {
      newSearchParams.delete('category');
    }
    
    setSearchParams(newSearchParams);
  };

  const handleQuantityDecrease = (productId: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1)
    }));
  };

  const handleQuantityIncrease = (productId: number, maxStock: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.min(maxStock, (prev[productId] || 1) + 1)
    }));
  };

  const handleAddToCart = async (product: Product) => {
    const quantity = quantities[product.id] || 1;
    try {
      await addToCartUnified(
        product.id,
        product.name,
        quantity
      );
      
      toast.success(`تم إضافة ${product.name} إلى السلة`, {
        position: "top-center",
        autoClose: 2000
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ في إضافة المنتج للسلة');
    }
  };

  const handleWishlistToggle = (product: Product) => {
    const inWishlist = isInWishlist(product.id);
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('تم إزالة المنتج من المفضلة');
    } else {
      addToWishlist({
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.mainImage
      });
      toast.success('تم إضافة المنتج للمفضلة');
    }
  };

  // Filter and sort products
  let filteredProducts = products;

  // Filter by category
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(product => product.categoryId === selectedCategory);
  }

  // Filter by search
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort products
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
      break;
    default:
      // newest - keep original order
      break;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ajwaak-light via-white to-ajwaak-cream flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-ajwaak-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-ajwaak-gold border-t-transparent rounded-full animate-ping mx-auto opacity-20"></div>
          </div>
          <p className="text-ajwaak-dark font-medium text-lg">جاري تحميل العطور الفاخرة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajwaak-light via-white to-ajwaak-cream pt-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8 p-6">
          
          {/* Premium Sidebar */}
          <aside className="w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 h-fit sticky top-44 overflow-hidden">
            
            {/* Premium Categories Section */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 ajwaak-gradient rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-ajwaak-primary arabic-title">أقسام العطور</h2>
                  <p className="text-sm text-gray-600 font-medium">اختر نوع العطر المطلوب</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`w-full text-right px-6 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between group ${
                    selectedCategory === null 
                      ? 'ajwaak-gradient text-white border-2 border-ajwaak-primary shadow-lg' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-ajwaak-cream hover:to-ajwaak-light border-2 border-transparent hover:border-ajwaak-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold">جميع العطور</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-right px-6 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between group ${
                      selectedCategory === category.id 
                        ? 'ajwaak-gradient text-white border-2 border-ajwaak-primary shadow-lg' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-ajwaak-cream hover:to-ajwaak-light border-2 border-transparent hover:border-ajwaak-primary/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Gem className="w-5 h-5" />
                      <span className="font-bold">{category.name}</span>
                    </div>
                    <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Filter Section */}
            <div className="border-t border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 ajwaak-gradient rounded-2xl flex items-center justify-center shadow-lg">
                  <SlidersHorizontal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-ajwaak-primary arabic-title">ترتيب العطور</h3>
                  <p className="text-sm text-gray-600 font-medium">اختر طريقة الترتيب</p>
                </div>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-6 py-4 border-2 border-ajwaak-primary/20 rounded-2xl focus:ring-4 focus:ring-ajwaak-gold/20 focus:border-ajwaak-primary bg-gradient-to-r from-white to-ajwaak-cream/30 text-ajwaak-dark font-bold shadow-lg transition-all duration-300"
              >
                <option value="newest">الأحدث</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="name">الاسم: أبجدياً</option>
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            
            {/* Premium Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-4xl font-black text-ajwaak-primary mb-2 arabic-title flex items-center gap-3">
                    <Crown className="w-8 h-8 text-ajwaak-gold" />
                    متجر أجواك للعطور
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    {selectedCategory 
                      ? `${categories.find(c => c.id === selectedCategory)?.name || 'عطور مختارة'} - ${filteredProducts.length} منتج`
                      : `جميع العطور - ${filteredProducts.length} منتج`
                    }
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        viewMode === 'grid' 
                          ? 'ajwaak-gradient text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-ajwaak-cream'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        viewMode === 'list' 
                          ? 'ajwaak-gradient text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-ajwaak-cream'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن العطور..."
                  className="w-full px-6 py-4 pr-14 border-2 border-ajwaak-primary/20 rounded-2xl focus:ring-4 focus:ring-ajwaak-gold/20 focus:border-ajwaak-primary bg-gradient-to-r from-white to-ajwaak-cream/30 text-lg font-medium placeholder-gray-400 shadow-lg transition-all duration-300"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-ajwaak-primary" />
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={`perfume-card group ${
                    viewMode === 'list' ? 'flex gap-6 p-6' : ''
                  }`}>
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : ''
                    } rounded-t-2xl`}>
                      <img
                        src={buildImageUrl(product.mainImage)}
                        alt={product.name}
                        className={`w-full ${
                          viewMode === 'list' ? 'h-full' : 'h-64'
                        } object-cover group-hover:scale-110 transition-transform duration-300`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-perfume.png';
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <button 
                          onClick={() => handleWishlistToggle(product)}
                          className={`text-white hover:text-ajwaak-gold transition-colors p-2 bg-black/20 rounded-full backdrop-blur-sm ${
                            isInWishlist(product.id) ? 'text-red-500' : ''
                          }`}
                        >
                          <Heart className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      {product.originalPrice && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                          خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <h4 className="text-xl font-bold text-ajwaak-dark mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current text-ajwaak-gold" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 mr-2">(4.5)</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-ajwaak-primary">
                            ر.س {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through mr-2">
                              ر.س {product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                        <button
                          onClick={() => handleQuantityDecrease(product.id)}
                          className="w-8 h-8 rounded-full border border-ajwaak-primary text-ajwaak-primary hover:bg-ajwaak-primary hover:text-white transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-ajwaak-dark px-3">
                          {quantities[product.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityIncrease(product.id, product.stock)}
                          className="w-8 h-8 rounded-full border border-ajwaak-primary text-ajwaak-primary hover:bg-ajwaak-primary hover:text-white transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="perfume-button w-full flex items-center justify-center"
                      >
                        <ShoppingCart className="w-5 h-5 ml-2" />
                        أضف للسلة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 ajwaak-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-ajwaak-primary mb-4 arabic-title">
                  لا توجد عطور
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  {searchQuery 
                    ? `لم نجد عطور تطابق "${searchQuery}"`
                    : selectedCategory 
                      ? 'لا توجد عطور في هذا القسم حالياً'
                      : 'لا توجد عطور متاحة حالياً'
                  }
                </p>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      handleCategoryChange(null);
                    }}
                    className="perfume-button inline-flex items-center px-8 py-4 text-lg font-semibold"
                  >
                    عرض جميع العطور
                    <Crown className="w-5 h-5 mr-2" />
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;