<script setup lang="ts">
usePageSeo(
  "BlobProvider",
  "API reference for BlobProvider — access the generated PDF blob, URL, and render state.",
)

const codeExample1 = `<script setup lang="ts">
import { BlobProvider } from '@vuepdf/renderer'
import MyDocument from './MyDocument.vue'
<\/script>

<template>
  <BlobProvider>
    <template #document>
      <MyDocument />
    </template>

    <template #default="{ url, loading }">
      <button v-if="loading" disabled>Generating...</button>
      <a v-else :href="url" download="document.pdf">Download PDF</a>
    </template>
  </BlobProvider>
</template>`

const codeExample2 = `<template>
  <BlobProvider>
    <template #document>
      <MyDocument />
    </template>

    <template #default="{ blob, loading, error }">
      <p v-if="error">Could not generate the PDF.</p>
      <button v-else :disabled="loading" @click="upload(blob)">
        {{ loading ? 'Generating...' : 'Upload to server' }}
      </button>
    </template>
  </BlobProvider>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Browser API</div>
    <h1>BlobProvider</h1>
    <p>
      Renders no markup of its own — it generates the PDF and hands the resulting blob, URL, and render state
      to its default scoped slot. Use it when you want the output but not the
      <NuxtLink to="/api/pdf-download-link">anchor</NuxtLink> or the
      <NuxtLink to="/api/pdf-viewer">iframe</NuxtLink>.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'document', type: 'DocumentTree', description: 'A prebuilt document tree ({ type, props, children }), for react-pdf API parity. Optional — prefer the document slot.' },
      ]"
    />

    <div class="callout callout-info">
      <code>document</code> takes a plain <strong>document tree object</strong>. To compose your PDF with the
      usual components, use the <code>document</code> slot instead.
    </div>

    <h2>Slots</h2>
    <DocsPropsTable
      :rows="[
        { name: 'document', type: 'slot', description: 'Your <Document> component. Rendered into a hidden container; its assembled tree is handed to the internal pdf instance.' },
        { name: 'default', type: 'scoped slot', description: 'Receives the render state: { url, blob, error, loading }.' },
      ]"
    />

    <h2>Usage</h2>
    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Working With the Blob</h2>
    <p>The raw <code>Blob</code> is available as soon as a render finishes — upload it, hash it, or store it:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <div class="callout callout-info">
      The blob URL is revoked automatically when it is replaced by a new render and when the component
      unmounts, so don't hold onto <code>url</code> past the component's lifetime — keep the
      <code>blob</code> instead.
    </div>

    <div class="callout callout-warn">
      <code>BlobProvider</code> is browser-only. On the server, use
      <NuxtLink to="/api/render-to-buffer">renderToBuffer</NuxtLink> or
      <NuxtLink to="/api/render-to-stream">renderToStream</NuxtLink>.
    </div>
  </div>
</template>
