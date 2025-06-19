import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Heart, ShoppingCart, Package, Truck, Shield, Award, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Eye, Users, Briefcase, Home, Accessibility, Sparkles, Crown, Gem, Zap, Plus, Minus, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { buildImageUrl, apiCall, API_ENDPOINTS, safeApiCall } from '../config/api';
import { addToCartUnified } from '../utils/cartUtils';
import { isInWishlist, addToWishlist, removeFromWishlist } from '../utils/wishlistUtils';
import WhatsAppButton from './WhatsAppButton';

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

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Use safe API call with better error handling
      const [productsResult, categoriesResult] = await Promise.all([
        safeApiCall<Product[]>(API_ENDPOINTS.PRODUCTS, {}, []),
        safeApiCall<Category[]>(API_ENDPOINTS.CATEGORIES, {}, [])
      ]);
      
      // Check if server is down
      if (productsResult.isServerDown || categoriesResult.isServerDown) {
        toast.error('🚫 الخادم غير متاح حالياً. يرجى التأكد من تشغيل الخادم والمحاولة مرة أخرى.');
        return;
      }
      
      // Check for errors
      if (productsResult.error) {
        toast.error(productsResult.error);
        console.error('Error loading products:', productsResult.error);
      }
      if (categoriesResult.error) {
        toast.error(categoriesResult.error);
        console.error('Error loading categories:', categoriesResult.error);
      }
      
      // Set data even if there are some non-critical errors
      setProducts(productsResult.data || []);
      setCategories(categoriesResult.data || []);
      
      console.log(`✅ HomePage: تم تحميل ${(productsResult.data || []).length} منتج و ${(categoriesResult.data || []).length} تصنيف`);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
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
      await addToCartUnified(product.id, product.name, quantity);
      toast.success(`تم إضافة ${product.name} إلى السلة`);
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

  const featuredProducts = products.slice(0, 8);
  const newProducts = products.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ajwaak-dark via-ajwaak-primary to-ajwaak-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-ajwaak-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-ajwaak-cream border-t-transparent rounded-full animate-ping mx-auto opacity-20"></div>
          </div>
          <p className="text-white font-medium text-lg">جاري تحميل عطور أجواك الفاخرة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      
      {/* Premium Hero Section - Similar to Reference Images */}
      <div className="relative min-h-screen bg-gradient-to-br from-ajwaak-dark via-ajwaak-primary to-ajwaak-secondary overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-ajwaak-gold/20 rounded-full animate-spin-slow"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-ajwaak-gold/10 rotate-45 animate-float"></div>
          <div className="absolute bottom-40 left-16 w-20 h-20 border border-ajwaak-cream/20 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-20 right-32 w-16 h-16 bg-ajwaak-secondary/20 rotate-12 animate-pulse"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Side - Text Content */}
              <div className="text-center lg:text-right space-y-8">
                
                {/* Brand Badge */}
                <div className="inline-flex items-center bg-ajwaak-gold/20 backdrop-blur-md border border-ajwaak-gold/30 rounded-full px-6 py-3 mb-6">
                  <Crown className="w-5 h-5 text-ajwaak-gold ml-2" />
                  <span className="text-white font-bold text-sm">AJWAAK LUXURY PERFUMES</span>
                  <Sparkles className="w-4 h-4 text-ajwaak-gold mr-2 animate-pulse" />
                </div>

                {/* Main Title */}
                <div className="space-y-6">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white arabic-title leading-tight">
                    <span className="block text-ajwaak-gold drop-shadow-2xl">أجــــواك</span>
                    <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-4 text-ajwaak-cream/90">عطور فاخرة من التراث</span>
                  </h1>
                  
                  <div className="flex justify-center lg:justify-start">
                    <div className="h-1 w-40 bg-gradient-to-r from-ajwaak-gold via-ajwaak-cream to-transparent rounded-full"></div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xl sm:text-2xl lg:text-3xl text-ajwaak-cream/80 font-light leading-relaxed max-w-3xl mx-auto lg:mx-0">
                  رحلة عبر عالم العطور الشرقية الأصيلة، حيث تلتقي الفخامة بالتراث العربي العريق في تناغم مثالي
                </p>

                {/* Premium Stats */}
                <div className="grid grid-cols-3 gap-8 py-12">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-ajwaak-gold mb-3 drop-shadow-lg">1000+</div>
                    <div className="text-ajwaak-cream/70 text-sm sm:text-base font-medium">عطر حصري</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-ajwaak-gold mb-3 drop-shadow-lg">100K+</div>
                    <div className="text-ajwaak-cream/70 text-sm sm:text-base font-medium">عميل راضٍ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-ajwaak-gold mb-3 drop-shadow-lg">25+</div>
                    <div className="text-ajwaak-cream/70 text-sm sm:text-base font-medium">عام تميز</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <Link
                    to="/products"
                    className="group relative overflow-hidden bg-ajwaak-gold hover:bg-ajwaak-gold/90 text-ajwaak-dark font-black px-10 py-5 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-ajwaak-gold/50"
                  >
                    <span className="relative z-10 flex items-center justify-center text-xl">
                      <Sparkles className="w-6 h-6 ml-3" />
                      اكتشف المجموعة
                      <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-ajwaak-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  
                  <Link
                    to="/categories"
                    className="group bg-transparent hover:bg-ajwaak-gold/10 backdrop-blur-md border-3 border-ajwaak-gold/50 hover:border-ajwaak-gold text-white font-bold px-10 py-5 rounded-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center text-xl">
                      <Gem className="w-6 h-6 ml-3" />
                      تصفح الأقسام
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right Side - Visual Content */}
              <div className="relative">
                {/* Main Perfume Bottle Display */}
                <div className="relative mx-auto w-96 h-[500px]">
                  
                  {/* Central Bottle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative group">
                      
                      {/* Bottle Glow Effect */}
                      <div className="absolute inset-0 bg-ajwaak-gold/30 blur-3xl rounded-full scale-150 animate-pulse group-hover:scale-175 transition-transform duration-500"></div>
                      
                      {/* Main Bottle Container */}
                      <div className="relative z-10 w-64 h-80 mx-auto transform group-hover:scale-110 transition-transform duration-500">
                        
                        {/* استخدام صورة حقيقية للعطر بدلاً من SVG */}
                        <div className="w-full h-full relative overflow-hidden rounded-3xl shadow-2xl">
                          <img 
                            src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop&crop=center"
                            alt="عطر أجواك الفاخر"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // في حالة فشل الصورة، استخدم gradient كبديل
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                parent.style.background = 'linear-gradient(135deg, #8B1538 0%, #D4AF37 50%, #A91D47 100%)';
                                parent.innerHTML += `
                                  <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="text-center text-white">
                                      <div class="text-6xl mb-4">🌹</div>
                                      <div class="text-2xl font-bold arabic-title">أجواك</div>
                                      <div class="text-lg">عطور فاخرة</div>
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                          />
                          
                          {/* Overlay للنص */}
                          <div className="absolute inset-0 bg-gradient-to-t from-ajwaak-dark/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white">
                            <div className="text-2xl font-black arabic-title mb-2">أجواك</div>
                            <div className="text-sm opacity-90">عطر الملوك</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Mini Bottles مع صور حقيقية */}
                  <div className="absolute inset-0">
                    {[
                      "https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=100&h=150&fit=crop",
                      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=100&h=150&fit=crop",
                      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=150&fit=crop",
                      "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=100&h=150&fit=crop"
                    ].map((imgSrc, i) => (
                      <div
                        key={i}
                        className="absolute w-16 h-20 rounded-lg overflow-hidden shadow-xl animate-float opacity-70 hover:opacity-100 transition-opacity border-2 border-ajwaak-gold/30"
                        style={{
                          left: `${15 + (i * 20)}%`,
                          top: `${20 + Math.sin(i * 0.8) * 40}%`,
                          animationDelay: `${i * 0.7}s`,
                          transform: `rotate(${i * 15}deg)`,
                        }}
                      >
                        <img 
                          src={imgSrc} 
                          alt={`عطر ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDEwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjOEIxNTM4Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI3NSIgZmlsbD0iI0Q0QUYzNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCI+8J+MuTwvdGV4dD4KPC9zdmc+';
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Sparkle Effects */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-ajwaak-gold rounded-full animate-ping"
                      style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    />
                  ))}
                </div>

                {/* Premium Features */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <div className="bg-ajwaak-gold/20 backdrop-blur-md border border-ajwaak-gold/30 rounded-full px-4 py-2">
                    <span className="text-ajwaak-gold text-sm font-bold">100% أصلي</span>
                  </div>
                  <div className="bg-ajwaak-gold/20 backdrop-blur-md border border-ajwaak-gold/30 rounded-full px-4 py-2">
                    <span className="text-ajwaak-gold text-sm font-bold">شحن مجاني</span>
                  </div>
                  <div className="bg-ajwaak-gold/20 backdrop-blur-md border border-ajwaak-gold/30 rounded-full px-4 py-2">
                    <span className="text-ajwaak-gold text-sm font-bold">ضمان الجودة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-ajwaak-gold/50 rounded-full flex justify-center">
            <div className="w-2 h-4 bg-ajwaak-gold/70 rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-ajwaak-cream/60 text-xs mt-2 text-center">اكتشف المزيد</p>
        </div>
      </div>

      {/* Rest of the content with updated styling */}
      <div className="bg-gradient-to-br from-ajwaak-light via-white to-ajwaak-cream">
        
        {/* Premium Installment Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-ajwaak-primary via-ajwaak-secondary to-ajwaak-primary py-6 shadow-2xl">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-center sm:text-right">
                <div className="text-6xl lg:text-8xl font-black text-white/20 select-none">0%</div>
                <div className="text-white">
                  <h3 className="text-2xl lg:text-4xl font-black mb-2 flex items-center gap-3">
                    <Gem className="w-8 h-8" />
                    قسط عطورك على 4 دفعات
                  </h3>
                  <p className="text-lg lg:text-2xl font-medium text-white/90">بدون فوائد - بحد أقصى 5000 ريال</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="group px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl shadow-xl text-lg hover:scale-105 transition-transform">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    تمارا
                  </span>
                </button>
                <button className="group px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-2xl shadow-xl text-lg hover:scale-105 transition-transform">
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    تابي
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* عطور وصلت حديثاً */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-6xl font-black text-ajwaak-primary mb-4 arabic-title">
                <span className="flex items-center gap-4 justify-center">
                  <Sparkles className="w-10 h-10 text-ajwaak-gold" />
                  عطور وصلت حديثاً
                  <Sparkles className="w-10 h-10 text-ajwaak-gold" />
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                اكتشف أحدث إضافاتنا من العطور الفاخرة والزيوت العطرية الطبيعية
              </p>
            </div>
            
            {newProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {newProducts.map((product, index) => (
                  <div key={product.id} className="perfume-card group">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <img
                        src={buildImageUrl(product.mainImage)}
                        alt={product.name}
                        className="w-full h-48 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          // استخدام صور جميلة للعطور من Unsplash كـ fallback
                          const perfumeImages = [
                            'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop',
                            'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=600&fit=crop',
                            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=600&fit=crop',
                            'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop',
                            'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400&h=600&fit=crop',
                            'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=600&fit=crop'
                          ];
                          (e.target as HTMLImageElement).src = perfumeImages[index % perfumeImages.length];
                        }}
                      />
                      <div className="absolute top-3 right-3">
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
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                          خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-ajwaak-dark mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current text-ajwaak-gold" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 mr-2">(4.8)</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xl font-bold text-ajwaak-primary">
                            ر.س {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through mr-2">
                              ر.س {product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                        <button
                          onClick={() => handleQuantityDecrease(product.id)}
                          className="w-8 h-8 rounded-full border-2 border-ajwaak-primary text-ajwaak-primary hover:bg-ajwaak-primary hover:text-white transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-ajwaak-dark px-3 text-lg">
                          {quantities[product.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityIncrease(product.id, product.stock)}
                          className="w-8 h-8 rounded-full border-2 border-ajwaak-primary text-ajwaak-primary hover:bg-ajwaak-primary hover:text-white transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="perfume-button w-full flex items-center justify-center text-lg py-3"
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
                {/* عرض منتجات وهمية جميلة في حالة عدم وجود بيانات */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
                  {[
                    { name: 'عطر الملوك الفاخر', price: 299, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop' },
                    { name: 'زيت العود الأصلي', price: 399, image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=600&fit=crop' },
                    { name: 'عطر الياسمين الشرقي', price: 249, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=600&fit=crop' },
                    { name: 'بخور الصندل الملكي', price: 199, image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop' },
                    { name: 'عطر الورد الدمشقي', price: 349, image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400&h=600&fit=crop' },
                    { name: 'معطر المنزل الفاخر', price: 159, image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=600&fit=crop' }
                  ].map((product, index) => (
                    <div key={index} className="perfume-card group">
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <button className="text-white hover:text-ajwaak-gold transition-colors p-2 bg-black/20 rounded-full backdrop-blur-sm">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3 bg-ajwaak-gold text-ajwaak-dark px-3 py-1 rounded-lg text-sm font-bold">
                          جديد
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-ajwaak-dark mb-2">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current text-ajwaak-gold" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 mr-2">(4.9)</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-ajwaak-primary">
                            ر.س {product.price}
                          </span>
                        </div>

                        <button className="perfume-button w-full flex items-center justify-center text-lg py-3">
                          <ShoppingCart className="w-5 h-5 ml-2" />
                          أضف للسلة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Sparkles className="w-20 h-20 text-ajwaak-primary mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-ajwaak-dark mb-4">
                  مرحباً بك في أجواك
                </h3>
                <p className="text-xl text-gray-600">
                  أفضل العطور والزيوت العطرية الفاخرة في انتظارك
                </p>
              </div>
            )}
          </div>

          {/* أقسام العطور */}
          {categories.length > 0 && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-6xl font-black text-ajwaak-primary mb-4 arabic-title">
                  أقسام العطور الفاخرة
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  استكشف تشكيلتنا المتنوعة من أفخر العطور والزيوت العطرية
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="perfume-card group text-center p-6 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="w-20 h-20 bg-ajwaak-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-ajwaak-dark mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* مميزات أجواك */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-6xl font-black text-ajwaak-primary mb-4 arabic-title">
                لماذا أجواك؟
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                نحن نقدم أفضل تجربة تسوق للعطور في المملكة العربية السعودية
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="perfume-card text-center p-8">
                <div className="w-20 h-20 bg-ajwaak-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Truck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-ajwaak-dark mb-3">شحن مجاني</h3>
                <p className="text-gray-600">للطلبات أكثر من 200 ريال</p>
              </div>
              
              <div className="perfume-card text-center p-8">
                <div className="w-20 h-20 bg-ajwaak-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-ajwaak-dark mb-3">ضمان الجودة</h3>
                <p className="text-gray-600">عطور أصلية 100%</p>
              </div>
              
              <div className="perfume-card text-center p-8">
                <div className="w-20 h-20 bg-ajwaak-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-ajwaak-dark mb-3">خدمة ممتازة</h3>
                <p className="text-gray-600">دعم عملاء 24/7</p>
              </div>
              
              <div className="perfume-card text-center p-8">
                <div className="w-20 h-20 bg-ajwaak-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-ajwaak-dark mb-3">تغليف فاخر</h3>
                <p className="text-gray-600">تغليف أنيق ومميز</p>
              </div>
            </div>
          </div>

          {/* طرق الدفع */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-5xl font-bold text-ajwaak-primary mb-6 arabic-title">
                طرق دفع متعددة وآمنة
              </h3>
              <p className="text-lg text-gray-600">ادفع بسهولة وأمان بالطريقة التي تناسبك</p>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              {['STC Pay', 'Visa', 'Mastercard', 'Apple Pay', 'Mada', 'Tamara', 'Tabby'].map((method) => (
                <div key={method} className="bg-white rounded-2xl p-6 h-16 w-32 flex items-center justify-center shadow-xl border border-gray-100 hover:scale-105 transition-transform">
                  <span className="text-lg font-bold text-gray-700">{method}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default HomePage; 