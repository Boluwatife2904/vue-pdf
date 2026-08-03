<script setup lang="ts">
usePageSeo(
  "Note API",
  "API reference for the Note component — PDF annotations and comments.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{ fontSize: 14, marginBottom: 20 }">
        This paragraph has a note attached about the content.
      </Text>

      <Note :style="{ position: 'absolute', left: 20, top: 100 }">
        This is a reviewer comment about the paragraph above.
      </Note>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>Note</h1>
    <p>
      The <code>&lt;Note&gt;</code> component creates a PDF annotation — a sticky note or comment attached
      to a specific position on the page. Notes appear as clickable icons in PDF viewers.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'style', type: 'Style', description: 'Position and size of the note icon on the page.' },
      ]"
    />

    <h2>Usage</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <div class="callout callout-info">
      Not all PDF viewers display annotations the same way. For maximum compatibility, use notes sparingly
      and provide the note text as child content.
    </div>
  </div>
</template>
