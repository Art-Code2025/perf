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
      
      {/* Premium Hero Section - تصميم جديد مثل الصورة - محدث */}
      <div className="relative bg-white">
        
        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-ajwaak-primary mb-6 arabic-title">
              أجــــواك
            </h1>
            <p className="text-2xl md:text-3xl text-ajwaak-secondary font-bold mb-8">
              عطور فاخرة من التراث العربي
            </p>
            <div className="w-32 h-1 bg-ajwaak-gold mx-auto rounded-full"></div>
          </div>

          {/* Main Product Showcase - 3 عطور كبيرة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            
            {/* عطر 1 */}
            <div className="group relative bg-gradient-to-br from-ajwaak-dark via-ajwaak-primary to-ajwaak-secondary rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="aspect-[3/4] relative">
                <img 
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop&crop=center"
                  alt="عطر أجواك الملكي"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-3xl font-black mb-2 arabic-title">عطر الملوك</h3>
                  <p className="text-lg mb-4">العطر الأكثر فخامة</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-ajwaak-gold">ر.س 299</span>
                    <button className="bg-ajwaak-gold text-ajwaak-dark px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors">
                      اطلب الآن
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* عطر 2 */}
            <div className="group relative bg-gradient-to-br from-ajwaak-secondary via-ajwaak-primary to-ajwaak-dark rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="aspect-[3/4] relative">
                <img 
                  src="https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=600&h=800&fit=crop&crop=center"
                  alt="زيت العود الأصلي"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-3xl font-black mb-2 arabic-title">زيت العود</h3>
                  <p className="text-lg mb-4">العود الأصلي الفاخر</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-ajwaak-gold">ر.س 399</span>
                    <button className="bg-ajwaak-gold text-ajwaak-dark px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors">
                      اطلب الآن
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* عطر 3 */}
            <div className="group relative bg-gradient-to-br from-ajwaak-primary via-ajwaak-dark to-ajwaak-secondary rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="aspect-[3/4] relative">
                <img 
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop&crop=center"
                  alt="عطر الورد الدمشقي"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-3xl font-black mb-2 arabic-title">الورد الدمشقي</h3>
                  <p className="text-lg mb-4">عبق الورد الأصيل</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-ajwaak-gold">ر.س 249</span>
                    <button className="bg-ajwaak-gold text-ajwaak-dark px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors">
                      اطلب الآن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-ajwaak-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-ajwaak-dark mb-2">شحن مجاني</h4>
              <p className="text-gray-600">للطلبات أكثر من 200 ريال</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ajwaak-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-ajwaak-dark mb-2">ضمان الجودة</h4>
              <p className="text-gray-600">عطور أصلية 100%</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ajwaak-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-ajwaak-dark mb-2">خدمة ممتازة</h4>
              <p className="text-gray-600">دعم عملاء 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ajwaak-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-ajwaak-dark mb-2">تغليف فاخر</h4>
              <p className="text-gray-600">تغليف أنيق ومميز</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              to="/products"
              className="inline-flex items-center bg-ajwaak-gradient text-white font-black px-12 py-4 rounded-2xl text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-6 h-6 ml-3" />
              تسوق جميع العطور
              <ArrowRight className="w-6 h-6 mr-3" />
            </Link>
          </div>
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