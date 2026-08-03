<script setup lang="ts">
usePageSeo(
  "pdf() Function",
  "API reference for the pdf() function — programmatic PDF generation.",
)
</script>

<template>
  <div class="prose">
    <div class="page-label">Node API</div>
    <h1>pdf()</h1>
    <p>
      The <code>pdf()</code> function creates a renderer instance from a Vue component. It provides
      methods for generating PDF output in various formats.
    </p>

    <h2>Signature</h2>
    <DocsCodeBlock
      lang="ts"
      :code="`function pdf(
  element: VueApp | Component | { new (): Component },
  props?: Record<string, unknown>
): PDFInstance`"
    />

    <h2>PDFInstance Methods</h2>
    <DocsPropsTable
      :rows="[
        { name: 'toBlob()', type: 'Promise<Blob>', description: 'Generate PDF as a Blob.' },
        { name: 'toBuffer()', type: 'Promise<Buffer>', description: 'Generate PDF as a Node.js Buffer. Only available in Node.' },
        { name: 'toString()', type: 'Promise<string>', description: 'Generate PDF as a base64-encoded string.' },
        { name: 'updateContainer(element)', type: 'void', description: 'Re-render with a new Vue component or app.' },
        { name: 'on(event, callback)', type: 'void', description: 'Listen for events (change when rendering completes).' },
      ]"
    />

    <h2>Node.js Example</h2>
    <DocsCodeBlock
      lang="ts"
      :code="`import { pdf } from '@vue-pdf/renderer'
import { createSSRApp } from 'vue'
import MyDocument from './MyDocument.vue'

const app = createSSRApp(MyDocument, { title: 'My Doc' })
const instance = pdf(app)

// Generate as Buffer (Node)
const buffer = await instance.toBuffer()
fs.writeFileSync('./output.pdf', buffer)

// Or as a base64 string
const base64 = await instance.toString()`"
    />

    <h2>Browser Example</h2>
    <DocsCodeBlock
      lang="ts"
      :code="`import { pdf } from '@vue-pdf/renderer'
import { createApp } from 'vue'
import MyDocument from './MyDocument.vue'

const app = createApp(MyDocument, { title: 'My Doc' })
const instance = pdf(app)

instance.on('change', () => {
  console.log('PDF rendered!')
})

const blob = await instance.toBlob()
// Use the blob for download, preview, etc.`"
    />
  </div>
</template>
