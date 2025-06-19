/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Black and Gold Palette
        luxury: {
          black: '#0a0a0a',
          gold: '#FFD700',
          'gold-dark': '#B8860B',
          'gold-light': '#FFF8DC',
          white: '#FFFFFF',
          gray: '#1a1a1a',
          'gray-light': '#2a2a2a',
          'gray-dark': '#0f0f0f',
        },
        
        // Professional Navy Blue Primary Colors
        primary: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#1e3a8a', // Main Navy Blue
          600: '#1e40af',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e293b',
          950: '#0f172a'
        },
        
        // AJWAAK Brand Colors (enhanced)
        'ajwaak': {
          'primary': '#8B1538',
          'secondary': '#A91D47',
          'gold': '#D4AF37',
          'cream': '#F5F1E8',
          'dark': '#2D1810',
          'light': '#FAF9F7',
        },
        
        // Premium Gold Variations
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFD700', // Main Gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        
        // Medical Professional Colors
        medical: {
          white: '#ffffff',
          snow: '#fafbfc',
          light: '#f8fafc',
          gray: '#64748b',
          dark: '#475569',
          charcoal: '#334155',
          steel: '#1e293b'
        },
        
        // Professional Accent Colors
        accent: {
          emerald: '#059669',
          amber: '#d97706',
          red: '#dc2626',
          blue: '#2563eb',
          teal: '#0891b2'
        },
        cream: {
          50: '#f8f5f0', // اللون الكريمي الفاتح
          100: '#f0ece5',
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'responsive-xs': 'clamp(0.75rem, 2vw, 0.875rem)',
        'responsive-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'responsive-base': 'clamp(1rem, 3vw, 1.125rem)',
        'responsive-lg': 'clamp(1.125rem, 3.5vw, 1.25rem)',
        'responsive-xl': 'clamp(1.25rem, 4vw, 1.5rem)',
        'responsive-2xl': 'clamp(1.5rem, 5vw, 2rem)',
        'responsive-3xl': 'clamp(1.875rem, 6vw, 2.5rem)',
        'responsive-4xl': 'clamp(2.25rem, 7vw, 3rem)',
        'responsive-5xl': 'clamp(3rem, 8vw, 4rem)',
        'luxury-xl': 'clamp(2rem, 6vw, 3.5rem)',
        'luxury-2xl': 'clamp(2.5rem, 8vw, 4.5rem)',
        'luxury-3xl': 'clamp(3rem, 10vw, 6rem)',
      },
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1536px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'perfume-float': 'float 3s ease-in-out infinite',
        'luxury-rotate': 'luxuryRotate 1s linear infinite',
        'luxury-pulse': 'luxuryPulse 2s ease-in-out infinite',
        'luxury-glow': 'luxuryGlow 3s ease-in-out infinite',
        'luxury-slide-in': 'luxurySlideIn 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        luxuryRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        luxuryPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        luxuryGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
        },
        luxurySlideIn: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      // Professional Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
        'gradient-header': 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        'gradient-button': 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)',
        'gradient-navy': 'linear-gradient(180deg, #1e3a8a 0%, #0f172a 100%)',
        'ajwaak-gradient': 'linear-gradient(135deg, #8B1538 0%, #A91D47 50%, #D4AF37 100%)',
        'perfume-hero': 'linear-gradient(135deg, #8B1538 0%, #A91D47 50%, #D4AF37 100%)',
        
        // Luxury Gradients
        'luxury-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
        'luxury-black': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        'luxury-card': 'linear-gradient(145deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.9) 100%)',
        'luxury-hero': 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(26, 26, 26, 0.6) 100%)',
        'luxury-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      
      // Professional Shadows
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button': '0 10px 15px -3px rgba(30, 58, 138, 0.3), 0 4px 6px -2px rgba(30, 58, 138, 0.2)',
        'nav': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hero': '0 25px 50px -12px rgba(30, 58, 138, 0.25)',
        'professional': '0 20px 25px -5px rgba(30, 58, 138, 0.1), 0 10px 10px -5px rgba(30, 58, 138, 0.04)',
        'perfume': '0 8px 32px rgba(139, 21, 56, 0.08)',
        'perfume-hover': '0 16px 48px rgba(139, 21, 56, 0.15)',
        'gold': '0 4px 15px rgba(212, 175, 55, 0.3)',
        
        // Luxury Shadows
        'luxury': '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(255, 215, 0, 0.1)',
        'luxury-hover': '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(255, 215, 0, 0.2)',
        'luxury-glow': '0 0 30px rgba(255, 215, 0, 0.3)',
        'luxury-button': '0 8px 25px rgba(255, 215, 0, 0.3), 0 2px 8px rgba(255, 215, 0, 0.2)',
        'luxury-card': '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(255, 215, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      
      // Professional Typography
      fontFamily: {
        'primary': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        'arabic': ['Cairo', 'Amiri', 'Arial', 'sans-serif'],
        'arabic-title': ['Amiri', 'Cairo', 'serif'],
        'luxury': ['Playfair Display', 'serif'],
        'luxury-sans': ['Cairo', 'Inter', 'sans-serif'],
      },
      
      // Professional Border Radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'luxury': '20px',
        'luxury-sm': '12px',
      },
      
      // Custom backdrop blur
      backdropBlur: {
        'luxury': '20px',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents }) {
      const newUtilities = {
        '.container-responsive': {
          'width': '100%',
          'margin-left': 'auto',
          'margin-right': 'auto',
          'padding-left': '1rem',
          'padding-right': '1rem',
          '@screen sm': {
            'padding-left': '1.5rem',
            'padding-right': '1.5rem',
            'max-width': '640px',
          },
          '@screen md': {
            'padding-left': '2rem',
            'padding-right': '2rem',
            'max-width': '768px',
          },
          '@screen lg': {
            'padding-left': '2rem',
            'padding-right': '2rem',
            'max-width': '1024px',
          },
          '@screen xl': {
            'padding-left': '2.5rem',
            'padding-right': '2.5rem',
            'max-width': '1280px',
          },
          '@screen 2xl': {
            'max-width': '1536px',
          },
        },
        '.text-responsive': {
          'font-size': 'clamp(1rem, 2.5vw, 1.125rem)',
          'line-height': '1.6',
        },
        '.heading-responsive': {
          'font-size': 'clamp(1.5rem, 5vw, 2.5rem)',
          'line-height': '1.2',
          'font-weight': '700',
        },
      };
      
      const newComponents = {
        '.luxury-card': {
          background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.9) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          'backdrop-filter': 'blur(20px)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(255, 215, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          'border-radius': '20px',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
        },
        '.luxury-button': {
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
          color: '#000000',
          border: 'none',
          'border-radius': '15px',
          padding: '16px 32px',
          'font-weight': '700',
          'font-size': '16px',
          'letter-spacing': '0.5px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          'box-shadow': '0 8px 25px rgba(255, 215, 0, 0.3), 0 2px 8px rgba(255, 215, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          'text-transform': 'uppercase',
        },
        '.luxury-text-gradient': {
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'text-shadow': '0 0 30px rgba(255, 215, 0, 0.3)',
        },
      };
      
      addUtilities(newUtilities);
      addComponents(newComponents);
    }
  ],
}