import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';
import { nextui } from '@nextui-org/react';

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 'sans': ['"Quicksand"', ...defaultTheme.fontFamily.sans], },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
