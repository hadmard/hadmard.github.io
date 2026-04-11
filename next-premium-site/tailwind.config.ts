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
        surface: '#101217',
        text: '#F5F7FA',
        muted: '#8E97A6',
        accent: '#2B66E0',
        line: '#1D2230',
      },
    },
  },
  plugins: [],
};

export default config;
