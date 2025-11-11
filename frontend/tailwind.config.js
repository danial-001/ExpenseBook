/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#313647',
          surface: '#435663',
          accent: '#A3B087',
          tint: '#FFF8D4',
        },
        neutral: {
          light: '#F5F6FA',
          muted: '#6B7280',
          dark: '#1F2937',
        },
        // Dark Mode Palette
        dark: {
          bg: '#313647',
          surface: '#435663',
          accent: '#A3B087',
          text: '#FFF8D4',
        },
        // Light Mode Palette
        light: {
          bg: '#FFF8D4',
          surface: '#A3B087',
          accent: '#435663',
          text: '#313647',
        },
        // Semantic Colors
        semantic: {
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
          info: '#0EA5E9',
        },
      },
      fontSize: {
        'xs': 'clamp(0.75rem, 2vw, 0.875rem)',
        'sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'base': 'clamp(1rem, 3vw, 1.125rem)',
        'lg': 'clamp(1.125rem, 3.5vw, 1.25rem)',
        'xl': 'clamp(1.25rem, 4vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 5vw, 2rem)',
        '3xl': 'clamp(2rem, 6vw, 2.5rem)',
        '4xl': 'clamp(2.5rem, 7vw, 3rem)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(163, 176, 135, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(163, 176, 135, 0.5)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'glow-light': '0 0 20px rgba(163, 176, 135, 0.3)',
        'glow-dark': '0 0 20px rgba(163, 176, 135, 0.5)',
      },
    },
  },
  plugins: [],
}
