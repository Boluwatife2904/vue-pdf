<script setup lang="ts">
usePageSeo(
  "PDFDownloadLink",
  "API reference for PDFDownloadLink — render an anchor that downloads the generated PDF.",
)

const codeExample1 = `<script setup lang="ts">
import { PDFDownloadLink } from '@vuepdf/renderer'
import MyDocument from './MyDocument.vue'
<\/script>

<template>
  <PDFDownloadLink file-name="report.pdf">
    <template #document>
      <MyDocument />
    </template>

    <template #default="{ loading }">
      {{ loading ? 'Preparing...' : 'Download PDF' }}
    </template>
  </PDFDownloadLink>
</template>`

const codeExample2 = `<template>
  <PDFDownloadLink file-name="invoice.pdf" class="btn">
    <template #document>
      <InvoiceDocument :invoice="invoice" />
    </template>

    <template #default="{ loading, error, url }">
      <span v-if="error">Failed to generate</span>
      <span v-else-if="loading || !url">Generating...</span>
      <span v-else>Download invoice</span>
    </template>
  </PDFDownloadLink>
</template>`

const codeExample3 = `<script setup lang="ts">
const tree = {
  type: 'DOCUMENT',
  props: { title: 'Report' },
  children: [
    {
      type: 'PAGE',
      props: { size: 'A4' },
      children: [
        { type: 'TEXT', props: {}, children: ['Generated report'] },
      ],
    },
  ],
}
<\/script>

<template>
  <PDFDownloadLink :document="tree" file-name="report.pdf">
    <template #default="{ loading }">
      {{ loading ? 'Preparing...' : 'Download' }}
    </template>
  </PDFDownloadLink>
</template>`

const codeExample4 = `<template>
  <PDFDownloadLink
    file-name="report.pdf"
    class="btn"
    target="_blank"
    @click="onClick"
  >
    <template #document>
      <MyDocument />
    </template>
    <template #default>Download</template>
  </PDFDownloadLink>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Browser API</div>
    <h1>PDFDownloadLink</h1>
    <p>
      Renders an <code>&lt;a&gt;</code> element whose <code>href</code> points at the generated PDF blob and
      whose <code>download</code> attribute carries your filename. It runs
      <NuxtLink to="/api/use-pdf">usePDF</NuxtLink> internally, so you never manage the render loop yourself.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'document', type: 'DocumentTree', description: 'A prebuilt document tree ({ type, props, children }), for react-pdf API parity. Optional — prefer the document slot.' },
        { name: 'fileName', type: 'string', default: '\'document.pdf\'', description: 'Value of the anchor\'s download attribute.' },
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
        { name: 'default', type: 'scoped slot', description: 'The link label. Receives the render state: { url, blob, error, loading }.' },
      ]"
    />

    <h2>Events</h2>
    <DocsPropsTable
      :rows="[
        { name: 'click', type: '(event: MouseEvent, state: PDFState) => void', description: 'Emitted when the anchor is clicked, with the current render state as the second argument.' },
      ]"
    />

    <h2>Usage</h2>
    <p>
      Slot your <code>&lt;Document&gt;</code> into the <code>document</code> slot and use the default slot for
      the label:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Reacting to Render State</h2>
    <p>
      The default slot is a scoped slot — the same state
      <NuxtLink to="/api/use-pdf">usePDF</NuxtLink> exposes:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <div class="callout callout-info">
      The anchor is always rendered, even while <code>loading</code> is <code>true</code>. Until the first
      render finishes, <code>href</code> is empty — disable or relabel the link via the scoped slot if that
      matters for your UI.
    </div>

    <h2>With a Prebuilt Tree</h2>
    <p>For parity with react-pdf, you can pass a document tree directly instead of slotting a component:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <h2>Attributes</h2>
    <p>
      The component sets <code>inheritAttrs: false</code> and forwards every extra attribute — classes,
      <code>target</code>, ARIA attributes — onto the underlying <code>&lt;a&gt;</code>:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample4"
    />

    <div class="callout callout-warn">
      <code>PDFDownloadLink</code> is browser-only. To produce a file on the server, use
      <NuxtLink to="/api/render-to-file">renderToFile</NuxtLink> or
      <NuxtLink to="/api/render-to-stream">renderToStream</NuxtLink>.
    </div>

    <h2>See Also</h2>
    <ul>
      <li><NuxtLink to="/api/blob-provider">BlobProvider</NuxtLink> — same slot API, without the anchor.</li>
      <li><NuxtLink to="/api/pdf-viewer">PDFViewer</NuxtLink> — inline preview in an iframe.</li>
    </ul>
  </div>
</template>
