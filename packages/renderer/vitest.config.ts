import path from 'node:path';
import url from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig, defaultExclude } from 'vitest/config';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '#test-jsx': path.join(__dirname, 'tests/e.js'),
    },
  },
  // The ported react-pdf suites keep their original JSX; it compiles down to
  // plain element objects through the `e` factory (see tests/e.js).
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'e',
    jsxFragment: 'Fragment',
    jsxInject: "import { e, Fragment } from '#test-jsx'",
  },
  test: {
    // Necessary to avoid "Module did not self-register" error with canvas.node
    pool: 'forks',
    setupFiles: ['vitest.polyfills.js', 'vitest.setup.js'],
    include: ['tests/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [...defaultExclude, 'tests/{components,dom,usePDF}.test.*'],
    watch: false,
  },
});
