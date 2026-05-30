import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
const preset = require('./tailwind-preset');

const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [animate],
};

export default config;
