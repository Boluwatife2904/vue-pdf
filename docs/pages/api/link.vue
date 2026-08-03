<script setup lang="ts">
usePageSeo(
  "Link API",
  "API reference for the Link component — create clickable hyperlinks in PDF documents.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{ fontSize: 12 }">
        Visit our website at{' '}
        <Link src="https://example.com">
          <Text :style="{ color: '#2563eb', textDecoration: 'underline' }">
            example.com
          </Text>
        </Link>
        {' '}for more information.
      </Text>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{ fontSize: 14 }">
        See the{' '}
        <Link src="#conclusion">
          <Text :style="{ color: '#2563eb' }">Conclusion</Text>
        </Link>
        {' '}section for a summary.
      </Text>

      <!-- Later in the document... -->
      <View :id="'conclusion'" :style="{ marginTop: 200 }">
        <Text :style="{ fontSize: 20, fontWeight: 'bold' }">
          Conclusion
        </Text>
        <Text :style="{ fontSize: 12 }">
          Summary of the document content...
        </Text>
      </View>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>Link</h1>
    <p>
      The <code>&lt;Link&gt;</code> component creates a clickable hyperlink inside the PDF document.
      Links can point to external URLs or internal page anchors.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'src', type: 'string', required: true, description: 'The URL or internal anchor target (\'#page-3\', \'#my-anchor\').' },
        { name: 'style', type: 'Style', description: 'Standard style object for the link container.' },
      ]"
    />

    <h2>External Links</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Internal Links</h2>
    <p>Link to other pages or anchored elements within the document:</p>

    <DocsCodeBlock
      lang="vue" :code="codeExample2"
    />

    <div class="callout callout-tip">
      To link to a specific page number, use the format <code>#page-3</code> as the <code>src</code> prop.
    </div>
  </div>
</template>
