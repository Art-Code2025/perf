import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, Users, Headphones, UserCheck, Shield, RotateCcw, Sparkles, Crown } from 'lucide-react';

const ContactSection = () => {
  const openGoogleMaps = () => {
    window.open(
      "https://www.google.com/maps/place/24%C2%B045'04.5%22N+46%C2%B043'12.1%22E/@24.7512609,46.7200274,17z",
      "_blank"
    );
  };

  return (
    <div className="relative bg-gradient-to-br from-ajwaak-cream via-white to-ajwaak-light py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-ajwaak-primary/10 via-transparent to-ajwaak-gold/10" />
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-ajwaak-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-ajwaak-gold/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-ajwaak-dark/5 via-transparent to-ajwaak-dark/5" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-block">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ajwaak-primary mb-3 sm:mb-4 arabic-title">
              تواصل مع أجواك
            </h2>
            <div className="h-0.5 sm:h-1 ajwaak-gradient rounded-full mb-4 sm:mb-6" />
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg font-light leading-relaxed px-4">
            نحن دائماً في خدمتكم لتقديم أفضل العطور والزيوت العطرية. يمكنكم التواصل معنا من خلال أي من الوسائل التالية
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Premium Location Card */}
          <div 
            className="group relative bg-gradient-to-br from-white/80 via-ajwaak-cream/50 to-white/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105 cursor-pointer border border-ajwaak-primary/20 shadow-2xl hover:shadow-ajwaak-gold/20 md:col-span-2 lg:col-span-1"
            onClick={openGoogleMaps}
          >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-ajwaak-primary/10 via-transparent to-ajwaak-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Premium Border Gradient */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-ajwaak-primary/40 via-ajwaak-gold/50 to-ajwaak-primary/40 p-px">
              <div className="w-full h-full bg-gradient-to-br from-white/90 via-ajwaak-cream/90 to-white/90 rounded-2xl sm:rounded-3xl" />
            </div>
            
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="ajwaak-gradient w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-ajwaak-primary/30 shadow-lg">
                <MapPin className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
              </div>
              
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-ajwaak-primary mb-3 sm:mb-4 arabic-title">موقع أجواك</h3>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">طريق الملك عبدالله، الرياض، المملكة العربية السعودية</p>
                <button className="mx-auto flex items-center justify-center text-white font-medium ajwaak-gradient backdrop-blur-xl border border-ajwaak-primary/30 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  <span>افتح في الخريطة</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Premium Email Card */}
          <div className="group relative bg-gradient-to-br from-white/80 via-ajwaak-cream/50 to-white/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105 border border-ajwaak-primary/20 shadow-2xl hover:shadow-ajwaak-gold/20">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-ajwaak-primary/10 via-transparent to-ajwaak-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Premium Border Gradient */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-ajwaak-primary/40 via-ajwaak-gold/50 to-ajwaak-primary/40 p-px">
              <div className="w-full h-full bg-gradient-to-br from-white/90 via-ajwaak-cream/90 to-white/90 rounded-2xl sm:rounded-3xl" />
            </div>
            
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="ajwaak-gradient w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-ajwaak-primary/30 shadow-lg">
                <Mail className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
              </div>
              
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-ajwaak-primary mb-4 sm:mb-6 arabic-title">البريد الإلكتروني</h3>
              
              <div className="w-full">
                <a href="mailto:info@ajwaak.com" 
                   className="flex items-center justify-center space-x-1 space-x-reverse py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-xl border border-ajwaak-primary/40 hover:bg-white/80 transition-all duration-300 group/email">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-ajwaak-primary ml-2 group-hover/email:scale-110 transition-transform duration-300" />
                  <span className="text-ajwaak-dark hover:text-ajwaak-primary transition-colors text-sm sm:text-base font-medium break-all">info@ajwaak.com</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Premium Phone Numbers Card */}
          <div className="group relative bg-gradient-to-br from-white/80 via-ajwaak-cream/50 to-white/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105 border border-ajwaak-primary/20 shadow-2xl hover:shadow-ajwaak-gold/20 md:col-span-2 lg:col-span-1">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-ajwaak-primary/10 via-transparent to-ajwaak-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Premium Border Gradient */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-ajwaak-primary/40 via-ajwaak-gold/50 to-ajwaak-primary/40 p-px">
              <div className="w-full h-full bg-gradient-to-br from-white/90 via-ajwaak-cream/90 to-white/90 rounded-2xl sm:rounded-3xl" />
            </div>
            
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="ajwaak-gradient w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-ajwaak-primary/30 shadow-lg">
                <Phone className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
              </div>
              
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-ajwaak-primary mb-3 sm:mb-4 arabic-title">أرقام التواصل</h3>
              
              <div className="w-full space-y-3 sm:space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center ajwaak-gradient backdrop-blur-xl border border-ajwaak-primary/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl mb-2 sm:mb-3">
                    <Headphones className="w-3 h-3 sm:w-4 sm:h-4 text-white ml-1 sm:ml-2" />
                    <span className="text-white font-medium text-xs sm:text-sm">خدمة العملاء</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {["+966 50 123 4567", "+966 55 987 6543", "+966 54 555 7890"].map((phone, index) => (
                    <a key={index} href={`tel:${phone}`} 
                       className="flex items-center justify-center py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-xl border border-ajwaak-primary/40 hover:bg-white/80 transition-all duration-300 group/phone">
                      <span className="text-ajwaak-dark hover:text-ajwaak-primary transition-colors font-medium text-sm sm:text-base group-hover/phone:scale-105 transition-transform duration-300">{phone}</span>
                    </a>
                  ))}
                </div>
                
                <div className="border-t border-ajwaak-primary/20 pt-3 sm:pt-4 mt-4 sm:mt-6">
                  <div className="text-center mb-2 sm:mb-3">
                    <div className="inline-flex items-center justify-center ajwaak-gradient backdrop-blur-xl border border-ajwaak-primary/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl mb-2 sm:mb-3">
                      <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-white ml-1 sm:ml-2" />
                      <span className="text-white font-medium text-xs sm:text-sm">الإدارة</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-center">
                      <p className="text-gray-600 font-medium text-xs sm:text-sm mb-1 sm:mb-2">مدير المتجر</p>
                      <a href="tel:+966502532888" 
                         className="flex items-center justify-center py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-xl border border-ajwaak-primary/40 hover:bg-white/80 transition-all duration-300 group/phone">
                        <span className="text-ajwaak-dark hover:text-ajwaak-primary transition-colors text-sm sm:text-base group-hover/phone:scale-105 transition-transform duration-300">+966 50 253 2888</span>
                      </a>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-600 font-medium text-xs sm:text-sm mb-1 sm:mb-2">قسم المبيعات</p>
                      <a href="tel:+966505242177" 
                         className="flex items-center justify-center py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-xl border border-ajwaak-primary/40 hover:bg-white/80 transition-all duration-300 group/phone">
                        <span className="text-ajwaak-dark hover:text-ajwaak-primary transition-colors text-sm sm:text-base group-hover/phone:scale-105 transition-transform duration-300">+966 50 524 2177</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="relative py-6 sm:py-8 mt-12 sm:mt-16 border-t border-ajwaak-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ajwaak-cream/30 to-transparent" />
        <div className="relative">
          {/* Policy Links Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
            <Link
              to="/privacy-policy"
              className="inline-flex items-center text-gray-600 text-xs sm:text-sm font-medium hover:text-ajwaak-primary transition-all duration-300 bg-white/60 backdrop-blur-xl border border-ajwaak-primary/40 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-white/80 transform hover:scale-105"
            >
              <Shield className="w-4 h-4 ml-2 text-ajwaak-primary" />
              <span>سياسة الاستخدام والخصوصية</span>
            </Link>
            <Link
              to="/return-policy"
              className="inline-flex items-center text-gray-600 text-xs sm:text-sm font-medium hover:text-ajwaak-primary transition-all duration-300 bg-white/60 backdrop-blur-xl border border-ajwaak-primary/40 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-white/80 transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 ml-2 text-ajwaak-gold" />
              <span>سياسة الاسترجاع والاستبدال</span>
            </Link>
          </div>
          
          {/* Copyright Section */}
          <div className="text-center">
            <div className="inline-flex items-center text-gray-600 text-xs sm:text-sm font-medium bg-white/60 backdrop-blur-xl border border-ajwaak-primary/40 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl">
              <span className="text-ajwaak-primary font-bold arabic-title">أجواك</span>
              <span className="mx-1 sm:mx-2">©</span>
              <span>2025 - جميع الحقوق محفوظة</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactSection;