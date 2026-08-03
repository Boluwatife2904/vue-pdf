<script setup lang="ts">
usePageSeo(
  "usePDF",
  "API reference for the usePDF composable — generate and preview PDFs in the browser.",
)

const codeExample1 = `<script setup lang="ts">
import { usePDF } from '@vue-pdf/renderer'

const [instance] = usePDF({
  document: {
    type: 'DOCUMENT',
    props: { title: 'Hello' },
    children: [
      {
        type: 'PAGE',
        props: { size: 'A4' },
        children: [
          { type: 'TEXT', props: {}, children: ['Hello, PDF!'] },
        ],
      },
    ],
  },
})
<\/script>

<template>
  <div v-if="instance.loading" class="loading">Generating PDF...</div>
  <iframe
    v-else-if="instance.url"
    :src="instance.url"
    width="100%"
    height="500px"
    class="pdf-preview"
  />
</template>`

const codeExample2 = `<script setup lang="ts">
import { usePDF } from '@vue-pdf/renderer'

const [instance, update] = usePDF()

const buildTree = (invoice: { id: string; amount: number }) => ({
  type: 'DOCUMENT',
  props: {},
  children: [
    {
      type: 'PAGE',
      props: { size: 'A4' },
      children: [
        {
          type: 'TEXT',
          props: {},
          children: [\`Invoice \${invoice.id} — $\${invoice.amount}\`],
        },
      ],
    },
  ],
})

const invoice = ref({ id: '123', amount: 1500 })

// Re-render whenever the data changes; pending renders are replaced.
watchEffect(() => update(buildTree(invoice.value)))
<\/script>`

const codeExample3 = `<script setup lang="ts">
import { PDFViewer } from '@vue-pdf/renderer'
import InvoiceDoc from './InvoiceDoc.vue'
<\/script>

<template>
  <PDFViewer :style="{ width: '100%', height: '500px' }">
    <InvoiceDoc :invoice="invoice" />
  </PDFViewer>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Browser API</div>
    <h1>usePDF</h1>
    <p>
      The <code>usePDF</code> composable owns a <NuxtLink to="/api/pdf-function">pdf()</NuxtLink> instance
      and exposes reactive render state for previewing in the browser. It is the Vue analog of react-pdf's
      <code>usePDF</code> hook and returns a <code>[state, update]</code> tuple.
    </p>

    <h2>Signature</h2>
    <DocsCodeBlock
      lang="ts"
      :code="`function usePDF(options?: {
  document?: DocumentTree
}): [Ref<PDFState>, (document: DocumentTree) => void]`"
    />

    <h2>Options</h2>
    <DocsPropsTable
      :rows="[
        { name: 'document', type: 'DocumentTree', description: 'Optional initial document tree. Rendering starts immediately when provided; omit it and call the updater instead.' },
      ]"
    />

    <h2>Return Value</h2>
    <p>
      A two-element tuple. The first element is a <code>Ref</code> holding the render state — read it as
      <code>instance.value.url</code> in script, or <code>instance.url</code> in a template. The second is an
      updater that swaps in a new document tree.
    </p>

    <DocsCodeBlock
      lang="ts"
      :code="`const [instance, update] = usePDF()`"
    />

    <h3>State (<code>instance.value</code>)</h3>
    <DocsPropsTable
      :rows="[
        { name: 'url', type: 'string | null', default: 'null', description: 'Blob URL for preview. Revoked automatically when replaced or on unmount.' },
        { name: 'blob', type: 'Blob | null', default: 'null', description: 'Raw binary of the generated PDF.' },
        { name: 'error', type: 'Error | null', default: 'null', description: 'Last render error, if any.' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Whether a render is currently in flight. Starts as true when an initial document is passed.' },
      ]"
    />

    <h3>Updater</h3>
    <DocsPropsTable
      :rows="[
        { name: 'update(document)', type: '(document: DocumentTree) => void', description: 'Replaces the rendered document. Renders run through a concurrency-1 queue where a newly scheduled render replaces any pending one.' },
      ]"
    />

    <h2>Usage</h2>
    <p>
      <code>usePDF</code> takes a <strong>document tree</strong> — a plain object of
      <code>{ type, props, children }</code> nodes — not a Vue component:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Updating on Data Changes</h2>
    <p>Call the updater whenever your data changes to re-render:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>Prefer a Component Wrapper</h2>
    <p>
      Hand-writing trees is rarely what you want. <NuxtLink to="/api/pdf-viewer">PDFViewer</NuxtLink>,
      <NuxtLink to="/api/pdf-download-link">PDFDownloadLink</NuxtLink>, and
      <NuxtLink to="/api/blob-provider">BlobProvider</NuxtLink> each run <code>usePDF</code> internally and
      accept a slotted <code>&lt;Document&gt;</code>, so you can compose your PDF with the normal components.
      <code>PDFViewer</code> takes it in the default slot; the other two take it in a
      <code>#document</code> slot and keep the default slot for your own markup:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <div class="callout callout-info">
      Reach for <code>usePDF</code> directly only when you need to own the render loop — for example, driving
      a preview from a tree you build programmatically.
    </div>

    <div class="callout callout-warn">
      <code>usePDF</code> is browser-only. On the server, use the
      <NuxtLink to="/api/pdf-function">pdf()</NuxtLink> function or the
      <NuxtLink to="/api/render-to-stream">renderTo*</NuxtLink> APIs instead.
    </div>
  </div>
</template>
