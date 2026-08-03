import { defineNuxtModule, createResolver, addComponent, addImports } from '@nuxt/kit'
import vue from '@vitejs/plugin-vue'

export interface ModuleOptions {}

/**
 * Registers every vue-pdf component and auto-imports the pdf composables.
 * The DOM components are client-only, since PDF assembly happens in the browser.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vue-pdf',
    configKey: 'vuePdf',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)


    const primitiveComponents = [
      'Document',
      'Page',
      'View',
      'Text',
      'Link',
      'Note',
      'Image',
      'ImageBackground',
      'Canvas',
      'Svg',
      'G',
      'Path',
      'Rect',
      'Line',
      'Circle',
      'Ellipse',
      'Polygon',
      'Polyline',
      'Tspan',
      'Stop',
      'Defs',
      'ClipPath',
      'LinearGradient',
      'RadialGradient',
      'FieldSet',
      'TextInput',
      'Select',
      'Checkbox',
      'List',
      'Marker',
    ]

    // Resolve through the package's export map, never files inside `src/`:
    // mixing the two loads two copies of the reconciler, hence two injection
    // contexts, and the PDF silently renders blank.
    //
    // Each primitive also gets a `VuePdf`-prefixed alias, since names like
    // `<Link>` collide with Nuxt built-ins.
    for (const name of primitiveComponents) {
      const component = { filePath: '@vue-pdf/renderer/components', export: name }
      addComponent({ name, ...component })
      addComponent({ name: `VuePdf${name}`, ...component })
    }

    const domComponents = ['PDFViewer', 'PDFDownloadLink', 'BlobProvider']

    for (const name of domComponents) {
      const component = {
        filePath: '@vue-pdf/renderer',
        export: name,
        mode: 'client' as const,
      }
      addComponent({ name, ...component })
      addComponent({ name: `VuePdf${name}`, ...component })
    }

    addImports([
      { name: 'usePDF', from: '@vue-pdf/renderer' },
      { name: 'pdf', from: '@vue-pdf/renderer' },
      { name: 'StyleSheet', from: '@vue-pdf/renderer' },
      { name: 'Font', from: '@vue-pdf/renderer' },
      { name: 'tw', from: '@vue-pdf/tailwind' },
      { name: 'createTw', from: '@vue-pdf/tailwind' },
      { name: 'configureTw', from: '@vue-pdf/tailwind' },
    ])

    const transpile = [
      '@vue-pdf/renderer',
      '@vue-pdf/reconciler',
      '@vue-pdf/layout',
      '@vue-pdf/render',
      '@vue-pdf/pdfkit',
      '@vue-pdf/font',
      '@vue-pdf/image',
      '@vue-pdf/textkit',
      '@vue-pdf/stylesheet',
      '@vue-pdf/primitives',
      '@vue-pdf/fns',
      '@vue-pdf/svg',
      '@vue-pdf/types',
      '@vue-pdf/tailwind',
      'yoga-layout',
    ]

    for (const pkg of transpile) {
      if (!nuxt.options.build.transpile.includes(pkg)) {
        nuxt.options.build.transpile.push(pkg)
      }
    }

    // Nitro bundles `server/` without Vue support, so a server route importing
    // the app's own document SFC fails to parse without this plugin.
    nuxt.hook('nitro:config', (config) => {
      config.rollupConfig ||= {}
      config.rollupConfig.plugins ||= []
      config.rollupConfig.plugins.unshift(vue())
    })
  },
})
