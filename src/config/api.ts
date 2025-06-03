// API Configuration for different environments
export const API_CONFIG = {
  // للتطوير المحلي
  development: {
    baseURL: 'http://localhost:3001',
  },
  // للإنتاج - PRODUCTION READY 🚀
  production: {
    baseURL: 'https://perb.onrender.com', // الـ URL الأساسي
    fallback: 'https://perb-backend-api.vercel.app', // backup إذا كان متاح
  }
};

// الحصول على الـ base URL حسب البيئة مع نظام fallback
export const getApiBaseUrl = (): string => {
  // أولاً: تحقق من Environment Variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // ثانياً: تحقق من البيئة
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return API_CONFIG.development.baseURL;
  } else {
    // في Production، استخدم الـ URL الأساسي
    return API_CONFIG.production.baseURL;
  }
};

// دالة مساعدة لبناء URL كامل
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  // إزالة الـ slash الأول من endpoint إذا كان موجود
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // إزالة api/ إذا كانت موجودة في endpoint لأنها ستضاف تلقائياً
  const finalEndpoint = cleanEndpoint.startsWith('api/') ? cleanEndpoint.slice(4) : cleanEndpoint;
  return `${baseUrl}/api/${finalEndpoint}`;
};

// دالة مساعدة لبناء URL الصور - محدثة
export const buildImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder-image.png';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:image/')) return imagePath;
  
  const baseUrl = getApiBaseUrl();
  
  // إذا كان المسار يبدأ بـ /images/ فهو مسار نسبي من الباك إند
  if (imagePath.startsWith('/images/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // إذا كان المسار يبدأ بـ images/ بدون slash
  if (imagePath.startsWith('images/')) {
    return `${baseUrl}/${imagePath}`;
  }
  
  // إذا كان مسار عادي، أضف /images/ قبله
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}/images${cleanPath}`;
};

// دالة محسنة مع retry logic - مع نظام fallback ذكي
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = buildApiUrl(endpoint);
  
  console.log(`🔗 API Call: ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // إضافة timeout
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    });
    
    console.log(`📡 API Response: ${response.status} ${response.statusText}`);
    
    // إذا لم تكن الاستجابة ناجحة
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      
      console.error(`❌ API Error ${response.status}:`, errorData);
      
      // إنشاء خطأ مفصل مع معلومات إضافية
      const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      (error as any).status = response.status;
      (error as any).statusText = response.statusText;
      (error as any).url = url;
      (error as any).data = errorData;
      
      throw error;
    }
    
    const data = await response.json();
    console.log(`✅ API Success:`, data.length ? `${data.length} items` : 'Data received');
    return data;
  } catch (error) {
    console.error('❌ API Call Failed:', error);
    console.error('Failed URL:', url);
    
    // في حالة فشل الاتصال، اعرض خطأ واضح
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : '';
    
    // أخطاء الشبكة والاتصال
    if (errorName === 'TimeoutError' || 
        errorName === 'AbortError' ||
        errorMessage.includes('net::ERR_FAILED') || 
        errorMessage.includes('fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('Failed to fetch')) {
      
      console.error('🚫 Network Error: Backend غير متاح أو غير قابل للوصول');
      console.error('📍 Backend URL:', getApiBaseUrl());
      console.error('🔧 تأكد من تشغيل Backend على:', 'http://localhost:3001');
      
      // إنشاء خطأ شبكة واضح مع معلومات للمستخدم
      const networkError = new Error('🚫 الخادم غير متاح حالياً. يرجى التأكد من تشغيل الخادم والمحاولة مرة أخرى.');
      (networkError as any).status = 0;
      (networkError as any).isNetworkError = true;
      (networkError as any).originalError = error;
      (networkError as any).userMessage = 'الخادم غير متاح حالياً';
      (networkError as any).technicalDetails = `تعذر الاتصال بـ ${getApiBaseUrl()}`;
      throw networkError;
    }
    
    // إضافة معلومات إضافية للخطأ إذا لم تكن موجودة
    if (error instanceof Error && !(error as any).status) {
      if (errorMessage.includes('400')) {
        (error as any).status = 400;
      } else if (errorMessage.includes('401')) {
        (error as any).status = 401;
      } else if (errorMessage.includes('403')) {
        (error as any).status = 403;
      } else if (errorMessage.includes('404')) {
        (error as any).status = 404;
      } else if (errorMessage.includes('409')) {
        (error as any).status = 409;
      } else if (errorMessage.includes('422')) {
        (error as any).status = 422;
      } else if (errorMessage.includes('429')) {
        (error as any).status = 429;
      } else if (errorMessage.includes('500')) {
        (error as any).status = 500;
      }
    }
    
    throw error;
  }
};

