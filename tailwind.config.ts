import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F4EFE6',
          300: '#EBE3D5',
          400: '#E0D4C3',
          border: '#E4DBD0',
          DEFAULT: '#FAF6F0',
        },
        burnt: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#EA580C',
          600: '#C2410C',
          700: '#9A3412',
          800: '#7C2D12',
          900: '#571E0B',
          DEFAULT: '#C2410C',
        },
        charcoal: {
          50: '#F6F6F7',
          100: '#EAEAEA',
          200: '#D1D1D6',
          300: '#B0B0BA',
          400: '#8A8A93',
          500: '#686873',
          600: '#4E4E58',
          700: '#383840',
          800: '#232328',
          900: '#151518',
          950: '#0E0E11',
          DEFAULT: '#121214',
        },
      },
    },
  },
  plugins: [],
};
export default config;
