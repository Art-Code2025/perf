import React, { useState, useEffect } from 'react';
import { safeApiCall, apiCall, API_ENDPOINTS } from '../config/api';

interface TestResult {
  title: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  data?: any;
}

const TestConnection: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);

  const addResult = (title: string, status: 'success' | 'error' | 'loading', message: string, data?: any) => {
    const newResult: TestResult = { title, status, message, data };
    setResults(prev => [...prev, newResult]);
  };

  const testBackend = async () => {
    addResult('فحص حالة الخادم', 'loading', 'جاري فحص Backend...');
    
    try {
      const data = await apiCall(API_ENDPOINTS.HEALTH);
      addResult('فحص حالة الخادم', 'success', 
        `Backend يعمل بنجاح! 🎉\nالبيانات: ${data.categories} تصنيفات، ${data.products} منتجات`, 
        data);
    } catch (error: any) {
      addResult('فحص حالة الخادم', 'error', 
        `خطأ في الاتصال: ${error.message}\nتأكد من تشغيل Backend على http://localhost:3001`);
    }
  };

  const testProducts = async () => {
    addResult('اختبار المنتجات', 'loading', 'جاري جلب المنتجات...');
    
    try {
      const data = await apiCall(API_ENDPOINTS.PRODUCTS);
      if (Array.isArray(data) && data.length > 0) {
        addResult('اختبار المنتجات', 'success', 
          `تم جلب ${data.length} منتج بنجاح! 🛍️`, 
          data.slice(0, 2));
      } else {
        addResult('اختبار المنتجات', 'error', 'لا توجد منتجات في قاعدة البيانات');
      }
    } catch (error: any) {
      addResult('اختبار المنتجات', 'error', `خطأ في جلب المنتجات: ${error.message}`);
    }
  };

  const testCategories = async () => {
    addResult('اختبار التصنيفات', 'loading', 'جاري جلب التصنيفات...');
    
    try {
      const data = await apiCall(API_ENDPOINTS.CATEGORIES);
      if (Array.isArray(data) && data.length > 0) {
        addResult('اختبار التصنيفات', 'success', 
          `تم جلب ${data.length} تصنيف بنجاح! 📂`, 
          data);
      } else {
        addResult('اختبار التصنيفات', 'error', 'لا توجد تصنيفات في قاعدة البيانات');
      }
    } catch (error: any) {
      addResult('اختبار التصنيفات', 'error', `خطأ في جلب التصنيفات: ${error.message}`);
    }
  };

  const testFull = async () => {
    addResult('الاختبار الشامل', 'loading', 'بدء الاختبار الشامل...');
    
    try {
      const [healthResult, productsResult, categoriesResult] = await Promise.all([
        safeApiCall(API_ENDPOINTS.HEALTH),
        safeApiCall(API_ENDPOINTS.PRODUCTS),
        safeApiCall(API_ENDPOINTS.CATEGORIES)
      ]);
      
      if (healthResult.isServerDown || productsResult.isServerDown || categoriesResult.isServerDown) {
        addResult('الاختبار الشامل', 'error', '🚫 الخادم غير متاح حالياً');
        return;
      }
      
      const healthData = healthResult.data;
      const productsData = productsResult.data || [];
      const categoriesData = categoriesResult.data || [];
      
      const summary = {
        serverStatus: healthData?.status || 'unknown',
        database: healthData?.database || 'unknown',
        totalProducts: Array.isArray(productsData) ? productsData.length : 0,
        totalCategories: Array.isArray(categoriesData) ? categoriesData.length : 0,
        totalOrders: healthData?.orders || 0,
        timestamp: new Date().toLocaleString('ar-EG')
      };
      
      addResult('الاختبار الشامل', 'success', 
        `🎉 النظام يعمل بشكل مثالي!\n` +
        `✅ الخادم: نشط\n` +
        `✅ قاعدة البيانات: ${healthData?.database || 'غير معروف'}\n` +
        `✅ المنتجات: ${Array.isArray(productsData) ? productsData.length : 0}\n` +
        `✅ التصنيفات: ${Array.isArray(categoriesData) ? categoriesData.length : 0}\n` +
        `✅ الطلبات: ${healthData?.orders || 0}`, 
        summary);
        
      addResult('🎯 النتيجة النهائية', 'success', 
        '✨ مبروك! النظام يعمل بشكل ممتاز. Frontend و Backend متصلان بنجاح والبيانات تُجلب بصورة صحيحة.');
        
    } catch (error: any) {
      addResult('الاختبار الشامل', 'error', 
        `❌ فشل الاختبار الشامل: ${error.message}\n` +
        `تحقق من:\n` +
        `• Backend يعمل على http://localhost:3001\n` +
        `• لا توجد مشاكل في CORS\n` +
        `• قاعدة البيانات متصلة`);
    }
  };

  useEffect(() => {
    addResult('🚀 بدء التشغيل', 'loading', 'تم تحميل مكون الاختبار بنجاح');
    setTimeout(() => {
      testBackend();
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'loading': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'success': return '✅ نجح';
      case 'error': return '❌ فشل';
      case 'loading': return '⏳ جاري...';
      default: return '⏳ جاري...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🔧 اختبار سريع للنظام</h1>
          <p className="text-gray-600 mb-6">اختبار الاتصال بين Frontend و Backend</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">📍 معلومات النظام</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Frontend:</strong> http://localhost:5173</p>
                <p><strong>Backend:</strong> http://localhost:3001</p>
                <p><strong>CORS:</strong> مُعد للمنافذ 5173-5177</p>
                <p><strong>النظام:</strong> React + TypeScript + MongoDB</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3">⚡ اختبارات سريعة</h3>
              <div className="space-y-2">
                <button 
                  onClick={testBackend}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                >
                  اختبار Backend
                </button>
                <button 
                  onClick={testProducts}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
                >
                  اختبار المنتجات
                </button>
                <button 
                  onClick={testCategories}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors"
                >
                  اختبار التصنيفات
                </button>
                <button 
                  onClick={testFull}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors"
                >
                  اختبار شامل
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-lg">{result.title}</strong>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getStatusColor(result.status)}`}>
                    {getStatusText(result.status)}
                  </span>
                </div>
                <div className="text-gray-600 whitespace-pre-line">{result.message}</div>
                {result.data && (
                  <pre className="bg-gray-800 text-green-400 p-3 rounded mt-3 overflow-x-auto text-xs">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConnection; 