import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0B0D',
        surface: '#111319',
        text: '#F5F7FA',
        muted: '#9AA3B2',
        accent: '#2D6BFF',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0, 0, 0, 0.25)',
        focus: '0 14px 42px rgba(45, 107, 255, 0.35)',
      },
      keyframes: {
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 14s ease infinite',
        'fade-up': 'fade-up 640ms ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
