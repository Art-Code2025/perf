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
      {/* Top Premium Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-ajwaak-dark via-ajwaak-primary to-ajwaak-dark text-white py-2 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 font-semibold">
                <Phone className="w-4 h-4" />
                <span>للاستفسار والطلبات: +966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-ajwaak-gold" />
                <span>شحن مجاني للطلبات أكثر من 200 ريال</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="font-bold text-ajwaak-gold">تواصل معنا:</span>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-ajwaak-gold/20 transition-all border border-white/20">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-ajwaak-gold/20 transition-all border border-white/20">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-ajwaak-gold/20 transition-all border border-white/20">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-2xl border-b border-ajwaak-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-ajwaak-primary hover:bg-ajwaak-cream transition-all"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Premium Logo */}
            <Link to="/" className="group flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-ajwaak-primary via-ajwaak-secondary to-ajwaak-gold rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white group-hover:scale-105 transition-all duration-300">
                  <div className="text-white font-black text-center arabic-title">
                    <div className="text-lg lg:text-xl">أجواك</div>
                    <div className="text-xs opacity-90">AJWAAK</div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-ajwaak-gold to-yellow-400 rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-lg">
                  <Crown className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-black arabic-title text-ajwaak-primary">
                  أجــــواك
                </h1>
                <p className="text-sm lg:text-base font-bold text-ajwaak-secondary">عطور فاخرة وزيوت عطرية</p>
              </div>
            </Link>

            {/* Search Bar - Center */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن العطور الفاخرة..."
                  className="w-full px-6 py-4 pr-12 border-2 border-ajwaak-primary/20 rounded-2xl focus:ring-4 focus:ring-ajwaak-gold/20 focus:border-ajwaak-primary bg-gradient-to-r from-white to-ajwaak-cream/30 text-lg font-medium placeholder-gray-400 shadow-lg transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Cart */}
              <Link to="/cart" className="group relative">
                <div className="flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-r from-ajwaak-cream to-ajwaak-light rounded-2xl border-2 border-ajwaak-primary/20 hover:border-ajwaak-gold/50 hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary rounded-xl flex items-center justify-center shadow-lg">
                      <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    {totalCartItems > 0 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-ajwaak-gold to-yellow-400 rounded-full flex items-center justify-center text-ajwaak-dark text-xs font-black shadow-lg animate-pulse">
                        {totalCartItems}
                      </div>
                    )}
                  </div>
                  <div className="text-right hidden xl:block">
                    <div className="text-xs text-gray-500 font-medium">سلة التسوق</div>
                    <div className="text-lg font-bold text-ajwaak-primary">
                      {totalCartValue > 0 ? `${totalCartValue.toFixed(2)} ر.س` : '0 ر.س'}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="group relative hidden sm:block">
                <div className="flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-r from-ajwaak-cream to-ajwaak-light rounded-2xl border-2 border-ajwaak-primary/20 hover:border-ajwaak-gold/50 hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary rounded-xl flex items-center justify-center shadow-lg">
                      <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    {wishlistCount > 0 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-ajwaak-gold to-yellow-400 rounded-full flex items-center justify-center text-ajwaak-dark text-xs font-black shadow-lg animate-pulse">
                        {wishlistCount}
                      </div>
                    )}
                  </div>
                  <div className="text-right hidden xl:block">
                    <div className="text-xs text-gray-500 font-medium">المفضلة</div>
                    <div className="text-lg font-bold text-ajwaak-primary">{wishlistCount} منتج</div>
                  </div>
                </div>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="group flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-r from-ajwaak-cream to-ajwaak-light rounded-2xl border-2 border-ajwaak-primary/20 hover:border-ajwaak-gold/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-right hidden xl:block">
                    <div className="text-xs text-gray-500 font-medium">حسابي</div>
                    <div className="text-lg font-bold text-ajwaak-primary">
                      {isCustomerLoggedIn ? customerName.split(' ')[0] : 'دخول'}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-ajwaak-primary/20 py-3 z-50">
                    {isCustomerLoggedIn ? (
                      <>
                        <div className="px-6 py-3 border-b border-ajwaak-primary/10">
                          <p className="text-lg font-bold text-ajwaak-dark">{customerName}</p>
                          <p className="text-sm text-ajwaak-secondary">عضو مميز في أجواك</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-6 py-3 text-ajwaak-dark hover:bg-ajwaak-cream transition-colors font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          الملف الشخصي
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-6 py-3 text-ajwaak-dark hover:bg-ajwaak-cream transition-colors font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          طلباتي
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-right px-6 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          تسجيل الخروج
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/sign-in"
                          className="block px-6 py-3 text-ajwaak-dark hover:bg-ajwaak-cream transition-colors font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          تسجيل الدخول
                        </Link>
                        <Link
                          to="/sign-up"
                          className="block px-6 py-3 text-ajwaak-dark hover:bg-ajwaak-cream transition-colors font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          إنشاء حساب جديد
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center border-t border-ajwaak-primary/10 py-4">
            <div className="flex items-center gap-10">
              <Link
                to="/"
                className={`text-lg font-bold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/' ? 'text-ajwaak-primary' : 'text-ajwaak-dark'
                }`}
              >
                الرئيسية
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-ajwaak-primary to-ajwaak-gold transition-all duration-300 group-hover:w-full rounded-full"></div>
              </Link>
              <Link
                to="/products"
                className={`text-lg font-bold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/products' ? 'text-ajwaak-primary' : 'text-ajwaak-dark'
                }`}
              >
                جميع العطور
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-ajwaak-primary to-ajwaak-gold transition-all duration-300 group-hover:w-full rounded-full"></div>
              </Link>
              <Link
                to="/categories"
                className={`text-lg font-bold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/categories' ? 'text-ajwaak-primary' : 'text-ajwaak-dark'
                }`}
              >
                أقسام العطور
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-ajwaak-primary to-ajwaak-gold transition-all duration-300 group-hover:w-full rounded-full"></div>
              </Link>
              <Link
                to="/offers"
                className={`text-lg font-bold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/offers' ? 'text-ajwaak-primary' : 'text-ajwaak-dark'
                }`}
              >
                العروض الخاصة
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-ajwaak-primary to-ajwaak-gold transition-all duration-300 group-hover:w-full rounded-full"></div>
              </Link>
              <Link
                to="/about"
                className={`text-lg font-bold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/about' ? 'text-ajwaak-primary' : 'text-ajwaak-dark'
                }`}
              >
                من نحن
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-ajwaak-primary to-ajwaak-gold transition-all duration-300 group-hover:w-full rounded-full"></div>
              </Link>
              <Link
                to="/contact"
                className={`text-lg font-bold transition-all duration-300 hover:text-ajwaak-primary relative group ${
                  location.pathname === '/contact' ? 'text-ajwaak-primary' : 'text-ajwaak-dark'
                }`}
              >
                تواصل معنا
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-ajwaak-primary to-ajwaak-gold transition-all duration-300 group-hover:w-full rounded-full"></div>
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-ajwaak-primary/10 shadow-2xl">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن العطور..."
                  className="w-full px-4 py-3 pr-10 border-2 border-ajwaak-primary/20 rounded-xl focus:ring-2 focus:ring-ajwaak-gold/20 focus:border-ajwaak-primary bg-gradient-to-r from-white to-ajwaak-cream/30 font-medium placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary rounded-lg flex items-center justify-center text-white"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Mobile Menu Links */}
              <div className="space-y-2">
                <Link
                  to="/"
                  className={`block px-4 py-3 rounded-xl font-bold transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary text-white' 
                      : 'text-ajwaak-dark hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  الرئيسية
                </Link>
                <Link
                  to="/products"
                  className={`block px-4 py-3 rounded-xl font-bold transition-colors ${
                    location.pathname === '/products' 
                      ? 'bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary text-white' 
                      : 'text-ajwaak-dark hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  جميع العطور
                </Link>
                <Link
                  to="/categories"
                  className={`block px-4 py-3 rounded-xl font-bold transition-colors ${
                    location.pathname === '/categories' 
                      ? 'bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary text-white' 
                      : 'text-ajwaak-dark hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  أقسام العطور
                </Link>
                <Link
                  to="/offers"
                  className={`block px-4 py-3 rounded-xl font-bold transition-colors ${
                    location.pathname === '/offers' 
                      ? 'bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary text-white' 
                      : 'text-ajwaak-dark hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  العروض الخاصة
                </Link>
                <Link
                  to="/wishlist"
                  className={`sm:hidden block px-4 py-3 rounded-xl font-bold transition-colors ${
                    location.pathname === '/wishlist' 
                      ? 'bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary text-white' 
                      : 'text-ajwaak-dark hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  المفضلة ({wishlistCount})
                </Link>
                <Link
                  to="/about"
                  className={`block px-4 py-3 rounded-xl font-bold transition-colors ${
                    location.pathname === '/about' 
                      ? 'bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary text-white' 
                      : 'text-ajwaak-dark hover:bg-ajwaak-cream hover:text-ajwaak-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  من نحن
                </Link>
                <Link
                  to="/contact"
                  className={`block px-4 py-3 rounded-xl font-bold transition-colors ${
                    location.pathname === '/contact' 
                      ? 'bg-gradient-to-r from-ajwaak-primary to-ajwaak-secondary text-white' 
                      : 'text-ajwaak-dark hover:bg-ajwaak-cream hover:text-ajwaak-primary'
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