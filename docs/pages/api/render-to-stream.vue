<script setup lang="ts">
usePageSeo(
  "renderToStream",
  "API reference for renderToStream — stream a PDF directly to an HTTP response or writable stream.",
)

const express = `import { renderToStream } from '@vue-pdf/renderer'
import MyDocument from './MyDocument.vue'

app.get('/pdf', async (req, res) => {
  const stream = await renderToStream(MyDocument)

  res.setHeader('Content-Type', 'application/pdf')
  stream.pipe(res)
})`

const nuxtRoute = `// server/api/report.get.ts
import { renderToStream } from '@vue-pdf/renderer'
import ReportDocument from '../../components/pdf/ReportDocument.vue'

export default defineEventHandler(async (event) => {
  const { title = 'Report' } = getQuery(event) as { title?: string }

  setHeader(event, 'content-type', 'application/pdf')
  setHeader(event, 'content-disposition', 'inline; filename="report.pdf"')

  return sendStream(event, await renderToStream(ReportDocument, { title }))
})`

const nuxtDocument = `<!-- components/pdf/ReportDocument.vue -->
<script setup lang="ts">
import { Document, Page, Text } from '@vue-pdf/renderer/components'

defineProps<{ title: string }>()
<\/script>

<template>
  <Document :title="title">
    <Page size="A4" :style="{ padding: 48, fontSize: 12 }">
      <Text :style="{ fontSize: 24, marginBottom: 12 }">
        {{ title }}
      </Text>
      <Text>
        Generated on the server with renderToStream.
      </Text>
    </Page>
  </Document>
</template>`

const nuxtUsage = `<template>
  <a href="/api/report?title=Quarterly%20Report" target="_blank">
    Open the PDF
  </a>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Node API</div>
    <h1>renderToStream</h1>
    <p>Renders a PDF document and returns a readable stream, ideal for piping directly to HTTP responses.</p>

    <h2>Signature</h2>
    <DocsCodeBlock
      lang="ts"
      :code="`function renderToStream(
  element: Component,
  props?: Record<string, unknown>
): Promise<ReadableStream>`"
    />

    <h2>Usage</h2>
    <DocsCodeBlock lang="ts" :code="express" />

    <h2>Nuxt Server Route</h2>
    <p>
      In a Nuxt app, a route under <code>server/api/</code> can stream the PDF straight to the client with
      h3's <code>sendStream</code>:
    </p>

    <DocsCodeBlock lang="ts" filename="server/api/report.get.ts" :code="nuxtRoute" />
    <DocsCodeBlock lang="vue" filename="components/pdf/ReportDocument.vue" :code="nuxtDocument" />

    <DocsCodeBlock lang="vue" :code="nuxtUsage" />

    <div class="callout callout-info">
      <p>
        Keep PDF component imports inside the document component. Nitro can import the document SFC from the
        server route, and the document can import primitives from
        <code>@vue-pdf/renderer/components</code>.
      </p>
      <p>
        For generated trees without Vue templates, <code>@vue-pdf/renderer/primitives</code> remains available.
      </p>
    </div>

    <div class="callout callout-warn">
      Importing a <code>.vue</code> document from a server route requires the
      <NuxtLink to="/installation">@vue-pdf/nuxt</NuxtLink> module. Nitro bundles <code>server/</code> without
      Vue support, so the module registers a Vue SFC plugin for it; without that the build fails with
      <code>rollup-plugin-inject: failed to parse YourDocument.vue</code>. Outside Nuxt — plain Node or
      Express — either precompile the SFC in your own build, or build the document from
      <code>@vue-pdf/renderer/primitives</code> instead.
    </div>

    <div class="callout callout-info">
      Need the same document in the browser? Render it client-side with
      <NuxtLink to="/api/use-pdf">usePDF</NuxtLink> or
      <NuxtLink to="/api/pdf-download-link">PDFDownloadLink</NuxtLink>.
    </div>

    <h2>Related</h2>
    <p>
      Use <NuxtLink to="/api/render-to-buffer">renderToBuffer</NuxtLink> when you need the bytes in memory
      rather than a stream — for caching, uploading, or setting an explicit
      <code>content-length</code>.
    </p>
  </div>
</template>
