import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react({
        jsxImportSource: 'nativewind',
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.NODE_ENV': JSON.stringify(mode),
      'global': 'window',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'react-native': 'react-native-web',
        'react-native-safe-area-context': path.resolve(__dirname, 'src/mocks/safe-area-context.jsx'),
        'lucide-react-native': 'lucide-react',
        'nativewind/jsx-runtime': 'react-native-css-interop/dist/runtime/jsx-runtime.js',
        'nativewind/jsx-dev-runtime': 'react-native-css-interop/dist/runtime/jsx-dev-runtime.js',
      },
    },
    optimizeDeps: {
      include: ['react-native-css-interop'],
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
