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
      {/* Simple Clean Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Simple Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="text-2xl font-black text-ajwaak-primary arabic-title">
                أجواك - AJWAAK
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                to="/"
                className={`text-lg font-semibold transition-colors ${
                  location.pathname === '/' ? 'text-ajwaak-primary' : 'text-gray-700 hover:text-ajwaak-primary'
                }`}
              >
                الرئيسية
              </Link>
              <Link
                to="/products"
                className={`text-lg font-semibold transition-colors ${
                  location.pathname === '/products' ? 'text-ajwaak-primary' : 'text-gray-700 hover:text-ajwaak-primary'
                }`}
              >
                المنتجات
              </Link>
              <Link
                to="/categories"
                className={`text-lg font-semibold transition-colors ${
                  location.pathname === '/categories' ? 'text-ajwaak-primary' : 'text-gray-700 hover:text-ajwaak-primary'
                }`}
              >
                الأقسام
              </Link>
              <Link
                to="/about"
                className={`text-lg font-semibold transition-colors ${
                  location.pathname === '/about' ? 'text-ajwaak-primary' : 'text-gray-700 hover:text-ajwaak-primary'
                }`}
              >
                من نحن
              </Link>
              <Link
                to="/contact"
                className={`text-lg font-semibold transition-colors ${
                  location.pathname === '/contact' ? 'text-ajwaak-primary' : 'text-gray-700 hover:text-ajwaak-primary'
                }`}
              >
                اتصل بنا
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث..."
                    className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajwaak-primary/20 focus:border-ajwaak-primary"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ajwaak-primary"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-ajwaak-primary">
                <ShoppingCart className="w-6 h-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ajwaak-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-ajwaak-primary hidden sm:block">
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ajwaak-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-gray-600 hover:text-ajwaak-primary"
                >
                  <User className="w-6 h-6" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {isCustomerLoggedIn ? (
                      <>
                        <div className="px-4 py-2 border-b">
                          <p className="font-semibold text-gray-800">{customerName}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          الملف الشخصي
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          طلباتي
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          تسجيل الخروج
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/sign-in"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          تسجيل الدخول
                        </Link>
                        <Link
                          to="/sign-up"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
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
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>

              <Link
                to="/"
                className={`block px-4 py-2 rounded-lg ${
                  location.pathname === '/' ? 'bg-ajwaak-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                to="/products"
                className={`block px-4 py-2 rounded-lg ${
                  location.pathname === '/products' ? 'bg-ajwaak-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                المنتجات
              </Link>
              <Link
                to="/categories"
                className={`block px-4 py-2 rounded-lg ${
                  location.pathname === '/categories' ? 'bg-ajwaak-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                الأقسام
              </Link>
              <Link
                to="/wishlist"
                className={`sm:hidden block px-4 py-2 rounded-lg ${
                  location.pathname === '/wishlist' ? 'bg-ajwaak-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                المفضلة ({wishlistCount})
              </Link>
              <Link
                to="/about"
                className={`block px-4 py-2 rounded-lg ${
                  location.pathname === '/about' ? 'bg-ajwaak-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                من نحن
              </Link>
              <Link
                to="/contact"
                className={`block px-4 py-2 rounded-lg ${
                  location.pathname === '/contact' ? 'bg-ajwaak-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;