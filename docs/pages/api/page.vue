<script setup lang="ts">
usePageSeo(
  "Page API",
  "Full API reference for the Page component — size, orientation, wrapping, and debugging options.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <!-- Common sizes -->
      <Page size="A4">
      <Page size="LETTER">
      <Page size="LEGAL">

      <!-- Custom numeric size (points) -->
      <Page :size="[595, 842]"> <!-- A4 in points -->
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4" :style="{
      padding: 40,
      paddingTop: 60,
      backgroundColor: '#ffffff',
    }">
      <Text>Page content with 40pt padding on all sides...</Text>
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{ fontSize: 12 }">
        Very long text that naturally flows...
      </Text>
      <!-- If text overflows, it wraps to a new page automatically -->
    </Page>
  </Document>
</template>`

const codeExample4 = `<template>
  <Document>
    <Page size="A4" :debug="true">
      <View :style="{ padding: 20 }">
        <Text>Debug mode shows element boundaries</Text>
      </View>
    </Page>
  </Document>
</template>`

const codeExample5 = `<template>
  <Document>
    <Page size="A4" :wrap="false">
      <Text>Single-page document — no wrapping</Text>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>Page</h1>
    <p>
      Defines a single page in the PDF document. Each page can have its own size, orientation, and styles.
      Content that overflows a page automatically wraps to the next one.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        {
          name: 'size',
          type: 'PageSize | [number, number]',
          default: '\'A4\'',
          description: 'Named page size or custom [width, height] in points. Available: A0-A10, B0-B10, C0-C10, LETTER, LEGAL, TABLOID, EXECUTIVE, POSTCARD.',
        },
        {
          name: 'orientation',
          type: '\'portrait\' | \'landscape\'',
          default: '\'portrait\'',
          description: 'Page orientation. Swaps width and height when set to landscape.',
        },
        {
          name: 'style',
          type: 'Style',
          description: 'Page-level styles. Supports padding, backgroundColor, and flex layout properties.',
        },
        {
          name: 'wrap',
          type: 'boolean',
          default: 'true',
          description: 'When true, content that overflows automatically continues on the next page.',
        },
        {
          name: 'debug',
          type: 'boolean',
          default: 'false',
          description: 'When enabled, every layout element shows a colored border for debugging.',
        },
        {
          name: 'dpi',
          type: 'number',
          default: '72',
          description: 'Dots per inch for the page rasterization. Higher values increase image/canvas resolution.',
        },
      ]"
    />

    <h2>Named Page Sizes</h2>
    <p>Standard sizes available as string constants:</p>

    <DocsCodeBlock
      lang="vue" :code="codeExample1"
    />

    <h2>Page With Padding</h2>
    <p>Use the <code>style</code> prop to add padding around page content:</p>

    <DocsCodeBlock
      lang="vue" :code="codeExample2"
    />

    <h2>Enabled Wrapping</h2>
    <p>By default (<code>wrap: true</code>), content that exceeds a page will flow to the next one:</p>

    <DocsCodeBlock
      lang="vue" :code="codeExample3"
    />

    <h2>Debug Mode</h2>
    <p>Enable <code>debug</code> to see colored borders around every element — useful during layout development:</p>

    <DocsCodeBlock
      lang="vue" :code="codeExample4"
    />

    <h2>Fixed Page</h2>
    <p>Set <code>wrap: false</code> for single-page documents where overflow should be clipped:</p>

    <DocsCodeBlock
      lang="vue" :code="codeExample5"
    />
  </div>
</template>
