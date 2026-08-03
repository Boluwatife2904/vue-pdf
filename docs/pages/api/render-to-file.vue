<script setup lang="ts">
usePageSeo(
  "renderToFile",
  "API reference for renderToFile — render a PDF and write it directly to the filesystem.",
)
</script>

<template>
  <div class="prose">
    <div class="page-label">Node API</div>
    <h1>renderToFile</h1>
    <p>Renders a PDF document and writes it directly to a file on the filesystem.</p>

    <h2>Signature</h2>
    <DocsCodeBlock
      lang="ts"
      :code="`function renderToFile(
  element: Component,
  filePath: string,
  callbackOrProps?: ((output: string, instance: PDFInstance) => void) | Record<string, unknown>,
  props?: Record<string, unknown>
): Promise<void>`"
    />

    <h2>Usage</h2>
    <DocsCodeBlock
      lang="ts"
      :code="`import { renderToFile } from '@vue-pdf/renderer'
import MyDocument from './MyDocument.vue'

await renderToFile(MyDocument, './output.pdf', (output, instance) => {
  console.log('PDF saved to', output)
})`"
    />

    <div class="callout callout-tip">
      <code>renderToFile</code> is a convenience wrapper around <code>pdf().toBuffer()</code> + <code>fs.writeFile</code>.
    </div>

    <h2>Nuxt Server Route</h2>
    <p>
      Writing to disk suits generated artifacts you want to keep — nightly reports, exports a user can
      re-download. Note that a serverless deployment only gives you a writable temp directory, and it does not
      persist between invocations, so prefer
      <NuxtLink to="/api/render-to-buffer">renderToBuffer</NuxtLink> plus object storage there.
    </p>

    <DocsCodeBlock
      lang="ts"
      filename="server/api/export.post.ts"
      :code="`import ExportDocument from '../../components/pdf/ExportDocument.vue'
import { renderToFile } from '@vue-pdf/renderer'
import { join } from 'node:path'
import { mkdir } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  const { label } = await readBody<{ label: string }>(event)

  const dir = join(process.env.EXPORT_DIR ?? './.exports')
  await mkdir(dir, { recursive: true })

  const name = \`export-\${Date.now()}.pdf\`
  await renderToFile(ExportDocument, join(dir, name), { label })

  return { file: name }
})`"
    />

    <DocsCodeBlock
      lang="vue"
      filename="components/pdf/ExportDocument.vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { Document, Page, Text } from '@vue-pdf/renderer/components'

defineProps<{ label: string }>()
<\/script>

<template>
  <Document :title=&quot;label&quot;>
    <Page size=&quot;A4&quot; :style=&quot;{ padding: 48 }&quot;>
      <Text>{{ label }}</Text>
    </Page>
  </Document>
</template>`"
    />

    <div class="callout callout-info">
      Keep the PDF primitive imports in the document SFC. The server route can import the document component
      and pass props as the third argument to <code>renderToFile</code>. Importing a <code>.vue</code>
      document from <code>server/</code> requires the
      <NuxtLink to="/installation">@vue-pdf/nuxt</NuxtLink> module — see
      <NuxtLink to="/api/render-to-stream">renderToStream</NuxtLink> for why.
    </div>
  </div>
</template>
