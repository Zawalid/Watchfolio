import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

const config: Config = {
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: { DEFAULT: '#5a4af4' },
            secondary: { DEFAULT: '#1ea5fc' },
            success: { DEFAULT: '#05ce91' },
            danger: { DEFAULT: '#ff6161' },
            warning: { DEFAULT: '#ffad49' },
          },
        },
      },
    }),
  ],
};
export default config;
