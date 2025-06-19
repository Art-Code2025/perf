import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronLeft, ChevronRight, Menu, X, Search, ShoppingCart, Heart, User, Package, Gift, Sparkles, ArrowLeft, Plus, Minus, Star, ChevronDown, Phone, Mail } from 'lucide-react';

// Import components directly for debugging
import ImageSlider from './components/ImageSlider';
import ProductCard from './components/ProductCard';
import WhatsAppButton from './components/WhatsAppButton';
import cover1 from './assets/cover1.jpg';
import { createCategorySlug, createProductSlug } from './utils/slugify';
import cover2 from './assets/cover2.jpg';
import cover3 from './assets/cover3.jpg';
import { apiCall, API_ENDPOINTS, buildImageUrl, safeApiCall } from './config/api';
import { addToCartUnified } from './utils/cartUtils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number | null;
  productType?: string;
  dynamicOptions?: any[];
  mainImage: string;
  detailedImages?: string[];
  specifications?: { name: string; value: string }[];
  createdAt?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface CategoryProducts {
  category: Category;
  products: Product[];
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState<CategoryProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const heroSlides = [
    {
      id: 1,
      image: cover1,
      title: 'عطور فاخرة من أجواك',
      subtitle: 'استمتع بتشكيلة متنوعة من أفخر العطور والزيوت العطرية',
      buttonText: 'استكشف العطور',
      buttonLink: '/products'
    },
    {
      id: 2,
      image: cover2,
      title: 'زيوت عطرية طبيعية',
      subtitle: 'اكتشف عالم العطور الطبيعية والزيوت العطرية الأصيلة',
      buttonText: 'تصفح الآن',
      buttonLink: '/products'
    },
    {
      id: 3,
      image: cover3,
      title: 'معطرات المنزل الفاخرة',
      subtitle: 'اضفي لمسة من الأناقة والعطر الفواح على منزلك',
      buttonText: 'ابدأ التسوق',
      buttonLink: '/products'
    }
  ];

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalCount);
    };

    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleCategoriesUpdate = () => {
    fetchCategoriesWithProducts();
  };

  useEffect(() => {
    fetchCategoriesWithProducts();

    // Add event listeners for real-time updates
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    window.addEventListener('productsUpdated', handleCategoriesUpdate);

    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('productsUpdated', handleCategoriesUpdate);
    };
  }, []);

  const fetchCategoriesWithProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResult, productsResult] = await Promise.all([
        safeApiCall<Category[]>(API_ENDPOINTS.CATEGORIES, {}, []),
        safeApiCall<Product[]>(API_ENDPOINTS.PRODUCTS, {}, [])
      ]);

      if (categoriesResult.isServerDown || productsResult.isServerDown) {
        throw new Error('🚫 الخادم غير متاح حالياً. يرجى التأكد من تشغيل الخادم والمحاولة مرة أخرى.');
      }

      if (categoriesResult.error) {
        throw new Error(categoriesResult.error);
      }
      if (productsResult.error) {
        throw new Error(productsResult.error);
      }

      const categoriesData = categoriesResult.data || [];
      const productsData = productsResult.data || [];

      const categoryProductsMap: { [key: number]: Product[] } = {};

      productsData.forEach((product: Product) => {
        if (product.categoryId) {
          if (!categoryProductsMap[product.categoryId]) {
            categoryProductsMap[product.categoryId] = [];
          }
          categoryProductsMap[product.categoryId].push(product);
        }
      });

      const groupedData: CategoryProducts[] = categoriesData.map((category: Category) => ({
        category,
        products: categoryProductsMap[category.id] || []
      })).filter(group => group.products.length > 0);

      setCategoryProducts(groupedData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'حدث خطأ في تحميل البيانات');
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
    try {
      const quantity = quantities[product.id] || 1;
      const result = await addToCartUnified(product.id, product.name, quantity);
      
      if (result) {
        toast.success(`تم إضافة ${product.name} إلى السلة!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          rtl: true,
        });
        
        // Update cart count
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(totalCount);
      } else {
        throw new Error('فشل في إضافة المنتج إلى السلة');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'فشل في إضافة المنتج إلى السلة');
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">مشكلة في الاتصال</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={fetchCategoriesWithProducts}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" dir="rtl">
      {/* Header - Modern Luxury Design */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-yellow-600/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative">
                <div className="text-3xl font-bold text-white">
                  <span className="text-yellow-500">أ</span>جواك
                </div>
                <div className="text-xs text-yellow-500 tracking-[0.2em] mt-1">AJWAAK</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <Link to="/" className="text-white hover:text-yellow-500 transition-colors font-medium">
                الرئيسية
              </Link>
              <Link to="/products" className="text-white hover:text-yellow-500 transition-colors font-medium">
                المنتجات
              </Link>
              <Link to="/categories" className="text-white hover:text-yellow-500 transition-colors font-medium">
                التصنيفات
              </Link>
              <Link to="/about" className="text-white hover:text-yellow-500 transition-colors font-medium">
                من نحن
              </Link>
              <Link to="/contact" className="text-white hover:text-yellow-500 transition-colors font-medium">
                تواصل معنا
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button className="text-white hover:text-yellow-500 transition-colors p-2">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-white hover:text-yellow-500 transition-colors p-2">
                <Heart className="w-5 h-5" />
              </button>
              <Link to="/cart" className="text-white hover:text-yellow-500 transition-colors p-2 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button className="text-white hover:text-yellow-500 transition-colors p-2">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Luxury Perfume Style */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroSlides[currentSlide].image} 
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4 pt-20">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-yellow-200 max-w-2xl mx-auto leading-relaxed">
              {heroSlides[currentSlide].subtitle}
            </p>
            <Link 
              to={heroSlides[currentSlide].buttonLink}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg rounded-full hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              {heroSlides[currentSlide].buttonText}
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-500 transition-colors p-4 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-500 transition-colors p-4 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 rtl:space-x-reverse">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-yellow-500 w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Premium Products Section */}
      {!loading && !error && (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                تشكيلة العطور المميزة
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                اكتشف عالماً من العطور الفاخرة والزيوت العطرية الطبيعية المصممة خصيصاً لك
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto mt-8"></div>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="space-y-24">
                {categoryProducts.map((categoryData, categoryIndex) => (
                  <div key={categoryData.category.id} className="space-y-12">
                    {/* Category Header - Luxury Style */}
                    <div className="text-center relative">
                      <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full border border-yellow-500/30 backdrop-blur-sm">
                        <Sparkles className="w-6 h-6 text-yellow-500 ml-3" />
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                          {categoryData.category.name}
                        </h3>
                        <Sparkles className="w-6 h-6 text-yellow-500 mr-3" />
                      </div>
                      <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
                        {categoryData.category.description}
                      </p>
                    </div>

                    {/* Products Grid - Premium Design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {categoryData.products.map((product) => (
                        <div key={product.id} className="group relative">
                          {/* Premium Product Card */}
                          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                            {/* Product Image */}
                            <div className="relative overflow-hidden">
                              <img
                                src={buildImageUrl(product.mainImage)}
                                alt={product.name}
                                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder-perfume.png';
                                }}
                              />
                              {/* Overlay Gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              
                              {/* Floating Action Buttons */}
                              <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:text-yellow-500 transition-colors">
                                  <Heart className="w-5 h-5" />
                                </button>
                                <Link to={`/product/${product.id}`} className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:text-yellow-500 transition-colors">
                                  <Search className="w-5 h-5" />
                                </Link>
                              </div>

                              {/* Price Badge */}
                              <div className="absolute top-4 left-4">
                                <div className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm">
                                  {product.price} ريال
                                </div>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                {product.description}
                              </p>

                              {/* Rating */}
                              <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                ))}
                                <span className="text-gray-400 text-sm mr-2">(4.8)</span>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                  <button 
                                    onClick={() => handleQuantityDecrease(product.id)}
                                    className="w-8 h-8 rounded-full bg-gray-800 border border-yellow-500/30 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all duration-300"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-white font-semibold min-w-[2rem] text-center">
                                    {quantities[product.id] || 1}
                                  </span>
                                  <button 
                                    onClick={() => handleQuantityIncrease(product.id, product.stock)}
                                    className="w-8 h-8 rounded-full bg-gray-800 border border-yellow-500/30 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all duration-300"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="text-sm text-gray-400">
                                  متوفر: {product.stock}
                                </div>
                              </div>

                              {/* Add to Cart Button */}
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25"
                              >
                                إضافة للسلة
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">لا توجد منتجات متاحة</h3>
                <p className="text-gray-400">سيتم إضافة المنتجات قريباً</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-32 text-center bg-black">
          <div className="inline-flex items-center space-x-3 rtl:space-x-reverse text-yellow-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <span className="text-xl font-medium text-white">جاري تحميل العطور الفاخرة...</span>
          </div>
        </div>
      )}

      {/* Premium Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">
                <span className="text-yellow-500">أ</span>جواك
              </div>
              <p className="text-gray-400 leading-relaxed">
                رحلة عطرية فاخرة تأخذك إلى عالم من الروائح المميزة والتجارب الحسية الاستثنائية
              </p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">روابط سريعة</h4>
              <div className="space-y-2">
                <Link to="/products" className="block text-gray-400 hover:text-yellow-500 transition-colors">المنتجات</Link>
                <Link to="/categories" className="block text-gray-400 hover:text-yellow-500 transition-colors">التصنيفات</Link>
                <Link to="/about" className="block text-gray-400 hover:text-yellow-500 transition-colors">من نحن</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-yellow-500 transition-colors">تواصل معنا</Link>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">التصنيفات</h4>
              <div className="space-y-2">
                <div className="text-gray-400">عطور مستوحاة</div>
                <div className="text-gray-400">زيوت عطرية</div>
                <div className="text-gray-400">عطور اللبان</div>
                <div className="text-gray-400">معطرات المنزل</div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">تواصل معنا</h4>
              <div className="space-y-2 text-gray-400">
                <div>الرياض، المملكة العربية السعودية</div>
                <div>+966 50 123 4567</div>
                <div>info@ajwaak.com</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 أجواك. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Toast Container */}
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1f2937',
          color: '#ffffff',
          border: '1px solid #374151'
        }}
      />
    </div>
  );
};

export default App;