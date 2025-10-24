import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        // Оставляем только используемые цвета
        border: 'hsl(220, 15%, 20%)',
        input: 'hsl(220, 15%, 18%)',
        ring: 'hsl(220, 90%, 60%)',
        background: 'hsl(220, 20%, 8%)',
        foreground: 'hsl(0, 0%, 98%)',
        primary: {
          DEFAULT: 'hsl(220, 90%, 60%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(200, 95%, 55%)',
          foreground: 'hsl(220, 20%, 8%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84.2%, 60.2%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        accent: {
          DEFAULT: 'hsl(210, 85%, 65%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
