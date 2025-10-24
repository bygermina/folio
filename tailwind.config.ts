import type { Config } from 'tailwindcss';

// Helper function to convert RGB to RGBA
export const rgba = (rgb: string, alpha: number): string => {
  const match = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return rgb;

  return `rgba(${match[1]},${match[2]},${match[3]},${alpha})`;
};

export const baseColors = {
  cyan: {
    300: 'rgb(103,232,249)',
    400: 'rgb(6,182,212)',
  },
  blue: {
    300: 'rgb(147,197,253)',
    500: 'rgb(59,130,246)',
  },
  purple: {
    300: 'rgb(196,181,253)',
    500: 'rgb(168,85,247)',
  },
  indigo: {
    500: 'rgb(99,102,241)',
  },
  slate: {
    300: 'rgb(203,213,225)',
    500: 'rgb(100,116,139)',
    700: 'rgb(51,65,85)',
  },
  sky: {
    200: 'rgb(186,230,253)',
    300: 'rgb(125,211,252)',
  },
  white: 'rgb(255,255,255)',
  black: 'rgb(0,0,0)',
  dark: 'rgb(2,6,23)',
  deepBlue: 'rgb(0,10,42)',
  violet: {
    deep: 'rgb(39,29,216)',
    medium: 'rgb(44,32,158)',
  },
  aqua: 'rgb(0,204,255)',
} as const;

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        cyan: baseColors.cyan,
        blue: baseColors.blue,
        purple: baseColors.purple,
        indigo: baseColors.indigo,
        slate: baseColors.slate,
        dark: {
          DEFAULT: baseColors.dark,
          light: rgba(baseColors.dark, 0.12),
          medium: rgba(baseColors.dark, 0.25),
        },
        white: {
          DEFAULT: baseColors.white,
        },
        fire: {
          blue: baseColors.blue[500],
          cyan: baseColors.cyan[400],
          purple: baseColors.purple[500],
          indigo: baseColors.indigo[500],
          white: baseColors.white,
          lightBlue: baseColors.blue[300],
          lightPurple: baseColors.purple[300],
        },
        code: {
          start: baseColors.blue[500],
          end: baseColors.slate[700],
        },
        light: {
          core: rgba(baseColors.violet.deep, 0.18),
          middle: rgba(baseColors.violet.medium, 0.27),
          outer: rgba(baseColors.deepBlue, 0.07),
        },
        lamp: {
          cord: {
            from: baseColors.sky[200],
            to: baseColors.sky[300],
          },
          glow: baseColors.cyan[400],
          border: baseColors.cyan[300],
          shadow: {
            black: rgba(baseColors.black, 0.3),
            radial: rgba(baseColors.black, 0.2),
          },
          highlight: {
            core: rgba(baseColors.aqua, 0.22),
            middle: rgba(baseColors.aqua, 0.1),
            outer: rgba(baseColors.black, 0.16),
          },
        },
        glass: {
          white: baseColors.white,
          blue: baseColors.blue[500],
          cyan: baseColors.cyan[400],
          purple: baseColors.purple[500],
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
