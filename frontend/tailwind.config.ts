import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      background: '#0f1419',
      foreground: '#f5f5f5',
      card: '#1a2332',
      primary: '#06b6d4',
      secondary: '#1e293b',
      muted: '#64748b',
      border: '#334155',
      'muted-foreground': '#94a3b8',
      'primary-foreground': '#0f1419',
      'secondary-foreground': '#e2e8f0',
      white: '#ffffff',
      black: '#000000',
      red: {
        500: '#ef4444',
      },
      yellow: {
        500: '#f59e0b',
      },
      emerald: {
        400: '#34d399',
        500: '#10b981',
      },
      amber: {
        400: '#fbbf24',
        500: '#f59e0b',
      },
      cyan: {
        400: '#22d3ee',
      },
    },
    extend: {
      backgroundColor: {
        glass: 'rgba(30, 41, 59, 0.65)',
      },
      backdropBlur: {
        xl: '40px',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(6, 182, 212, 0.3)',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.8s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