// دالة مساعدة للتحقق من حالة الخادم
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    await apiCall(API_ENDPOINTS.HEALTH);
    return true;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

// دالة آمنة لجلب البيانات مع معالجة الأخطاء
export const safeApiCall = async <T>(
  endpoint: string, 
  options: RequestInit = {},
  fallbackData: T | null = null
): Promise<{ data: T | null; error: string | null; isServerDown: boolean }> => {
  try {
    const data = await apiCall(endpoint, options);
    return { data, error: null, isServerDown: false };
  } catch (error: any) {
    const isServerDown = error.isNetworkError || error.status === 0;
    const errorMessage = error.userMessage || error.message || 'حدث خطأ غير متوقع';
    
    return { 
      data: fallbackData, 
      error: errorMessage, 
      isServerDown 
    };
  }
};

// تصدير الثوابت المفيدة
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: 'products',
  PRODUCT_BY_ID: (id: string | number) => `products/${id}`,
  PRODUCTS_BY_CATEGORY: (categoryId: string | number) => `products/category/${categoryId}`,
  PRODUCT_REVIEWS: (id: string | number) => `products/${id}/reviews`,
  PRODUCT_DEFAULT_OPTIONS: (productType: string) => `products/default-options/${encodeURIComponent(productType)}`,
  
  // Categories
  CATEGORIES: 'categories',
  CATEGORY_BY_ID: (id: string | number) => `categories/${id}`,
  
  // Cart
  USER_CART: (userId: string | number) => `user/${userId}/cart`,
  CART_UPDATE_OPTIONS: (userId: string | number) => `user/${userId}/cart/update-options`,
  CART_PRODUCT: (userId: string | number, productId: string | number) => `user/${userId}/cart/product/${productId}`,
  
  // Wishlist
  USER_WISHLIST: (userId: string | number) => `user/${userId}/wishlist`,
  WISHLIST_CHECK: (userId: string | number, productId: string | number) => `user/${userId}/wishlist/check/${productId}`,
  WISHLIST_PRODUCT: (userId: string | number, productId: string | number) => `user/${userId}/wishlist/product/${productId}`,
  
  // Orders
  CHECKOUT: 'checkout',
  ORDERS: 'orders',
  ORDER_BY_ID: (id: string | number) => `orders/${id}`,
  ORDER_STATUS: (id: string | number) => `orders/${id}/status`,
  
  // Auth
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  CHANGE_PASSWORD: 'auth/change-password',
  
  // Customer Authentication
  CUSTOMER_LOGIN: 'auth/customer/login',
  CUSTOMER_REGISTER: 'auth/customer/register',
  
  // Coupons
  COUPONS: 'coupons',
  VALIDATE_COUPON: 'coupons/validate',
  COUPON_BY_ID: (id: string | number) => `coupons/${id}`,
  
  // Customers
  CUSTOMERS: 'customers',
  CUSTOMER_STATS: 'customers/stats',
  CUSTOMER_BY_ID: (id: string | number) => `customers/${id}`,
  
  // Health Check
  HEALTH: 'health',
  
  // Services (if needed)
  SERVICES: 'services',
  SERVICE_BY_ID: (id: string | number) => `services/${id}`,
}; 