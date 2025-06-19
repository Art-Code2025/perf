import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronLeft, ChevronRight, Menu, X, Search, ShoppingCart, Heart, User, Package, Gift, Sparkles, ArrowLeft, Plus, Minus, Star } from 'lucide-react';

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
  // Add quantity state for mobile cards
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

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

  // Default categories for perfume store
  const defaultCategories = [
    {
      id: 1,
      name: 'عطور مستوحاة',
      description: 'عطور مستوحاة من ماركات عالمية',
      image: '/placeholder-perfume.png',
      products: []
    },
    {
      id: 2,
      name: 'زيوت عطرية',
      description: 'زيوت عطرية طبيعية وفاخرة',
      image: '/placeholder-oil.png',
      products: []
    },
    {
      id: 3,
      name: 'عطور اللبان',
      description: 'أضافة وتميز في تجربة فريدة لا تنسى',
      image: '/placeholder-incense.png',
      products: []
    },
    {
      id: 4,
      name: 'معطرات المنزل',
      description: 'تشكيلة واسعة من المعطرات الفاخرة',
      image: '/placeholder-home.png',
      products: []
    },
    {
      id: 5,
      name: 'بخور',
      description: 'بخور خاص متعدد الاستخدام',
      image: '/placeholder-bakhoor.png',
      products: []
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

      // Use safe API call with better error handling
      const [categoriesResult, productsResult] = await Promise.all([
        safeApiCall<Category[]>(API_ENDPOINTS.CATEGORIES, {}, []),
        safeApiCall<Product[]>(API_ENDPOINTS.PRODUCTS, {}, [])
      ]);

      // Check if server is down
      if (categoriesResult.isServerDown || productsResult.isServerDown) {
        throw new Error('🚫 الخادم غير متاح حالياً. يرجى التأكد من تشغيل الخادم والمحاولة مرة أخرى.');
      }

      // Check for errors
      if (categoriesResult.error) {
        throw new Error(categoriesResult.error);
      }
      if (productsResult.error) {
        throw new Error(productsResult.error);
      }

      const categoriesData = categoriesResult.data || [];
      const productsData = productsResult.data || [];

      // Group products by category and sort by creation date
      const categoryProductsMap: { [key: number]: Product[] } = {};

      productsData.forEach((product: Product) => {
        if (product.categoryId) {
          if (!categoryProductsMap[product.categoryId]) {
            categoryProductsMap[product.categoryId] = [];
          }
          categoryProductsMap[product.categoryId].push(product);
        }
      });

      // Sort products within each category by creation date (newest first)
      Object.keys(categoryProductsMap).forEach(categoryId => {
        categoryProductsMap[parseInt(categoryId)].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
      });

      // Create category products array with products
      const categoryProductsArray: CategoryProducts[] = categoriesData
        .filter((category: Category) => categoryProductsMap[category.id] && categoryProductsMap[category.id].length > 0)
        .map((category: Category) => ({
          category,
          products: categoryProductsMap[category.id].slice(0, 8) // Limit to 8 products per category
        }));

      setCategoryProducts(categoryProductsArray);
      console.log(`✅ تم تحميل ${categoriesData.length} تصنيف و ${productsData.length} منتج`);
    } catch (error) {
      console.error('❌ خطأ في تحميل البيانات:', error);
      const errorMessage = error instanceof Error ? error.message : 'فشل في تحميل البيانات';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Quantity handlers for mobile cards
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
      const success = await addToCartUnified(product.id, product.name, quantity);
      if (success) {
        // Update cart count
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(totalCount);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000); // Faster slide transition
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Error display component
  const ErrorDisplay = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">مشكلة في الاتصال</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
          >
            إعادة المحاولة
          </button>
          <p className="text-sm text-gray-500">
            تأكد من تشغيل الخادم على localhost:3001
          </p>
        </div>
      </div>
    </div>
  );

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchCategoriesWithProducts} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajwaak-light via-white to-ajwaak-cream" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 ajwaak-gradient shadow-lg backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="text-2xl font-bold text-white arabic-title">
                <span className="text-ajwaak-gold">أ</span>جواك
                <div className="text-xs font-normal text-white/80">AJWAAK</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <Link to="/" className="text-white hover:text-ajwaak-gold transition-colors font-medium">
                الرئيسية
              </Link>
              <Link to="/products" className="text-white hover:text-ajwaak-gold transition-colors font-medium">
                المنتجات
              </Link>
              <Link to="/categories" className="text-white hover:text-ajwaak-gold transition-colors font-medium">
                التصنيفات
              </Link>
              <Link to="/about" className="text-white hover:text-ajwaak-gold transition-colors font-medium">
                من نحن
              </Link>
              <Link to="/contact" className="text-white hover:text-ajwaak-gold transition-colors font-medium">
                تواصل معنا
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button className="text-white hover:text-ajwaak-gold transition-colors p-2">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-white hover:text-ajwaak-gold transition-colors p-2">
                <Heart className="w-5 h-5" />
              </button>
              <Link to="/cart" className="text-white hover:text-ajwaak-gold transition-colors p-2 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ajwaak-gold text-ajwaak-dark text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button className="text-white hover:text-ajwaak-gold transition-colors p-2">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img 
            src={heroSlides[currentSlide].image} 
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ajwaak-primary/70 via-transparent to-ajwaak-secondary/70"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 arabic-title text-white">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              {heroSlides[currentSlide].subtitle}
            </p>
            <Link 
              to={heroSlides[currentSlide].buttonLink}
              className="perfume-button inline-flex items-center px-8 py-4 text-lg font-semibold"
            >
              {heroSlides[currentSlide].buttonText}
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-ajwaak-gold transition-colors p-3 rounded-full bg-black/20 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-ajwaak-gold transition-colors p-3 rounded-full bg-black/20 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 rtl:space-x-reverse">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-ajwaak-gold' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse text-ajwaak-primary">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ajwaak-primary"></div>
            <span className="text-lg font-medium">جاري تحميل العطور...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={fetchCategoriesWithProducts}
        />
      )}

      {/* Categories Section */}
      {!loading && !error && (
        <section className="py-20 bg-gradient-to-b from-white to-ajwaak-cream">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-ajwaak-primary mb-4 arabic-title">
                تشكيلة العطور المميزة
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                اكتشف عالماً من العطور الفاخرة والزيوت العطرية الطبيعية المصممة خصيصاً لك
              </p>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="space-y-20">
                {categoryProducts.map((categoryData, categoryIndex) => (
                  <div key={categoryData.category.id} className="space-y-8">
                    {/* Category Header */}
                    <div className="perfume-category rounded-2xl mx-4 relative">
                      <div className="relative z-10">
                        <h3 className="text-3xl md:text-4xl font-bold mb-2 arabic-title">
                          {categoryData.category.name}
                        </h3>
                        <p className="text-lg text-white/90 max-w-lg mx-auto">
                          {categoryData.category.description}
                        </p>
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
                      {categoryData.products.map((product) => (
                        <div key={product.id} className="perfume-card group">
                          <div className="relative overflow-hidden rounded-t-2xl">
                            <img
                              src={buildImageUrl(product.mainImage)}
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-perfume.png';
                              }}
                            />
                            <div className="absolute top-4 right-4">
                              <button className="text-white hover:text-ajwaak-gold transition-colors p-2 bg-black/20 rounded-full backdrop-blur-sm">
                                <Heart className="w-5 h-5" />
                              </button>
                            </div>
                            {product.originalPrice && (
                              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                                خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </div>
                            )}
                          </div>
                          
                          <div className="p-6">
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

                    {/* View More Button */}
                    <div className="text-center">
                      <Link 
                        to={`/category/${createCategorySlug(categoryData.category.id, categoryData.category.name)}`}
                        className="inline-flex items-center px-8 py-3 border-2 border-ajwaak-primary text-ajwaak-primary hover:bg-ajwaak-primary hover:text-white transition-colors rounded-full font-semibold"
                      >
                        عرض المزيد
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Gift className="w-16 h-16 text-ajwaak-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-ajwaak-dark mb-2">
                  قريباً.. تشكيلة عطور مميزة
                </h3>
                <p className="text-gray-600">
                  نعمل على إضافة أفضل العطور والزيوت العطرية لك
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Payment Methods Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-ajwaak-primary mb-4 arabic-title">
              طرق دفع متعددة وآمنة
            </h3>
            <p className="text-gray-600">ادفع بسهولة وأمان بالطريقة التي تناسبك</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <img src="/payment/stc-pay.png" alt="STC Pay" className="h-12" />
            <img src="/payment/mastercard.png" alt="Mastercard" className="h-12" />
            <img src="/payment/visa.png" alt="Visa" className="h-12" />
            <img src="/payment/apple-pay.png" alt="Apple Pay" className="h-12" />
            <img src="/payment/mada.png" alt="Mada" className="h-12" />
            <img src="/payment/tamara.png" alt="Tamara" className="h-12" />
            <img src="/payment/tabby.png" alt="Tabby" className="h-12" />
            <img src="/payment/american-express.png" alt="American Express" className="h-12" />
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-gradient-to-b from-ajwaak-cream to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-ajwaak-primary mb-4 arabic-title">
              آراء العملاء
            </h3>
            <p className="text-lg text-gray-600">
              عطر يا حبي رائع لا يمكن للانسان ان يستغني عنه ابداً مدة البقاء 8 أيام ويعطي احساس بالمودة والرقة والانوثة، النشر جميع أنحاء الجسم.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((review) => (
              <div key={review} className="perfume-card p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-ajwaak-primary rounded-full flex items-center justify-center text-white font-bold">
                    ع{review}
                  </div>
                  <div className="mr-4">
                    <div className="font-semibold text-ajwaak-dark">عميل مميز</div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-ajwaak-gold" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  عطر رائع ومميز، جودة عالية ورائحة تدوم طويلاً. أنصح به بشدة!
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ajwaak-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4 arabic-title">
                <span className="text-ajwaak-gold">أ</span>جواك
                <div className="text-sm font-normal text-white/80">AJWAAK</div>
              </div>
              <p className="text-white/80 mb-4">
                وجهتك المثالية للعطور الفاخرة والزيوت العطرية الطبيعية
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/products" className="hover:text-ajwaak-gold">المنتجات</Link></li>
                <li><Link to="/categories" className="hover:text-ajwaak-gold">التصنيفات</Link></li>
                <li><Link to="/offers" className="hover:text-ajwaak-gold">العروض</Link></li>
                <li><Link to="/contact" className="hover:text-ajwaak-gold">تواصل معنا</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">خدمة العملاء</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/help" className="hover:text-ajwaak-gold">مساعدة</Link></li>
                <li><Link to="/returns" className="hover:text-ajwaak-gold">سياسة الإرجاع</Link></li>
                <li><Link to="/shipping" className="hover:text-ajwaak-gold">الشحن والتوصيل</Link></li>
                <li><Link to="/privacy" className="hover:text-ajwaak-gold">سياسة الخصوصية</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <div className="space-y-2 text-white/80">
                <p>📱 +966 50 123 4567</p>
                <p>📧 info@ajwaak.com</p>
                <p>📍 الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center text-white/60">
            <p>&copy; 2024 أجواك. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Toast Container */}
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;