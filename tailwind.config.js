/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        lavender: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#ddd0ff',
          300: '#c4aeff',
          400: '#a87eff',
          500: '#8b50f5',
          600: '#7730e8',
          700: '#6520cc',
          800: '#551da6',
          900: '#471a87',
        },
        mint: {
          50: '#edfdf8',
          100: '#d4f9ef',
          200: '#adf2e0',
          300: '#75e5cc',
          400: '#3ecfb5',
          500: '#1fb39b',
          600: '#159080',
          700: '#157369',
          800: '#165c55',
          900: '#164c47',
        },
        peach: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6a0a',
          700: '#c2560a',
          800: '#9a4009',
          900: '#7c3509',
        },
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'breathe-slow': 'breathe 5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'twinkle-delay': 'twinkle 3s ease-in-out 1.5s infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'star-drift': 'starDrift 20s linear infinite',
        'moon-rise': 'moonRise 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.15))' },
          '45%': { transform: 'scale(1.1)', filter: 'drop-shadow(0 0 28px rgba(255,255,255,0.35))' },
          '55%': { transform: 'scale(1.08)', filter: 'drop-shadow(0 0 24px rgba(255,255,255,0.28))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        starDrift: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '100%': { transform: 'translateX(-50px) translateY(-30px)' },
        },
        moonRise: {
          '0%': { transform: 'translateY(60px) scale(0.5)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(255,255,255,0.05)' },
          '50%': { boxShadow: '0 0 40px 12px rgba(255,255,255,0.12)' },
        },
      },
    },
  },
  plugins: [],
};
