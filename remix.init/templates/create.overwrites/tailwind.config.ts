import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors.js';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}', 'node_modules/componentry/app/common/components/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['"Quicksand"', ...defaultTheme.fontFamily.sans] },
      colors: {
        transparent: 'transparent',
        noir: colors.slate['900'],
        blanc: colors.slate['100'],
        cool: {
          50: colors.slate['50'],
          100: colors.slate['100'],
          200: colors.slate['200'],
          300: colors.slate['300'],
          400: colors.slate['400'],
          500: colors.slate['500'],
          600: colors.slate['600'],
          700: colors.slate['700'],
          800: colors.slate['800'],
          900: colors.slate['900'],
          950: colors.slate['950'],
        },
      },
    },
  },
} satisfies Config;
