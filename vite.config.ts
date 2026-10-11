import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import {imagetools} from 'vite-imagetools';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Keep the supplied originals; ship optimized product posters and screenshots.
      imagetools({
        include: /\.(png|jpg)(\?.*)?$/,
        defaultDirectives: () => new URLSearchParams({format: 'webp', quality: '82'}),
      }),
    ],
    resolve: {
      alias: {
        '@': rootDirectory,
      },
    },
    build: {
      // Keep even small font subsets on the same origin: the production CSP
      // intentionally allows font-src 'self' and Vite otherwise inlines them.
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('@xyflow')) return 'canvas';
            if (id.includes('gsap') || id.includes('lenis')) return 'animation';
            if (id.includes('motion')) return 'motion';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react')) return 'react-vendor';
          },
        },
      },
    },
    server: {
      watch: { ignored: ['**/.agents/**', '**/artifacts/qa/**', '**/coverage/**', '**/test-results/**', '**/playwright-report/**'] },
    },
  };
});
