<script setup lang="ts">
usePageSeo(
  "PDFViewer",
  "API reference for the PDFViewer component — embed an interactive PDF viewer.",
)

const codeExample1 = `<script setup lang="ts">
import { PDFViewer } from '@vuepdf/renderer'
<\/script>

<template>
  <PDFViewer :style="{ width: '100%', height: '600px' }">
    <Document>
      <Page size="A4">
        <View :style="{ padding: 40 }">
          <Text :style="{ fontSize: 24 }">Hello, PDF!</Text>
        </View>
      </Page>
    </Document>
  </PDFViewer>
</template>`

const codeExample2 = `<script setup lang="ts">
import { PDFViewer } from '@vuepdf/renderer'
import InvoiceDocument from './InvoiceDocument.vue'

const invoice = ref({ id: '123', amount: 1500 })
<\/script>

<template>
  <PDFViewer :style="{ width: '100%', height: '600px' }" :show-toolbar="false">
    <InvoiceDocument :invoice="invoice" />
  </PDFViewer>
</template>`

const codeExample3 = `<script setup lang="ts">
import { PDFViewer } from '@vuepdf/renderer'

const viewer = useTemplateRef('viewer')

const onRender = ({ url, blob }: { url: string; blob: Blob }) => {
  console.log('rendered', url, blob.size)
}
<\/script>

<template>
  <PDFViewer ref="viewer" @render="onRender">
    <MyDocument />
  </PDFViewer>

  <button @click="viewer?.download('report.pdf')">Download</button>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Browser API</div>
    <h1>PDFViewer</h1>
    <p>
      The <code>&lt;PDFViewer&gt;</code> component renders its slotted document inside an
      <code>&lt;iframe&gt;</code>, giving you a live preview that re-renders as the document changes. It runs
      <NuxtLink to="/api/use-pdf">usePDF</NuxtLink> internally.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'style', type: 'Style | Style[] | string', description: 'Style applied to the iframe. Size the viewer here — there are no width/height props.' },
        { name: 'className', type: 'string', description: 'Class applied to the iframe.' },
        { name: 'title', type: 'string', description: 'Title attribute on the iframe, for accessibility.' },
        { name: 'showToolbar', type: 'boolean', default: 'true', description: 'Shows the browser PDF toolbar, via the #toolbar fragment on the blob URL.' },
        { name: 'document', type: 'DocumentTree', description: 'A prebuilt document tree ({ type, props, children }), for react-pdf API parity. Optional — prefer the default slot.' },
      ]"
    />

    <div class="callout callout-info">
      <code>document</code> takes a plain <strong>document tree object</strong>. To compose your PDF with the
      usual components, slot it in the default slot instead.
    </div>

    <h2>Slots</h2>
    <DocsPropsTable
      :rows="[
        { name: 'default', type: 'slot', description: 'Your <Document> component. Rendered into a hidden container next to the iframe; its assembled tree drives the preview.' },
      ]"
    />

    <div class="callout callout-info">
      Note the difference from <NuxtLink to="/api/pdf-download-link">PDFDownloadLink</NuxtLink> and
      <NuxtLink to="/api/blob-provider">BlobProvider</NuxtLink>: those take the document in a
      <code>#document</code> slot because their default slot renders your own markup.
      <code>PDFViewer</code> renders only an iframe, so the document goes in the default slot.
    </div>

    <h2>Events</h2>
    <DocsPropsTable
      :rows="[
        { name: 'render', type: '(payload: { url: string; blob: Blob }) => void', description: 'Emitted every time a new blob is produced, so you can wire up your own download button or upload the result.' },
      ]"
    />

    <h2>Exposed Methods</h2>
    <DocsPropsTable
      :rows="[
        { name: 'download(filename?)', type: '(filename?: string) => void', default: '\'document.pdf\'', description: 'Downloads the currently rendered document.' },
        { name: 'getState()', type: '() => PDFState', description: 'Returns the latest render state: { url, blob, error, loading }.' },
      ]"
    />

    <h2>Usage</h2>
    <p>Place a <code>&lt;Document&gt;</code> in the default slot and size the iframe with <code>style</code>:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <div class="callout callout-warn">
      <code>&lt;PDFViewer&gt;</code> is a browser component, not a PDF primitive — it belongs in your page's
      markup, never inside a <code>&lt;Page&gt;</code>. Wrap it in
      <code>&lt;ClientOnly&gt;</code> in Nuxt, since it needs <code>URL.createObjectURL</code>.
    </div>

    <h2>Previewing a Component</h2>
    <p>Any component that renders a <code>&lt;Document&gt;</code> works, and updates as its props change:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>Downloads and Render Events</h2>
    <p>
      Listen for <code>@render</code> to react to each new blob, or call the exposed
      <code>download()</code> through a template ref:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <h2>See Also</h2>
    <ul>
      <li><NuxtLink to="/api/pdf-download-link">PDFDownloadLink</NuxtLink> — download anchor instead of a preview.</li>
      <li><NuxtLink to="/api/blob-provider">BlobProvider</NuxtLink> — raw blob and state, no markup.</li>
      <li><NuxtLink to="/api/use-pdf">usePDF</NuxtLink> — the composable all three are built on.</li>
    </ul>
  </div>
</template>
