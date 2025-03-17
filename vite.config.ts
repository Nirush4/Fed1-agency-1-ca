import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  appType: 'mpa',
  base: '',
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
        profile: resolve(__dirname, './profile/index.html'),
        signIn: resolve(__dirname, './sign-in/index.html'),
      },
    },
  },
  plugins: [tailwindcss()],
});
