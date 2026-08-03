<script setup lang="ts">
usePageSeo(
  "Quick Start",
  "Start generating PDFs with vue-pdf. Build your first document using Vue components — Document, Page, View, and Text.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <View style="padding: 40px">
        <Text style="font-size: 18px; font-family: 'Helvetica'">
          Hello, World!
        </Text>
      </View>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4" style="padding: 40px">
      <Text style="font-size: 24px; margin-bottom: 16px">
        Page 1 — Title
      </Text>
      <Text style="font-size: 12px">
        Content for the first page.
      </Text>
    </Page>

    <Page size="LETTER" style="padding: 40px">
      <Text style="font-size: 24px; margin-bottom: 16px">
        Page 2 — More Content
      </Text>
      <Text style="font-size: 12px">
        Content for the second page.
      </Text>
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4">
      <View style="display: flex; flex-direction: row; padding: 40px">
        <View style="flex: 1; padding: 20px; background-color: #f0f0f0">
          <Text style="font-size: 16px">Left Column</Text>
        </View>
        <View style="flex: 1; padding: 20px; background-color: #e0e0e0">
          <Text style="font-size: 16px">Right Column</Text>
        </View>
      </View>
    </Page>
  </Document>
</template>`

const codeExample4 = `<script setup lang="ts">
import { PDFViewer } from '@vue-pdf/renderer'
import MyDocument from './MyDocument.vue'
<\/script>

<template>
  <PDFViewer :style="{ width: '100%', height: '600px' }">
    <MyDocument />
  </PDFViewer>
</template>`

const codeExample5 = `<script setup lang="ts">
import { PDFDownloadLink } from '@vue-pdf/renderer'
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
</script>

<template>
  <div class="prose">
    <div class="page-label">Getting Started</div>
    <h1>Quick Start</h1>
    <p>
      After installing <code>@vue-pdf/renderer</code> (or <code>@vue-pdf/nuxt</code> for Nuxt), you can start
      composing PDF documents using Vue components.
    </p>

    <h2>Minimal Document</h2>
    <p>Every PDF document starts with a <code>&lt;Document&gt;</code> containing one or more <code>&lt;Page&gt;</code> elements:</p>

    <DocsCodeBlock
      lang="vue"
      filename="MyDocument.vue"
      :code="codeExample1"
    />

    <h2>Rendering in the Browser</h2>
    <p>
      Slot your document into <code>&lt;PDFViewer&gt;</code> to preview it in an iframe. It renders the PDF
      for you and re-renders whenever the document changes:
    </p>

    <DocsCodeBlock
      lang="vue"
      filename="PDFPreview.vue"
      :code="codeExample4"
    />

    <div class="callout callout-info">
      Need the blob or the render loop itself? <NuxtLink to="/api/blob-provider">BlobProvider</NuxtLink> hands
      you <code>{ url, blob, error, loading }</code> in a scoped slot, and
      <NuxtLink to="/api/use-pdf">usePDF</NuxtLink> gives you a
      <code>[state, update]</code> tuple to drive yourself.
    </div>

    <div class="callout callout-warn">
      These are browser-only. For server-side rendering, see the
      <NuxtLink to="/api/pdf-function">pdf() function</NuxtLink> and
      <NuxtLink to="/api/render-to-file">renderToFile</NuxtLink> APIs.
    </div>

    <h2>Adding Pages</h2>
    <p>Add multiple pages to your document. Each page can have its own size and orientation:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>Styling with Flexbox</h2>
    <p>Every <code>&lt;View&gt;</code> is a flex container. Use standard flex properties for layout:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <h2>Generating a Download</h2>
    <p>Use <code>PDFDownloadLink</code> to create a downloadable link:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample5"
    />

    <h2>Server-Side Rendering</h2>
    <p>On Node.js, use the <code>pdf()</code> function to generate PDFs programmatically:</p>

    <DocsCodeBlock
      lang="ts"
      filename="generate.ts"
      :code="`import { pdf } from '@vue-pdf/renderer'
import { createSSRApp } from 'vue'
import MyDocument from './MyDocument.vue'

const app = createSSRApp(MyDocument)
const instance = pdf(app)

// Generate as buffer
const buffer = await instance.toBuffer()

// Or save to file
await instance.toBlob().then(blob => {
  // Write blob to file...
})`"
    />

    <h2>Next Steps</h2>
    <ul>
      <li><NuxtLink to="/guide/document-pages">Deep dive into Document &amp; Pages →</NuxtLink></li>
      <li><NuxtLink to="/guide/styling">Learn about styling options →</NuxtLink></li>
      <li><NuxtLink to="/api/text">Explore the Text component API →</NuxtLink></li>
      <li><NuxtLink to="/examples/basic">See more usage examples →</NuxtLink></li>
    </ul>
  </div>
</template>
