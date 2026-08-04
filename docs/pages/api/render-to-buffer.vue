<script setup lang="ts">
usePageSeo(
  "renderToBuffer",
  "API reference for renderToBuffer — render a PDF document to a Node Buffer.",
)

const usage = `import { renderToBuffer } from '@vuepdf/renderer'
import MyDocument from './MyDocument.vue'

const buffer = await renderToBuffer(MyDocument)

// Write it, upload it, or attach it
await fs.promises.writeFile('out.pdf', buffer)`

const email = `import { renderToBuffer } from '@vuepdf/renderer'
import Invoice from './Invoice.vue'

const buffer = await renderToBuffer(Invoice)

await transporter.sendMail({
  to: 'customer@example.com',
  subject: 'Your invoice',
  attachments: [{ filename: 'invoice.pdf', content: buffer }],
})`

const nuxtRoute = `// server/api/invoice/[id].get.ts
import { renderToBuffer } from '@vuepdf/renderer'
import InvoiceDocument from '../../../components/pdf/InvoiceDocument.vue'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const record = await useDb().findInvoice(id)

  if (!record) {
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  }

  const buffer = await renderToBuffer(InvoiceDocument, {
    id,
    total: record.total,
  })

  setHeader(event, 'content-type', 'application/pdf')
  setHeader(event, 'content-length', buffer.length)
  setHeader(event, 'content-disposition', \`attachment; filename="invoice-\${id}.pdf"\`)

  return buffer
})`

const nuxtDocument = `<!-- components/pdf/InvoiceDocument.vue -->
<script setup lang="ts">
import { Document, Page, Text } from '@vuepdf/renderer/components'

const props = defineProps<{
  id: string
  total: string
}>()
<\/script>

<template>
  <Document :title="\`Invoice \${props.id}\`">
    <Page size="A4" :style="{ padding: 48, fontSize: 12 }">
      <Text :style="{ fontSize: 22, marginBottom: 16 }">
        Invoice {{ props.id }}
      </Text>
      <Text>
        Total due: {{ props.total }}
      </Text>
    </Page>
  </Document>
</template>`

const nuxtCached = `// server/api/report.get.ts
import { renderToBuffer } from '@vuepdf/renderer'
import ReportDocument from '../../components/pdf/ReportDocument.vue'

// Nitro's cache stores JSON, which does not survive a Buffer — keep base64
// in the cache and rehydrate on the way out.
const buildPdf = defineCachedFunction(
  async () => (await renderToBuffer(ReportDocument)).toString('base64'),
  { maxAge: 60 * 60, name: 'report-pdf', getKey: () => 'latest' },
)

export default defineEventHandler(async (event) => {
  const buffer = Buffer.from(await buildPdf(), 'base64')

  setHeader(event, 'content-type', 'application/pdf')
  setHeader(event, 'content-length', buffer.length)

  return buffer
})`
</script>

<template>
  <div class="prose">
    <div class="page-label">Node API</div>
    <h1>renderToBuffer</h1>
    <p>
      Renders a PDF document and resolves with a Node <code>Buffer</code>. Use this when you need the bytes in
      memory — to upload them, attach them to an email, or hand them to another library.
    </p>

    <h2>Signature</h2>
    <DocsCodeBlock
      lang="ts"
      :code="`function renderToBuffer(
  element: Component,
  props?: Record<string, unknown>
): Promise<Buffer>`"
    />

    <h2>Usage</h2>
    <DocsCodeBlock lang="ts" :code="usage" />

    <h2>Attaching to an Email</h2>
    <DocsCodeBlock lang="ts" :code="email" />

    <h2>Nuxt Server Route</h2>
    <p>
      Returning a <code>Buffer</code> from an event handler is enough — Nitro sends it as-is. Because you hold
      the whole document in memory you can set <code>content-length</code> and force a download:
    </p>

    <DocsCodeBlock lang="ts" filename="server/api/invoice/[id].get.ts" :code="nuxtRoute" />
    <DocsCodeBlock lang="vue" filename="components/pdf/InvoiceDocument.vue" :code="nuxtDocument" />

    <div class="callout callout-warn">
      Keep the PDF primitive imports in the document SFC, not the server route. In server routes, import the
      document component and pass props as the second argument to <code>renderToBuffer</code>.
      Importing a <code>.vue</code> document from <code>server/</code> requires the
      <NuxtLink to="/installation">@vuepdf/nuxt</NuxtLink> module — see
      <NuxtLink to="/api/render-to-stream">renderToStream</NuxtLink> for why.
    </div>

    <h3>Caching the Result</h3>
    <p>
      Rendering is CPU-bound. If the document changes rarely, wrap it in
      <code>defineCachedFunction</code> so repeat requests serve stored bytes:
    </p>

    <DocsCodeBlock lang="ts" filename="server/api/report.get.ts" :code="nuxtCached" />

    <div class="callout callout-warn">
      Do not cache the <code>Buffer</code> itself. Nitro's cache serializes to JSON, so a cached
      <code>Buffer</code> comes back as <code>{ type: 'Buffer', data: [...] }</code> — the first request
      succeeds and every cache hit afterwards fails with
      <code>ERR_HTTP_INVALID_HEADER_VALUE</code> on <code>content-length</code>. Store base64 and rehydrate,
      as above.
    </div>

    <h2>Choosing Between the Node APIs</h2>
    <DocsPropsTable
      :rows="[
        { name: 'renderToBuffer', type: 'Promise<Buffer>', description: 'You need the bytes in memory — uploads, email attachments, further processing.' },
        { name: 'renderToStream', type: 'Promise<ReadableStream>', description: 'You are piping to an HTTP response or a file and want to avoid buffering the whole document.' },
        { name: 'renderToFile', type: 'Promise<void>', description: 'You just want the PDF written to a path on disk.' },
      ]"
    />

    <div class="callout callout-info">
      This is a Node-only API. Calling it in a browser build throws — use
      <NuxtLink to="/api/pdf-function">pdf()</NuxtLink> and <code>toBlob()</code> there instead.
    </div>
  </div>
</template>
