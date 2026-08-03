<script setup lang="ts">
usePageSeo(
  "Document API",
  "Full API reference for the Document component — props, metadata, and usage.",
)

const codeExample1 = `<template>
  <Document
      title="Annual Report 2024"
      author="Acme Inc."
      subject="Financial Results"
      keywords="annual, report, 2024"
      creator="vue-pdf"
    >
      <Page size="A4">
        <Text>Document content...</Text>
      </Page>
    </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>Document</h1>
    <p>
      The root component of every vue-pdf document. It wraps all pages and provides the rendering context
      that connects Vue components to the PDF output.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'title', type: 'string', description: 'PDF document title — appears in document metadata.' },
        { name: 'author', type: 'string', description: 'PDF document author.' },
        { name: 'subject', type: 'string', description: 'PDF document subject.' },
        { name: 'keywords', type: 'string', description: 'Comma-separated keywords.' },
        { name: 'creator', type: 'string', description: 'Application that created the document.' },
        { name: 'producer', type: 'string', description: 'Application that produced the PDF.' },
        { name: 'pageLayout', type: '\'singlePage\' | \'oneColumn\' | \'twoColumnLeft\' | \'twoColumnRight\' | \'twoPageLeft\' | \'twoPageRight\'', description: 'How pages are displayed in the PDF viewer.' },
        { name: 'pageMode', type: '\'useNone\' | \'useOutlines\' | \'useThumbs\' | \'fullScreen\'', description: 'How the document appears when opened.' },
        { name: 'onRender', type: '(props: { blob?: Blob }) => void', description: 'Called after each render with the resulting blob (browser only).' },
      ]"
    />

    <h2>Usage</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>How It Works</h2>
    <p>
      <code>&lt;Document&gt;</code> creates a rendering context via Vue's <code>provide/inject</code>.
      Child components (<code>&lt;Page&gt;</code>, <code>&lt;Text&gt;</code>, <code>&lt;View&gt;</code>, etc.)
      register themselves with this context. When the tree is complete, the reconciler walks the mounted DOM,
      builds an internal instance tree, and passes it to the PDF layout and render pipeline.
    </p>

    <p>
      When used with <code>usePDF</code> or <code>&lt;PDFViewer&gt;</code>, the Document connects to a sink
      that receives the PDF output. When used standalone (on the server), it creates its own
      <code>pdf()</code> instance and calls <code>updateContainer()</code> on re-render.
    </p>

    <div class="callout callout-info">
      <code>&lt;Document&gt;</code> expects only <code>&lt;Page&gt;</code> children. All content must be placed
      inside a <code>&lt;Page&gt;</code>.
    </div>
  </div>
</template>
