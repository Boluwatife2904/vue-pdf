import path from 'node:path'
import url from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

/**
 * Library build for `@vuepdf/renderer`.
 *
 * The point of precompiling here is the `.vue` files: shipping raw SFCs forces
 * every consumer to have a Vue plugin in its bundler, which Nitro does not have
 * for `server/` — importing a vue-pdf component from a server route used to
 * fail with `rollup-plugin-inject: failed to parse View.vue`. Compiled output
 * is plain JS, so it works anywhere.
 *
 * Three entries mirror the package's export map. `node` and `browser` share the
 * component code but differ in their environment stubs, so both are emitted.
 */
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'node18',
    minify: false,
    lib: {
      entry: {
        index: path.resolve(dirname, 'src/node/index.js'),
        browser: path.resolve(dirname, 'src/dom/index.js'),
        components: path.resolve(dirname, 'src/components/index.js'),
        primitives: path.resolve(dirname, 'src/primitives.js'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Everything outside this package stays external — including `vue`,
      // which is a peer dependency and must resolve to the consumer's copy.
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
      output: {
        entryFileNames: '[name].mjs',
        chunkFileNames: 'chunks/[name]-[hash].mjs',
      },
    },
  },
})
