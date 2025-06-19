import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Heart, ShoppingCart, Package, Truck, Shield, Award, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Eye, Users, Briefcase, Home, Accessibility, Sparkles, Crown, Gem, Zap, Plus, Minus } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-ajwaak-light via-white to-ajwaak-cream flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-ajwaak-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-ajwaak-dark font-medium text-sm md:text-base">جاري تحميل العطور...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajwaak-light via-white to-ajwaak-cream">
      
      {/* Creative Perfume Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Main Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-ajwaak-primary via-ajwaak-secondary to-ajwaak-dark"></div>
          
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-ajwaak-gold/20 via-transparent to-ajwaak-gold/30"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-ajwaak-cream/10 to-transparent"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-ajwaak-gold/60 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-ajwaak-gold/30 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 border-2 border-ajwaak-cream/20 rotate-45 animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-ajwaak-gold/10 rounded-lg rotate-12 animate-pulse"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Content */}
              <div className="text-center lg:text-right space-y-8">
                {/* Premium Badge */}
                <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-ajwaak-gold/30 rounded-full px-6 py-3 mb-6">
                  <Crown className="w-5 h-5 text-ajwaak-gold ml-2" />
                  <span className="text-white font-semibold text-sm">عطور فاخرة أصلية</span>
                  <Sparkles className="w-4 h-4 text-ajwaak-gold mr-2 animate-pulse" />
                </div>

                {/* Main Title */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white arabic-title leading-tight">
                    <span className="block text-ajwaak-gold">أجــــواك</span>
                    <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2">عالم العطور الفاخرة</span>
                  </h1>
                  
                  <div className="h-1 w-32 bg-gradient-to-r from-ajwaak-gold to-transparent mx-auto lg:mx-0 rounded-full"></div>
                </div>

                {/* Description */}
                <p className="text-xl sm:text-2xl text-ajwaak-cream/90 font-light leading-relaxed max-w-2xl">
                  اكتشف مجموعتنا الحصرية من أفخر العطور والزيوت العطرية الطبيعية المستوحاة من التراث العربي الأصيل
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 py-8">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-ajwaak-gold mb-2">500+</div>
                    <div className="text-white/80 text-sm font-medium">عطر فاخر</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-ajwaak-gold mb-2">50K+</div>
                    <div className="text-white/80 text-sm font-medium">عميل سعيد</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-ajwaak-gold mb-2">15+</div>
                    <div className="text-white/80 text-sm font-medium">عام خبرة</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/products"
                    className="group relative overflow-hidden bg-ajwaak-gold hover:bg-ajwaak-gold/90 text-ajwaak-dark font-black px-8 py-4 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-ajwaak-gold/50"
                  >
                    <span className="relative z-10 flex items-center justify-center text-lg">
                      <Sparkles className="w-5 h-5 ml-2" />
                      استكشف العطور
                      <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-ajwaak-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  
                  <Link
                    to="/categories"
                    className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-ajwaak-gold/50 text-white font-bold px-8 py-4 rounded-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center text-lg">
                      <Gem className="w-5 h-5 ml-2" />
                      أقسام العطور
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right Visual Content */}
              <div className="relative">
                {/* Central Perfume Bottle */}
                <div className="relative mx-auto w-80 h-96">
                  {/* Main Bottle Container */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Bottle Glow */}
                      <div className="absolute inset-0 bg-ajwaak-gold/30 blur-3xl rounded-full scale-150 animate-pulse"></div>
                      
                      {/* Bottle SVG */}
                      <div className="relative z-10 w-48 h-64 mx-auto">
                        <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-2xl">
                          {/* Bottle Body */}
                          <defs>
                            <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8"/>
                              <stop offset="50%" stopColor="#F5E6A3" stopOpacity="0.6"/>
                              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9"/>
                            </linearGradient>
                            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8B1538" stopOpacity="0.9"/>
                              <stop offset="50%" stopColor="#A91D47" stopOpacity="0.8"/>
                              <stop offset="100%" stopColor="#8B1538" stopOpacity="0.9"/>
                            </linearGradient>
                          </defs>
                          
                          {/* Bottle Shape */}
                          <path
                            d="M60 80 L60 240 Q60 260 80 260 L120 260 Q140 260 140 240 L140 80 Q140 70 130 70 L70 70 Q60 70 60 80 Z"
                            fill="url(#bottleGradient)"
                            className="animate-pulse"
                          />
                          
                          {/* Liquid */}
                          <path
                            d="M70 90 L70 240 Q70 250 80 250 L120 250 Q130 250 130 240 L130 90 Z"
                            fill="url(#liquidGradient)"
                            className="animate-pulse"
                          />
                          
                          {/* Bottle Neck */}
                          <rect x="85" y="40" width="30" height="40" fill="url(#bottleGradient)" rx="5"/>
                          
                          {/* Cap */}
                          <rect x="80" y="20" width="40" height="30" fill="#D4AF37" rx="8"/>
                          
                          {/* Highlight */}
                          <path
                            d="M75 90 Q85 85 85 100 L85 200 Q85 210 75 205"
                            fill="rgba(255,255,255,0.3)"
                            className="animate-pulse"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-10 -left-10 w-20 h-20 bg-ajwaak-gold/20 rounded-full blur-xl animate-float"></div>
                  <div className="absolute bottom-20 -right-10 w-16 h-16 bg-ajwaak-cream/30 rounded-full blur-lg animate-float-delayed"></div>
                  <div className="absolute top-1/2 -right-16 w-12 h-12 bg-white/20 rounded-full blur-md animate-bounce-slow"></div>
                  
                  {/* Sparkle Effects */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-ajwaak-gold rounded-full animate-ping"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Surrounding Mini Bottles */}
                <div className="absolute inset-0">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-8 h-12 bg-ajwaak-gold/60 rounded-full animate-float opacity-70"
                      style={{
                        left: `${10 + (i * 15)}%`,
                        top: `${30 + Math.sin(i) * 40}%`,
                        animationDelay: `${i * 0.5}s`,
                        transform: `rotate(${i * 30}deg)`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Premium Installment Banner - responsive */}
      <div className="relative overflow-hidden ajwaak-gradient py-3 sm:py-4 md:py-6 shadow-2xl">
        <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-4 text-center sm:text-right">
              <div className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white/20 select-none">0%</div>
              <div className="text-white">
                <h3 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-black mb-1 flex items-center gap-1 sm:gap-2">
                  <Gem className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  قسط عطورك على 4 دفعات
                </h3>
                <p className="text-xs sm:text-sm md:text-lg lg:text-xl font-medium text-white/90">بحد أقصى 5000 ريال</p>
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              <button className="group px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-full shadow-xl text-xs sm:text-sm md:text-base">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  تمارا
                </span>
              </button>
              <button className="group px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-full shadow-xl text-xs sm:text-sm md:text-base">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  تابي
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        
        {/* عطور وصلت حديثاً - أصغر للموبايل */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ajwaak-primary mb-2 sm:mb-3 relative inline-block arabic-title">
              <span className="flex items-center gap-2 sm:gap-3 justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-ajwaak-gold" />
                عطور وصلت حديثاً
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-ajwaak-gold" />
              </span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              اكتشف أحدث العطور الفاخرة والزيوت العطرية الطبيعية المضافة حديثاً لمجموعتنا
            </p>
          </div>
          
          {newProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {newProducts.map((product) => (
                <div key={product.id} className="perfume-card group">
                  <div className="relative overflow-hidden rounded-t-lg sm:rounded-t-xl">
                    <img
                      src={buildImageUrl(product.mainImage)}
                      alt={product.name}
                      className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-perfume.png';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={() => handleWishlistToggle(product)}
                        className={`text-white hover:text-ajwaak-gold transition-colors p-1 sm:p-2 bg-black/20 rounded-full backdrop-blur-sm ${
                          isInWishlist(product.id) ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    {product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-1 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-bold">
                        خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 sm:p-3 md:p-4">
                    <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-ajwaak-dark mb-1 sm:mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2 sm:mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 fill-current text-ajwaak-gold" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 mr-1">(4.5)</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div>
                        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-ajwaak-primary">
                          ر.س {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through mr-1">
                            ر.س {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 rtl:space-x-reverse mb-2 sm:mb-3">
                      <button
                        onClick={() => handleQuantityDecrease(product.id)}
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border border-ajwaak-primary text-ajwaak-primary hover:bg-ajwaak-primary hover:text-white transition-colors flex items-center justify-center text-xs"
                      >
                        <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                      <span className="font-semibold text-ajwaak-dark px-1 sm:px-2 text-xs sm:text-sm">
                        {quantities[product.id] || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityIncrease(product.id, product.stock)}
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border border-ajwaak-primary text-ajwaak-primary hover:bg-ajwaak-primary hover:text-white transition-colors flex items-center justify-center text-xs"
                      >
                        <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="perfume-button w-full flex items-center justify-center text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      أضف للسلة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 md:py-16">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-ajwaak-primary mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-ajwaak-dark mb-2">
                قريباً.. تشكيلة عطور مميزة
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                نعمل على إضافة أفضل العطور والزيوت العطرية لك
              </p>
            </div>
          )}
        </div>

        {/* أقسام العطور */}
        {categories.length > 0 && (
          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ajwaak-primary mb-2 sm:mb-3 arabic-title">
                أقسام العطور
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                استكشف تشكيلتنا المتنوعة من العطور والزيوت العطرية
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="perfume-card group text-center p-3 sm:p-4 md:p-6 hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-ajwaak-gradient rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-ajwaak-dark mb-1 sm:mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* العطور المميزة */}
        {featuredProducts.length > 0 && (
          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ajwaak-primary mb-2 sm:mb-3 arabic-title">
                العطور المميزة
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                مجموعة مختارة من أفضل العطور لدينا
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="perfume-card group">
                  <div className="relative overflow-hidden rounded-t-lg sm:rounded-t-xl">
                    <img
                      src={buildImageUrl(product.mainImage)}
                      alt={product.name}
                      className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-perfume.png';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={() => handleWishlistToggle(product)}
                        className={`text-white hover:text-ajwaak-gold transition-colors p-1 sm:p-2 bg-black/20 rounded-full backdrop-blur-sm ${
                          isInWishlist(product.id) ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    {product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-1 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-bold">
                        خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 sm:p-3 md:p-4">
                    <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-ajwaak-dark mb-1 sm:mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2 sm:mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 fill-current text-ajwaak-gold" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 mr-1">(4.5)</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div>
                        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-ajwaak-primary">
                          ر.س {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through mr-1">
                            ر.س {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 rtl:space-x-reverse mb-2 sm:mb-3">
                      <button
                        onClick={() => handleQuantityDecrease(product.id)}
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border border-ajwaak-primary text-ajwaak-primary hover:bg-ajwaak-primary hover:text-white transition-colors flex items-center justify-center text-xs"
                      >
                        <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                      <span className="font-semibold text-ajwaak-dark px-1 sm:px-2 text-xs sm:text-sm">
                        {quantities[product.id] || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityIncrease(product.id, product.stock)}
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border border-ajwaak-primary text-ajwaak-primary hover:bg-ajwaak-primary hover:text-white transition-colors flex items-center justify-center text-xs"
                      >
                        <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="perfume-button w-full flex items-center justify-center text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      أضف للسلة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* مميزات أجواك */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ajwaak-primary mb-2 sm:mb-3 arabic-title">
              لماذا أجواك؟
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              نحن نقدم أفضل تجربة تسوق للعطور في المملكة
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="perfume-card text-center p-3 sm:p-4 md:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ajwaak-gradient rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-ajwaak-dark mb-1 sm:mb-2">شحن مجاني</h3>
              <p className="text-xs text-gray-600">للطلبات أكثر من 200 ريال</p>
            </div>
            
            <div className="perfume-card text-center p-3 sm:p-4 md:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ajwaak-gradient rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-ajwaak-dark mb-1 sm:mb-2">ضمان الجودة</h3>
              <p className="text-xs text-gray-600">عطور أصلية 100%</p>
            </div>
            
            <div className="perfume-card text-center p-3 sm:p-4 md:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ajwaak-gradient rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-ajwaak-dark mb-1 sm:mb-2">خدمة ممتازة</h3>
              <p className="text-xs text-gray-600">دعم عملاء 24/7</p>
            </div>
            
            <div className="perfume-card text-center p-3 sm:p-4 md:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ajwaak-gradient rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-ajwaak-dark mb-1 sm:mb-2">تغليف فاخر</h3>
              <p className="text-xs text-gray-600">تغليف أنيق ومميز</p>
            </div>
          </div>
        </div>

        {/* طرق الدفع */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-ajwaak-primary mb-2 sm:mb-4 arabic-title">
              طرق دفع متعددة وآمنة
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">ادفع بسهولة وأمان بالطريقة التي تناسبك</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 opacity-70">
            <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 h-8 sm:h-10 md:h-12 w-16 sm:w-20 md:w-24 flex items-center justify-center shadow-lg">
              <span className="text-xs sm:text-sm font-bold">STC Pay</span>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 h-8 sm:h-10 md:h-12 w-16 sm:w-20 md:w-24 flex items-center justify-center shadow-lg">
              <span className="text-xs sm:text-sm font-bold">Visa</span>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 h-8 sm:h-10 md:h-12 w-16 sm:w-20 md:w-24 flex items-center justify-center shadow-lg">
              <span className="text-xs sm:text-sm font-bold">Mastercard</span>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 h-8 sm:h-10 md:h-12 w-16 sm:w-20 md:w-24 flex items-center justify-center shadow-lg">
              <span className="text-xs sm:text-sm font-bold">Apple Pay</span>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 h-8 sm:h-10 md:h-12 w-16 sm:w-20 md:w-24 flex items-center justify-center shadow-lg">
              <span className="text-xs sm:text-sm font-bold">Mada</span>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 h-8 sm:h-10 md:h-12 w-16 sm:w-20 md:w-24 flex items-center justify-center shadow-lg">
              <span className="text-xs sm:text-sm font-bold">Tamara</span>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 h-8 sm:h-10 md:h-12 w-16 sm:w-20 md:w-24 flex items-center justify-center shadow-lg">
              <span className="text-xs sm:text-sm font-bold">Tabby</span>
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