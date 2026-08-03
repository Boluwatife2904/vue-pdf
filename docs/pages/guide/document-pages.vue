<script setup lang="ts">
usePageSeo(
  "Document & Pages",
  "Learn how to structure vue-pdf documents with Document and Page components. Control page size, orientation, and layout.",
)

const codeExample1 = `<template>
  <Document title="My Report" author="John Doe">
      <Page size="A4">
        <Text>Hello, PDF!</Text>
      </Page>
    </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <!-- 4x6 inches (288pt x 432pt) -->
    <Page :size="[288, 432]">
      <Text>Custom-sized page</Text>
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page>
      <View>
        <Text>This is on page 1</Text>
      </View>
      <View style="break: 'before'">
        <Text>This starts on a new page</Text>
      </View>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Core Concepts</div>
    <h1>Document &amp; Pages</h1>
    <p>
      Every vue-pdf document is built using the <code>&lt;Document&gt;</code> root component and one or more
      <code>&lt;Page&gt;</code> children. Together they define the overall structure and page-level properties
      of your PDF.
    </p>

    <h2>The Document Component</h2>
    <p>
      <code>&lt;Document&gt;</code> is the root of every PDF. It accepts optional metadata props and wraps all
      pages. It is also responsible for providing the renderer context to all child components.
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h3>Document Props</h3>
    <DocsPropsTable
      :rows="[
        { name: 'title', type: 'string', description: 'PDF document title (metadata).' },
        { name: 'author', type: 'string', description: 'PDF document author (metadata).' },
        { name: 'subject', type: 'string', description: 'PDF document subject (metadata).' },
        { name: 'keywords', type: 'string', description: 'PDF document keywords (metadata).' },
        { name: 'creator', type: 'string', description: 'PDF document creator (metadata).' },
        { name: 'producer', type: 'string', description: 'PDF document producer (metadata).' },
        { name: 'pageLayout', type: 'string', description: 'Page layout mode for the PDF viewer.' },
        { name: 'pageMode', type: 'string', description: 'Page display mode for the PDF viewer.' },
        { name: 'onRender', type: '(props: OnRenderProps) => void', description: 'Callback after each successful render.' },
      ]"
    />

    <h2>The Page Component</h2>
    <p>
      Each <code>&lt;Page&gt;</code> represents a single page in the PDF. Pages define their dimensions
      and serve as containers for all content.
    </p>

    <h3>Page Props</h3>
    <DocsPropsTable
      :rows="[
        {
          name: 'size',
          type: 'PageSize | [number, number]',
          default: '\'A4\'',
          description: 'Page size. Use named sizes (\'A4\', \'LETTER\', \'LEGAL\', etc.) or custom [width, height] in points.',
        },
        {
          name: 'orientation',
          type: '\'portrait\' | \'landscape\'',
          default: '\'portrait\'',
          description: 'Page orientation.',
        },
        {
          name: 'style',
          type: 'Style',
          description: 'Style object for the page container. Supports padding, background, and flex layout.',
        },
        {
          name: 'wrap',
          type: 'boolean',
          default: 'true',
          description: 'Whether content should wrap to the next page when it exceeds the current one.',
        },
        {
          name: 'debug',
          type: 'boolean',
          default: 'false',
          description: 'Display debug borders on layout elements.',
        },
        {
          name: 'dpi',
          type: 'number',
          default: '72',
          description: 'DPI for the page. Affects image and canvas rendering.',
        },
      ]"
    />

    <h2>Predefined Page Sizes</h2>
    <p>vue-pdf includes all common page sizes:</p>

    <div class="size-grid">
      <div class="size-item">
        <code>A0 — A10</code>
        <span>ISO 216 A-series</span>
      </div>
      <div class="size-item">
        <code>B0 — B10</code>
        <span>ISO 216 B-series</span>
      </div>
      <div class="size-item">
        <code>C0 — C10</code>
        <span>ISO 216 C-series</span>
      </div>
      <div class="size-item">
        <code>LETTER</code>
        <span>8.5 × 11 in</span>
      </div>
      <div class="size-item">
        <code>LEGAL</code>
        <span>8.5 × 14 in</span>
      </div>
      <div class="size-item">
        <code>TABLOID</code>
        <span>11 × 17 in</span>
      </div>
      <div class="size-item">
        <code>EXECUTIVE</code>
        <span>7.25 × 10.5 in</span>
      </div>
      <div class="size-item">
        <code>POSTCARD</code>
        <span>4 × 6 in</span>
      </div>
    </div>

    <h2>Custom Page Size</h2>
    <p>Pass an array of <code>[width, height]</code> in points (1 point = 1/72 inch):</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>Page Break</h2>
    <p>Use the <code>break</code> style property on any element to force a page break:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.size-grid {
  @apply grid gap-2.5 my-4 mb-8;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.size-item {
  @apply px-4 py-3 flex flex-col gap-1 border border-[var(--color-border)] rounded-md;
  background: var(--color-code-bg);
}

.size-item code {
  @apply font-mono text-[13px] bg-transparent border-none p-0;
  color: var(--color-link);
}

.size-item span {
  @apply text-xs;
  color: var(--color-muted);
}
</style>
