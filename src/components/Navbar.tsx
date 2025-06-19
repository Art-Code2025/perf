import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Phone, Mail, Instagram, Facebook, Twitter, Sparkles, Crown, Gem } from 'lucide-react';
import { toast } from 'react-toastify';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');

  // Check for routes where navbar should be hidden
  const shouldShowNavbar = !location.pathname.startsWith('/admin') && location.pathname !== '/login';

  useEffect(() => {
    // Load cart and wishlist counts
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    };

    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };

    const handleStorageChange = () => {
      updateCartCount();
      updateWishlistCount();
    };

    // Check customer login status
    const customerData = localStorage.getItem('customerUser');
    if (customerData) {
      try {
        const customer = JSON.parse(customerData);
        setIsCustomerLoggedIn(true);
        setCustomerName(customer.name || customer.email);
      } catch (error) {
        localStorage.removeItem('customerUser');
      }
    }

    // Initial load
    updateCartCount();
    updateWishlistCount();

    // Listen for storage changes
    window.addEventListener('cartUpdated', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('customerUser');
    setIsCustomerLoggedIn(false);
    setCustomerName('');
    setIsUserMenuOpen(false);
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  if (!shouldShowNavbar) {
    return null;
  }

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - مخفي على الشاشات الصغيرة */}
      <div className="hidden md:block ajwaak-gradient text-white py-1.5 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs lg:text-sm">
            <div className="flex items-center gap-4 lg:gap-8">
              <div className="flex items-center gap-1 lg:gap-2 font-medium">
                <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>للاستفسار: +966 50 123 4567</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4" />
                <span>عطور فاخرة أصلية</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 lg:gap-6">
              <span className="hidden lg:block font-semibold">تواصل معنا</span>
              <div className="flex items-center gap-2">
                <a href="#" className="w-5 h-5 lg:w-6 lg:h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                  <Instagram className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                </a>
                <a href="#" className="w-5 h-5 lg:w-6 lg:h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                  <Facebook className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Responsive */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            
            {/* Mobile Menu Button - Left */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded-lg text-gray-600 hover:text-ajwaak-primary hover:bg-ajwaak-cream transition-all"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Logo - Right Side */}
            <Link to="/" className="group flex items-center gap-2 sm:gap-3">
              <div className="text-right">
                <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black arabic-title text-ajwaak-primary">
                  <span className="text-ajwaak-gold">أ</span>جواك
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-ajwaak-secondary hidden sm:block">عطور فاخرة وزيوت عطرية</p>
              </div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 ajwaak-gradient rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl border-2 sm:border-4 border-white group-hover:scale-105 transition-all duration-300">
                  <div className="text-white font-black text-center arabic-title">
                    <div className="text-xs sm:text-sm md:text-base">أجواك</div>
                    <div className="text-xs opacity-90 hidden sm:block">AJWAAK</div>
                  </div>
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-ajwaak-gold to-yellow-500 rounded-full flex items-center justify-center animate-pulse border border-white shadow-lg">
                  <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 text-white" />
                </div>
              </div>
            </Link>

            {/* Search Bar - Center (Hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-2xl mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن العطور..."
                  className="w-full px-3 py-2 lg:px-4 lg:py-3 pr-8 lg:pr-10 border-2 border-ajwaak-primary/20 rounded-lg lg:rounded-xl focus:ring-2 lg:focus:ring-4 focus:ring-ajwaak-gold/20 focus:border-ajwaak-primary bg-gradient-to-r from-white to-ajwaak-cream/30 text-sm lg:text-base font-medium placeholder-gray-400 shadow-lg transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 lg:w-8 lg:h-8 ajwaak-gradient rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                >
                  <Search className="w-3 h-3 lg:w-4 lg:h-4" />
                </button>
              </form>
            </div>

            {/* Action Buttons - Left */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Cart - Always visible */}
              <Link to="/cart" className="group relative">
                <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 md:p-3 bg-gradient-to-r from-ajwaak-cream to-ajwaak-light rounded-lg sm:rounded-xl border border-ajwaak-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ajwaak-gradient rounded-lg flex items-center justify-center shadow-lg">
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    {totalCartItems > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-gradient-to-r from-ajwaak-gold to-yellow-500 rounded-full flex items-center justify-center text-ajwaak-dark text-xs font-black shadow-lg animate-pulse">
                        {totalCartItems}
                      </div>
                    )}
                  </div>
                  <div className="text-right hidden lg:block">
                    <div className="text-xs text-gray-500 font-medium">السلة</div>
                    <div className="text-sm font-bold text-ajwaak-primary">
                      {totalCartValue > 0 ? `${totalCartValue.toFixed(2)} ر.س` : '0 ر.س'}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Wishlist - Hidden on small screens */}
              <Link to="/wishlist" className="group relative hidden sm:block">
                <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 md:p-3 bg-gradient-to-r from-ajwaak-cream to-ajwaak-light rounded-lg sm:rounded-xl border border-ajwaak-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ajwaak-gradient rounded-lg flex items-center justify-center shadow-lg">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    {wishlistCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-gradient-to-r from-ajwaak-gold to-yellow-500 rounded-full flex items-center justify-center text-ajwaak-dark text-xs font-black shadow-lg animate-pulse">
                        {wishlistCount}
                      </div>
                    )}
                  </div>
                  <div className="text-right hidden lg:block">
                    <div className="text-xs text-gray-500 font-medium">المفضلة</div>
                    <div className="text-sm font-bold text-ajwaak-primary">{wishlistCount} منتج</div>
                  </div>
                </div>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="group flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 md:p-3 bg-gradient-to-r from-ajwaak-cream to-ajwaak-light rounded-lg sm:rounded-xl border border-ajwaak-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ajwaak-gradient rounded-lg flex items-center justify-center shadow-lg">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="text-right hidden lg:block">
                    <div className="text-xs text-gray-500 font-medium">حسابي</div>
                    <div className="text-sm font-bold text-ajwaak-primary">
                      {isCustomerLoggedIn ? customerName.split(' ')[0] : 'دخول'}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform group-hover:rotate-180" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {isCustomerLoggedIn ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-ajwaak-dark">{customerName}</p>
                          <p className="text-xs text-gray-500">عضو مميز</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-ajwaak-cream transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          الملف الشخصي
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-ajwaak-cream transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          طلباتي
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          تسجيل الخروج
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/sign-in"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-ajwaak-cream transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          تسجيل الدخول
                        </Link>
                        <Link
                          to="/sign-up"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-ajwaak-cream transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          إنشاء حساب
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center border-t border-gray-100 py-3">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm lg:text-base font-semibold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/' ? 'text-ajwaak-primary' : 'text-gray-700'
                }`}
              >
                الرئيسية
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ajwaak-gradient transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                to="/products"
                className={`text-sm lg:text-base font-semibold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/products' ? 'text-ajwaak-primary' : 'text-gray-700'
                }`}
              >
                جميع العطور
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ajwaak-gradient transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                to="/categories"
                className={`text-sm lg:text-base font-semibold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/categories' ? 'text-ajwaak-primary' : 'text-gray-700'
                }`}
              >
                أقسام العطور
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ajwaak-gradient transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                to="/offers"
                className={`text-sm lg:text-base font-semibold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/offers' ? 'text-ajwaak-primary' : 'text-gray-700'
                }`}
              >
                العروض
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ajwaak-gradient transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                to="/about"
                className={`text-sm lg:text-base font-semibold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/about' ? 'text-ajwaak-primary' : 'text-gray-700'
                }`}
              >
                من نحن
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ajwaak-gradient transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                to="/contact"
                className={`text-sm lg:text-base font-semibold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/contact' ? 'text-ajwaak-primary' : 'text-gray-700'
                }`}
              >
                تواصل معنا
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ajwaak-gradient transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن العطور..."
                  className="w-full px-3 py-2 pr-8 border-2 border-ajwaak-primary/20 rounded-lg focus:ring-2 focus:ring-ajwaak-gold/20 focus:border-ajwaak-primary bg-gradient-to-r from-white to-ajwaak-cream/30 text-sm font-medium placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 ajwaak-gradient rounded flex items-center justify-center text-white"
                >
                  <Search className="w-3 h-3" />
                </button>
              </form>

              {/* Mobile Menu Links */}
              <div className="space-y-1">
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-ajwaak-gradient text-white' 
                      : 'text-gray-700 hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  الرئيسية
                </Link>
                <Link
                  to="/products"
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    location.pathname === '/products' 
                      ? 'bg-ajwaak-gradient text-white' 
                      : 'text-gray-700 hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  جميع العطور
                </Link>
                <Link
                  to="/categories"
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    location.pathname === '/categories' 
                      ? 'bg-ajwaak-gradient text-white' 
                      : 'text-gray-700 hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  أقسام العطور
                </Link>
                <Link
                  to="/offers"
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    location.pathname === '/offers' 
                      ? 'bg-ajwaak-gradient text-white' 
                      : 'text-gray-700 hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  العروض
                </Link>
                <Link
                  to="/wishlist"
                  className={`sm:hidden block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    location.pathname === '/wishlist' 
                      ? 'bg-ajwaak-gradient text-white' 
                      : 'text-gray-700 hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  المفضلة ({wishlistCount})
                </Link>
                <Link
                  to="/about"
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    location.pathname === '/about' 
                      ? 'bg-ajwaak-gradient text-white' 
                      : 'text-gray-700 hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  من نحن
                </Link>
                <Link
                  to="/contact"
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    location.pathname === '/contact' 
                      ? 'bg-ajwaak-gradient text-white' 
                      : 'text-gray-700 hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  تواصل معنا
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;