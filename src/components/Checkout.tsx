import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingCart, User, CreditCard, CheckCircle, ArrowLeft, ArrowRight, Package, Truck, Shield, Star, Heart, Gift, MapPin, Phone, Mail, Sparkles, Clock, Award, AlertCircle, Minus, Plus, X, Tag, Percent } from 'lucide-react';
import { apiCall, API_ENDPOINTS, buildImageUrl } from '../config/api';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId?: number | null;
  productType?: string;
  dynamicOptions?: any[];
  mainImage: string;
  detailedImages?: string[];
  specifications?: { name: string; value: string }[];
  createdAt?: string;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product?: Product;
  selectedOptions?: { [key: string]: string };
  optionsPricing?: { [key: string]: number };
  attachments?: {
    images?: string[];
    text?: string;
  };
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  couponCode: string;
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cod');
  const [loading, setLoading] = useState<boolean>(true);
  const [placing, setPlacing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponValidating, setCouponValidating] = useState<boolean>(false);
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState<OrderData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cash',
    couponCode: ''
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cod',
      name: 'الدفع عند الاستلام',
      icon: '💵',
      description: 'ادفع نقداً عند وصول طلبك إليك'
    },
    {
      id: 'bank',
      name: 'تحويل بنكي',
      icon: '🏦',
      description: 'حوّل المبلغ مباشرة لحسابنا البنكي'
    },
    {
      id: 'card',
      name: 'بطاقة ائتمانية/مدى',
      icon: '💳',
      description: 'ادفع بآمان عبر بوابة الدفع الإلكتروني'
    },
    {
      id: 'wallet',
      name: 'المحافظ الإلكترونية',
      icon: '📱',
      description: 'ادفع عبر STC Pay أو مدى الرقمي'
    }
  ];

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        setCartItems([]);
        return;
      }

      const user = JSON.parse(userData);
      console.log('🛒 [Checkout] Fetching cart for user:', user.id);
      
      const data = await apiCall(API_ENDPOINTS.USER_CART(user.id));
      console.log('📦 [Checkout] Raw cart data:', data);
      
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          console.log(`🛒 [Checkout] Item ${index + 1}:`, {
            id: item.id,
            productId: item.productId,
            productName: item.product?.name,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions,
            optionsPricing: item.optionsPricing,
            attachments: item.attachments
          });
          
          if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
            console.log(`✅ [Checkout] Item ${item.id} has selectedOptions:`, item.selectedOptions);
          } else {
            console.log(`❌ [Checkout] Item ${item.id} has NO selectedOptions!`);
          }
        });
        setCartItems(data);
      } else {
        console.log('❌ [Checkout] Invalid cart data format:', data);
        setCartItems([]);
      }
    } catch (error) {
      console.error('❌ [Checkout] Error fetching cart:', error);
      toast.error('فشل في تحميل السلة');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // تحميل بيانات المستخدم المحفوظة من Sign-up
  useEffect(() => {
    const loadCustomerData = () => {
      try {
        // محاولة تحميل البيانات من userCheckoutData أولاً (محفوظة من Sign-up)
        const checkoutData = localStorage.getItem('userCheckoutData');
        if (checkoutData) {
          const data = JSON.parse(checkoutData);
          console.log('💾 Loading customer data from checkout cache:', data);
          
          setCustomerInfo(prev => ({
            ...prev,
            name: data.name || prev.name,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            city: data.city || prev.city
          }));
          
          toast.success('✨ تم تحميل بياناتك تلقائياً!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            style: {
              background: '#10B981',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }
          });
          
          return;
        }

        // إذا لم توجد بيانات الـ checkout، جرب من بيانات المستخدم العادية
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          console.log('👤 Loading customer data from user cache:', user);
          
          setCustomerInfo(prev => ({
            ...prev,
            name: user.name || prev.name,
            phone: user.phone || prev.phone,
            email: user.email || prev.email,
            city: user.city || prev.city
          }));
        }
      } catch (error) {
        console.error('❌ Error loading customer data:', error);
      }
    };

    loadCustomerData();
  }, []);

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.product && item.product.originalPrice && item.product.originalPrice > item.product.price) {
        const savings = (item.product.originalPrice - item.product.price) * item.quantity;
        return total + savings;
      }
      return total;
    }, 0);
  };

  const getOriginalTotal = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.product?.originalPrice || item.product?.price || 0;
      return total + (originalPrice * item.quantity);
    }, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product ? item.product.price * item.quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getShippingCost = () => {
    const total = getTotalPrice();
    return total >= 100 ? 0 : 15;
  };

  const getDiscountAmount = () => {
    return appliedCoupon ? appliedCoupon.discountAmount : 0;
  };

  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const shipping = getShippingCost();
    const discount = getDiscountAmount();
    return Math.max(0, subtotal + shipping - discount);
  };

  const formatOptionName = (optionName: string): string => {
    const optionNames: { [key: string]: string } = {
      nameOnSash: 'الاسم على الوشاح',
      embroideryColor: 'لون التطريز',
      capFabric: 'قماش الكاب',
      size: 'المقاس',
      color: 'اللون',
      capColor: 'لون الكاب',
      dandoshColor: 'لون الدندوش',
      fabric: 'نوع القماش',
      length: 'الطول',
      width: 'العرض'
    };
    return optionNames[optionName] || optionName;
  };

  const validateCoupon = async (code: string) => {
    try {
      setCouponValidating(true);
      const data = await apiCall(API_ENDPOINTS.VALIDATE_COUPON, {
        method: 'POST',
        body: JSON.stringify({ code, orderTotal: getTotalPrice() + getShippingCost() })
      });

      if (data.valid) {
        setAppliedCoupon(data.coupon);
        toast.success(`تم تطبيق كود الخصم! خصم ${data.discount} ر.س`);
      } else {
        toast.error(data.message || 'كود الخصم غير صحيح');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('فشل في التحقق من كود الخصم');
    } finally {
      setCouponValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('💔 تم إلغاء الكوبون');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return cartItems.length > 0;
      case 2:
        return !!(customerInfo.name && customerInfo.phone && customerInfo.address && customerInfo.city);
      case 3:
        return !!selectedPaymentMethod;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      if (currentStep === 1) {
        toast.error('سلة التسوق فارغة!');
      } else if (currentStep === 2) {
        toast.error('يرجى ملء جميع البيانات المطلوبة');
      } else if (currentStep === 3) {
        toast.error('يرجى اختيار طريقة الدفع');
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2) || !validateStep(3)) {
      toast.error('يرجى ملء جميع البيانات المطلوبة');
      return;
    }

    setPlacing(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً');
        navigate('/');
        return;
      }

      const user = JSON.parse(userData);
      if (!user || !user.id) {
        toast.error('يجب تسجيل الدخول أولاً');
        navigate('/');
        return;
      }

      // معالجة الدفع أولاً إذا كان مطلوباً
      const paymentResult = await processPayment({});
      if (!paymentResult.success) {
        throw new Error('فشل في معالجة الدفع');
      }

      // إنشاء بيانات الطلب بالتنسيق الصحيح الذي يتوقعه الباك إند
      const orderPayload = {
        items: cartItems.map(item => {
          // حساب السعر مع الإضافات
          const basePrice = item.product?.price || 0;
          const optionsPrice = item.optionsPricing ? 
            Object.values(item.optionsPricing).reduce((sum, price) => sum + (price || 0), 0) : 0;
          const totalItemPrice = (basePrice + optionsPrice) * item.quantity;

          return {
            productId: item.productId,
            productName: item.product?.name || 'منتج غير معروف',
            price: basePrice,
            quantity: item.quantity,
            totalPrice: totalItemPrice,
            selectedOptions: item.selectedOptions || {},
            optionsPricing: item.optionsPricing || {},
            productImage: item.product?.mainImage || '',
            attachments: item.attachments || {},
            productType: item.product?.productType || ''
          };
        }),
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          notes: customerInfo.notes || ''
        },
        paymentMethod: selectedPaymentMethod,
        total: getFinalTotal(),
        subtotal: getTotalPrice(),
        deliveryFee: getShippingCost(),
        couponDiscount: getDiscountAmount(),
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.coupon?.code || '',
          discount: getDiscountAmount()
        } : null,
        userId: user.id,
        // إضافة معرف الدفع إذا كان متوفراً
        ...(paymentResult.paymentId && { 
          paymentId: paymentResult.paymentId,
          paymentStatus: 'paid'
        }),
        ...(!paymentResult.paymentId && { 
          paymentStatus: 'pending'
        })
      };

      console.log('🛒 Placing order with payload:', orderPayload);
      
      const result = await apiCall(API_ENDPOINTS.CHECKOUT, {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      console.log('✅ Order result:', result);

      if (!result || !result.orderId) {
        throw new Error(result?.message || 'فشل في إتمام الطلب');
      }

      // تحضير بيانات الطلب لصفحة Thank You - مع كامل التفاصيل
      const thankYouOrder = {
        id: result.orderId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        items: cartItems.map(item => {
          // حساب السعر مع الإضافات لعرضه في Thank You
          const basePrice = item.product?.price || 0;
          const optionsPrice = item.optionsPricing ? 
            Object.values(item.optionsPricing).reduce((sum, price) => sum + (price || 0), 0) : 0;
          
          return {
            id: item.product?.id || item.productId,
            name: item.product?.name || 'منتج غير معروف',
            price: basePrice,
            quantity: item.quantity,
            mainImage: item.product?.mainImage || '',
            selectedOptions: item.selectedOptions || {},
            optionsPricing: item.optionsPricing || {},
            attachments: item.attachments || {},
            productType: item.product?.productType || '',
            totalPrice: (basePrice + optionsPrice) * item.quantity
          };
        }),
        totalAmount: getTotalPrice(),
        couponDiscount: getDiscountAmount(),
        deliveryFee: getShippingCost(),
        finalAmount: getFinalTotal(),
        paymentMethod: paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name || 'الدفع عند الاستلام',
        notes: customerInfo.notes || '',
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      // حفظ البيانات في localStorage أولاً
      localStorage.setItem('thankYouOrder', JSON.stringify(thankYouOrder));
      localStorage.setItem('lastOrderId', thankYouOrder.id.toString());
      
      // عرض رسالة نجاح
      toast.success('🎉 تم إرسال طلبك بنجاح! جاري التوجيه...', {
        position: "top-center",
        autoClose: 2000,
      });

      console.log('💾 Order data saved to localStorage:', thankYouOrder);

      // التوجيه المباشر بدون setTimeout
      try {
        // مسح السلة أولاً
        await apiCall(API_ENDPOINTS.USER_CART(user.id), {
          method: 'DELETE'
        });
        window.dispatchEvent(new Event('cartUpdated'));
        console.log('🧹 Cart cleared successfully');
        
        // التوجيه المباشر لصفحة Thank You
        console.log('🔄 Navigating to Thank You page...');
        navigate('/thank-you', { 
          state: { order: thankYouOrder },
          replace: true 
        });
        console.log('✅ Navigation completed successfully');
      } catch (error) {
        console.error('❌ Error during cleanup/navigation:', error);
        // في حالة الخطأ، استخدم window.location بعد delay قصير
        setTimeout(() => {
          console.log('🔄 Using window.location fallback...');
          window.location.href = '/thank-you';
        }, 1000);
      }

    } catch (error) {
      console.error('💥 Error placing order:', error);
      const errorMessage = error instanceof Error ? error.message : 'فشل في إتمام الطلب. حاول مرة أخرى';
      toast.error(errorMessage);
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentMethodSelection = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    
    // إظهار معلومات إضافية حسب طريقة الدفع
    if (methodId === 'bank') {
      toast.info('💡 سيتم إرسال تفاصيل الحساب البنكي عبر الإيميل بعد تأكيد الطلب');
    } else if (methodId === 'card' || methodId === 'wallet') {
      toast.info('🔒 سيتم توجيهك لبوابة الدفع الآمنة لإتمام عملية الدفع');
    } else if (methodId === 'cod') {
      toast.success('✅ ممتاز! يمكنك الدفع نقداً عند استلام طلبك');
    }
  };

  const processPayment = async (orderData: any) => {
    // معالجة الدفع حسب الطريقة المختارة
    if (selectedPaymentMethod === 'card' || selectedPaymentMethod === 'wallet') {
      // هنا يمكن إضافة تكامل مع بوابة الدفع
      console.log('🏧 Processing electronic payment...');
      
      // محاكاة بوابة الدفع
      const confirmPayment = window.confirm(
        `هل تريد المتابعة للدفع الإلكتروني؟\n` +
        `المبلغ: ${getFinalTotal().toFixed(2)} ر.س\n` +
        `طريقة الدفع: ${paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name}`
      );
      
      if (!confirmPayment) {
        throw new Error('تم إلغاء عملية الدفع');
      }
      
      // محاكاة نجاح الدفع
      toast.success('✅ تم الدفع بنجاح! جاري إنشاء طلبك...');
      return { success: true, paymentId: 'PAY_' + Date.now() };
    }
    
    // للطرق الأخرى (COD, Bank Transfer)
    return { success: true, paymentId: null };
  };

  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-pulse { animation: pulse 2s infinite; }
    .animate-fade-in { animation: fadeIn 0.6s ease forwards; }
    .animate-slide-in { animation: slideIn 0.6s ease forwards; }
    .shimmer-effect::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: shimmer 2s infinite;
    }
    .glass-effect {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    .gradient-border {
      background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #000000, #1f2937) border-box;
      border: 2px solid transparent;
    }
  `;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <style>{animationStyles}</style>
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="animate-float">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent mb-2">
              جاري تحضير طلبك...
            </h2>
            <p className="text-gray-600">نقوم بتجهيز كل ما تحتاجه</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
        <style>{animationStyles}</style>
        <div className="glass-effect rounded-3xl shadow-2xl p-12 text-center max-w-md mx-auto border-2 border-gray-900 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
            <ShoppingCart className="w-12 h-12 text-gray-900" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
              سلة التسوق فارغة
            </span>
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">أضف بعض المنتجات الرائعة إلى سلة التسوق أولاً</p>
          <button
            onClick={() => navigate('/products')}
            className="relative bg-gradient-to-r from-gray-900 to-black text-white px-10 py-4 rounded-2xl hover:from-black hover:to-gray-800 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              تسوق الآن
            </span>
            <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:-translate-x-0 transition-transform duration-500 shimmer-effect"></div>
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'مراجعة الطلب', icon: ShoppingCart, color: 'from-gray-900 to-black' },
    { number: 2, title: 'بيانات التوصيل', icon: MapPin, color: 'from-gray-900 to-black' },
    { number: 3, title: 'طريقة الدفع', icon: CreditCard, color: 'from-gray-900 to-black' },
    { number: 4, title: 'تأكيد الطلب', icon: CheckCircle, color: 'from-gray-900 to-black' }
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <style>{animationStyles}</style>
      
      {/* Header */}
      <div className="glass-effect shadow-lg border-b border-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-20 py-4 sm:py-0 gap-3 sm:gap-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              العودة للتسوق
            </button>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-gray-900 to-black rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-base sm:text-lg font-bold animate-float shadow-lg">
                🛒
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                  إتمام الطلب
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">خطوات قليلة وسيصلك طلبك</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12">
        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6 lg:mb-8 xl:mb-12 animate-fade-in">
          <div className="flex justify-center overflow-x-auto pb-2 sm:pb-4">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-6 min-w-max">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center animate-slide-in" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className={`flex flex-col items-center ${index > 0 ? 'mr-2 sm:mr-3 lg:mr-6' : ''}`}>
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-lg sm:rounded-xl lg:rounded-2xl xl:rounded-3xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-500 relative overflow-hidden ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-lg sm:shadow-xl scale-105 sm:scale-110' 
                          : isActive
                            ? `bg-gradient-to-r ${step.color} text-white shadow-lg sm:shadow-xl scale-110 sm:scale-125`
                            : 'bg-white text-gray-400 shadow-sm sm:shadow-md border border-gray-200 sm:border-2'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                        ) : (
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                        )}
                        {isActive && !isCompleted && (
                          <div className="absolute inset-0 bg-white/20 shimmer-effect rounded-lg sm:rounded-xl lg:rounded-2xl xl:rounded-3xl"></div>
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm mt-1 sm:mt-2 lg:mt-4 font-bold text-center max-w-12 sm:max-w-16 lg:max-w-20 xl:max-w-24 leading-tight transition-colors duration-300 ${
                        isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 sm:w-12 md:w-16 lg:w-20 xl:w-24 h-1 sm:h-1.5 lg:h-2 rounded-full transition-all duration-700 ${
                        currentStep > step.number 
                          ? 'bg-gradient-to-r from-gray-900 to-black shadow-sm sm:shadow-lg' 
                          : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl border border-gray-200 sm:border-2 sm:border-gray-900 overflow-hidden animate-fade-in">
              <div className={`bg-gradient-to-r ${steps[currentStep - 1]?.color || 'from-gray-900 to-black'} px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 sm:-translate-y-10 sm:translate-x-10 md:-translate-y-12 md:translate-x-12 lg:-translate-y-16 lg:translate-x-16 animate-float"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/10 rounded-full translate-y-6 -translate-x-6 sm:translate-y-8 sm:-translate-x-8 md:translate-y-10 md:-translate-x-10 lg:translate-y-12 lg:-translate-x-12 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 text-white relative z-10">
                  {(() => {
                    const Icon = steps[currentStep - 1]?.icon || ShoppingCart;
                    return (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white/20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
                      </div>
                    );
                  })()}
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1 lg:mb-2">{steps[currentStep - 1]?.title}</h2>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg">الخطوة {currentStep} من {steps.length}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
                {/* Step 1: Order Review */}
                {currentStep === 1 && (
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6 animate-fade-in">
                    {cartItems.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center glass-effect rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 sm:border-2 sm:border-gray-900 hover:border-gray-300 sm:hover:border-gray-800 hover:shadow-lg sm:hover:shadow-xl transition-all duration-500 animate-slide-in gap-3 sm:gap-4"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={buildImageUrl(item.product?.mainImage || '')}
                            alt={item.product?.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-lg sm:rounded-xl lg:rounded-2xl ml-0 sm:ml-4 lg:ml-6 shadow-md sm:shadow-lg transition-transform duration-300 hover:scale-105 sm:hover:scale-110"
                          />
                          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 lg:-top-3 lg:-right-3 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-gray-900 to-black text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-md sm:shadow-lg">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 mb-2 sm:mb-3 hover:text-gray-900 transition-colors duration-300 line-clamp-2">
                            {item.product?.name}
                          </h3>
                          
                          {/* المواصفات المختارة - مصغرة للموبايل */}
                          {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                            <div className="mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-blue-200">
                              <p className="text-xs sm:text-sm font-bold text-blue-700 mb-1 sm:mb-2 flex items-center">
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                                المواصفات:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                {Object.entries(item.selectedOptions).map(([optionName, value]) => (
                                  <div key={optionName} className="bg-white p-1.5 sm:p-2 rounded-md sm:rounded-lg border border-blue-100">
                                    <p className="text-xs text-gray-600">{formatOptionName(optionName)}</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                                      {value}
                                      {item.optionsPricing?.[optionName] && item.optionsPricing[optionName] > 0 && (
                                        <span className="text-green-600 text-xs mr-1">
                                          (+{item.optionsPricing[optionName]} ر.س)
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* المرفقات - مصغرة للموبايل */}
                          {item.attachments && (item.attachments.text || (item.attachments.images && item.attachments.images.length > 0)) && (
                            <div className="mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-purple-50 to-pink-50 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-purple-200">
                              <p className="text-xs sm:text-sm font-bold text-purple-700 mb-1 sm:mb-2 flex items-center">
                                <span className="ml-1">📎</span>
                                المرفقات:
                              </p>
                              
                              {item.attachments.text && (
                                <div className="mb-1 sm:mb-2">
                                  <div className="bg-white p-2 sm:p-3 rounded-md sm:rounded-lg border border-purple-100">
                                    <p className="text-xs text-gray-600 mb-1">📝 ملاحظات:</p>
                                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed line-clamp-2">
                                      {item.attachments.text}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {item.attachments.images && item.attachments.images.length > 0 && (
                                <div className="bg-white p-2 sm:p-3 rounded-md sm:rounded-lg border border-purple-100">
                                  <p className="text-xs text-gray-600 mb-1">🖼️ صور:</p>
                                  <p className="text-xs sm:text-sm font-semibold text-purple-700">
                                    {item.attachments.images.length} صورة
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                            <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
                              <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-900" />
                              <span className="font-semibold text-xs sm:text-sm">الكمية: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-full sm:w-auto text-left sm:text-right">
                          <div>
                            {/* عرض سعر الخصم إذا كان موجود */}
                            {item.product?.originalPrice && item.product.originalPrice > item.product.price && (
                              <div className="mb-1 sm:mb-2">
                                <div className="flex items-center justify-start sm:justify-end gap-1 sm:gap-2 mb-1">
                                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                                    {(item.product.originalPrice * item.quantity).toFixed(2)} ر.س
                                  </span>
                                  <span className="bg-red-500 text-white px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-bold">
                                    -{Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}%
                                  </span>
                                </div>
                                <p className="text-green-600 text-xs font-bold">
                                  💰 وفرت {((item.product.originalPrice - item.product.price) * item.quantity).toFixed(2)} ر.س
                                </p>
                              </div>
                            )}
                            
                            {/* السعر الحالي */}
                            <span className="font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                              {((item.product?.price || 0) * item.quantity).toFixed(2)} ر.س
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 2: Delivery Information */}
                {currentStep === 2 && (
                  <div className="space-y-10 animate-fade-in">
                    {/* Data Source Indicator */}
                    {(customerInfo.name || customerInfo.phone || customerInfo.email || customerInfo.city) && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6 animate-slide-in">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-green-800 text-sm">✨ تم تحميل بياناتك تلقائياً!</h3>
                            <p className="text-green-600 text-xs mt-1">تم ملء البيانات من ملفك الشخصي لتوفير الوقت. يمكنك تعديلها إذا أردت.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="animate-slide-in" style={{ animationDelay: '100ms' }}>
                        <label className="flex items-center gap-3 text-sm font-bold text-gray-700 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-black rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          الاسم الكامل *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          className="w-full p-5 border-2 border-gray-900 rounded-2xl focus:ring-4 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-300 text-lg glass-effect"
                          placeholder="أدخل اسمك الكامل"
                          required
                        />
                      </div>
                      <div className="animate-slide-in" style={{ animationDelay: '200ms' }}>
                        <label className="flex items-center gap-3 text-sm font-bold text-gray-700 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-black rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-white" />
                          </div>
                          رقم الهاتف *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          className="w-full p-5 border-2 border-gray-900 rounded-2xl focus:ring-4 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-300 text-lg glass-effect"
                          placeholder="05xxxxxxxx"
                          required
                        />
                      </div>
                      <div className="animate-slide-in" style={{ animationDelay: '300ms' }}>
                        <label className="flex items-center gap-3 text-sm font-bold text-gray-700 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-black rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-white" />
                          </div>
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          className="w-full p-5 border-2 border-gray-900 rounded-2xl focus:ring-4 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-300 text-lg glass-effect"
                          placeholder="example@email.com"
                        />
                      </div>
                      <div className="animate-slide-in" style={{ animationDelay: '400ms' }}>
                        <label className="flex items-center gap-3 text-sm font-bold text-gray-700 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-black rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          المدينة *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          className="w-full p-5 border-2 border-gray-900 rounded-2xl focus:ring-4 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-300 text-lg glass-effect"
                          placeholder="الرياض، جدة، الدمام..."
                          required
                        />
                      </div>
                      <div className="md:col-span-2 animate-slide-in" style={{ animationDelay: '500ms' }}>
                        <label className="flex items-center gap-3 text-sm font-bold text-gray-700 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-black rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          العنوان التفصيلي *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          className="w-full p-5 border-2 border-gray-900 rounded-2xl focus:ring-4 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-300 text-lg glass-effect"
                          placeholder="اسم الحي، اسم الشارع، رقم المبنى..."
                          required
                        />
                      </div>
                      <div className="md:col-span-2 animate-slide-in" style={{ animationDelay: '600ms' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                          ملاحظات إضافية
                        </label>
                        <textarea
                          name="notes"
                          value={customerInfo.notes}
                          onChange={handleInputChange}
                          rows={5}
                          className="w-full p-5 border-2 border-gray-900 rounded-2xl focus:ring-4 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-300 resize-none text-lg glass-effect"
                          placeholder="أي ملاحظات خاصة بالتوصيل..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fade-in">
                    {paymentMethods.map((method, index) => (
                      <div
                        key={method.id}
                        className={`border-3 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 animate-slide-in ${
                          selectedPaymentMethod === method.id
                            ? 'border-gray-900 bg-gradient-to-r from-gray-50 to-gray-100 shadow-2xl scale-105'
                            : 'border-gray-200 hover:border-gray-900 glass-effect'
                        }`}
                        style={{ animationDelay: `${index * 150}ms` }}
                        onClick={() => handlePaymentMethodSelection(method.id)}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="w-6 h-6 text-gray-900 ml-6 border-3 border-gray-900 focus:ring-gray-900 focus:ring-4"
                          />
                          <div className="flex items-center flex-1">
                            <span className="text-4xl ml-6">{method.icon}</span>
                            <div>
                              <h3 className="font-bold text-xl text-gray-800 mb-2">{method.name}</h3>
                              <p className="text-gray-600 text-lg">{method.description}</p>
                            </div>
                          </div>
                          {selectedPaymentMethod === method.id && (
                            <div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center justify-center animate-pulse">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <div className="space-y-10 animate-fade-in">
                    {/* Order Summary */}
                    <div className="glass-effect rounded-3xl p-8 border-2 border-gray-900 animate-slide-in">
                      <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-black rounded-xl flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        ملخص الطلب
                      </h3>
                      <div className="space-y-5">
                        {cartItems.map(item => (
                          <div key={item.id} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-900">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <span className="text-gray-700 font-semibold text-lg">{item.product?.name}</span>
                                <div className="text-sm text-gray-600 mt-1">الكمية: {item.quantity}</div>
                                
                                {/* المواصفات المختارة */}
                                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                  <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs font-bold text-blue-600 mb-2">🎨 المواصفات:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {Object.entries(item.selectedOptions).map(([optionName, value]) => (
                                        <div key={optionName} className="text-xs">
                                          <span className="text-gray-600">{formatOptionName(optionName)}:</span>
                                          <span className="font-semibold text-gray-800 mr-1">
                                            {value}
                                            {item.optionsPricing?.[optionName] && item.optionsPricing[optionName] > 0 && (
                                              <span className="text-green-600 text-xs mr-1">
                                                (+{item.optionsPricing[optionName]} ر.س)
                                              </span>
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* المرفقات */}
                                {item.attachments && (item.attachments.text || (item.attachments.images && item.attachments.images.length > 0)) && (
                                  <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs font-bold text-purple-600 mb-2">📎 المرفقات:</p>
                                    
                                    {item.attachments.text && (
                                      <div className="mb-2">
                                        <p className="text-xs text-gray-600">📝 ملاحظات:</p>
                                        <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded mt-1">
                                          {item.attachments.text.length > 100 
                                            ? `${item.attachments.text.substring(0, 100)}...` 
                                            : item.attachments.text
                                          }
                                        </p>
                                      </div>
                                    )}
                                    
                                    {item.attachments.images && item.attachments.images.length > 0 && (
                                      <div className="text-xs">
                                        <p className="text-gray-600">🖼️ صور مرفقة:</p>
                                        <p className="font-semibold text-purple-700">
                                          {item.attachments.images.length} صورة
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                {/* عرض سعر الخصم إذا كان موجود */}
                                {item.product?.originalPrice && item.product.originalPrice > item.product.price && (
                                  <div className="mb-2">
                                    <div className="flex items-center justify-end gap-2 mb-1">
                                      <span className="text-sm text-gray-400 line-through">
                                        {(item.product.originalPrice * item.quantity).toFixed(2)} ر.س
                                      </span>
                                      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                                        -{Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}%
                                      </span>
                                    </div>
                                    <p className="text-green-600 text-xs font-bold">
                                      💰 وفرت {((item.product.originalPrice - item.product.price) * item.quantity).toFixed(2)} ر.س
                                    </p>
                                  </div>
                                )}
                                
                                {/* السعر الحالي */}
                                <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                                  {((item.product?.price || 0) * item.quantity).toFixed(2)} ر.س
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="glass-effect rounded-3xl p-8 border-2 border-gray-900 animate-slide-in" style={{ animationDelay: '200ms' }}>
                      <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-black rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        بيانات التوصيل
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6 text-gray-700 text-lg">
                        <p><strong className="text-gray-800">الاسم:</strong> {customerInfo.name}</p>
                        <p><strong className="text-gray-800">الهاتف:</strong> {customerInfo.phone}</p>
                        <p><strong className="text-gray-800">المدينة:</strong> {customerInfo.city}</p>
                        <p className="md:col-span-2"><strong className="text-gray-800">العنوان:</strong> {customerInfo.address}</p>
                        {customerInfo.notes && <p className="md:col-span-2"><strong className="text-gray-800">ملاحظات:</strong> {customerInfo.notes}</p>}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="glass-effect rounded-3xl p-8 border-2 border-gray-900 animate-slide-in" style={{ animationDelay: '400ms' }}>
                      <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-black rounded-xl flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        طريقة الدفع
                      </h3>
                      <p className="text-gray-700 font-bold text-xl">
                        {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-16 pt-10 border-t-2 border-gray-900">
                  {currentStep > 1 ? (
                    <button
                      onClick={prevStep}
                      className="flex items-center gap-3 px-8 py-4 border-3 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <ArrowRight className="w-5 h-5" />
                      السابق
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  <div>
                    {currentStep < 4 ? (
                      <button
                        onClick={nextStep}
                        className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl hover:from-black hover:to-gray-800 font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 relative overflow-hidden"
                      >
                        <span className="relative z-10">التالي</span>
                        <ArrowLeft className="w-5 h-5 relative z-10" />
                        <div className="absolute inset-0 bg-white/20 transform translate-x-full hover:-translate-x-0 transition-transform duration-500 shimmer-effect"></div>
                      </button>
                    ) : (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl hover:from-black hover:to-gray-800 font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                      >
                        {placing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>جاري إرسال الطلب...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>تأكيد الطلب</span>
                          </>
                        )}
                        {!placing && (
                          <div className="absolute inset-0 bg-white/20 transform translate-x-full hover:-translate-x-0 transition-transform duration-500 shimmer-effect"></div>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-3xl shadow-2xl border-2 border-gray-900 p-8 sticky top-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-black rounded-2xl flex items-center justify-center text-white text-lg font-bold animate-float">
                  📊
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                  ملخص الطلب
                </h3>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center p-4 glass-effect rounded-2xl border border-gray-900">
                  <span className="text-gray-700 font-semibold">المنتجات ({getTotalItems()} قطعة)</span>
                  <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                    {getTotalPrice().toFixed(2)} ر.س
                  </span>
                </div>
                
                {/* Product Savings Display */}
                {getTotalSavings() > 0 && (
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                    <span className="text-green-700 font-semibold flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      توفير من خصومات المنتجات
                    </span>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 line-through">
                        {getOriginalTotal().toFixed(2)} ر.س
                      </div>
                      <div className="font-bold text-lg text-green-600">
                        -{getTotalSavings().toFixed(2)} ر.س
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center p-4 glass-effect rounded-2xl border border-gray-900">
                  <span className="text-gray-700 font-semibold">رسوم التوصيل</span>
                  <span className={`font-bold text-lg ${getShippingCost() === 0 ? 'text-gray-900' : 'text-gray-800'}`}>
                    {getShippingCost() === 0 ? (
                      <span className="flex items-center gap-2">
                        مجاني <Gift className="w-5 h-5 text-gray-900" />
                      </span>
                    ) : `${getShippingCost()} ر.س`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-900">
                    <span className="text-gray-900 font-semibold">خصم الكوبون ({appliedCoupon.coupon.code})</span>
                    <span className="font-bold text-lg text-gray-900">-{getDiscountAmount().toFixed(2)} ر.س</span>
                  </div>
                )}
                {getShippingCost() === 0 && (
                  <div className="text-sm text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl border-2 border-gray-900 animate-pulse">
                    <div className="flex items-center gap-3">
                      <Gift className="w-5 h-5" />
                      <span className="font-semibold">🎉 تهانينا! حصلت على التوصيل المجاني</span>
                    </div>
                  </div>
                )}
                <div className="border-t-2 border-gray-900 pt-6">
                  {!appliedCoupon ? (
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <div className="w-6 h-6 bg-gradient-to-r from-gray-900 to-black rounded-lg flex items-center justify-center">
                          <Gift className="w-4 h-4 text-white" />
                        </div>
                        كود الخصم
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 p-4 border-2 border-gray-900 rounded-2xl focus:ring-4 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-300 glass-effect"
                          placeholder="أدخل كود الخصم"
                        />
                        <button
                          onClick={() => validateCoupon(couponCode)}
                          disabled={couponValidating || !couponCode.trim()}
                          className="px-6 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl hover:from-black hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          {couponValidating ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            'تطبيق'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-3 border-gray-900 rounded-3xl animate-bounce-in">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 font-bold text-lg flex items-center gap-3">
                            <Gift className="w-5 h-5 animate-bounce" />
                            {appliedCoupon.coupon.name}
                          </p>
                          <p className="text-gray-900 font-semibold">كود: {appliedCoupon.coupon.code}</p>
                          <p className="text-xs text-gray-900 mt-1">
                            🎊 وفرت {getDiscountAmount().toFixed(2)} ر.س
                          </p>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-red-600 hover:text-red-800 font-bold px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t-2 border-gray-900 pt-6">
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl border-3 border-gray-900">
                    <span className="text-xl font-bold text-gray-800">المجموع الكلي</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                      {getFinalTotal().toFixed(2)} ر.س
                    </span>
                  </div>
                  {appliedCoupon && (
                    <p className="text-sm text-gray-900 mt-3 text-center font-semibold animate-pulse">
                      🎊 وفرت {getDiscountAmount().toFixed(2)} ر.س بالكوبون! 💝
                    </p>
                  )}
                  {(getTotalSavings() > 0 || (appliedCoupon && getDiscountAmount() > 0)) && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                      <p className="text-center font-bold text-green-700 flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        إجمالي التوفير: {(getTotalSavings() + getDiscountAmount()).toFixed(2)} ر.س
                        <Sparkles className="w-5 h-5" />
                      </p>
                      <p className="text-xs text-green-600 text-center mt-1">
                        🎉 أحسنت! وفرت مبلغاً رائعاً في هذا الطلب
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-900">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-black rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">التوصيل خلال 1-3 أيام عمل</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-900">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-black rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">ضمان إرجاع المنتج</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-900">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-black rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">دفع آمن ومحمي</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;