<script setup lang="ts">
usePageSeo(
  "Text API",
  "Full API reference for the Text component — text rendering, styling, and advanced layout in vue-pdf.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
        marginBottom: 12,
      }">
        Heading Text
      </Text>

      <Text :style="{
        fontSize: 12,
        lineHeight: 1.6,
        textAlign: 'justify',
      }">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{ fontSize: 12 }" :maxLines="2">
        This text will be truncated at two lines if it exceeds
        the available width. Any content beyond two lines will
        be hidden and replaced with an ellipsis character.
      </Text>
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{ fontSize: 14 }">
        This is normal text,
        <Tspan :style="{ fontWeight: 'bold', color: '#dc2626' }">
          bold red text,
        </Tspan>
        and
        <Tspan :style="{ fontStyle: 'italic', textDecoration: 'underline' }">
          italic underlined text.
        </Tspan>
      </Text>
    </Page>
  </Document>
</template>`

const codeExample4 = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{
        fontSize: 14,
        textDecoration: 'underline',
        textDecorationColor: '#dc2626',
        textDecorationStyle: 'wavy',
      }">
        This text has a red wavy underline.
      </Text>
    </Page>
  </Document>
</template>`

const codeExample5 = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{
        fontSize: 12,
        textAlign: 'justify',
        hyphens: 'auto',
        orphans: 3,
        widows: 2,
      }">
        This paragraph uses advanced text layout features. Hyphenation
        is enabled, and orphans/widows control prevents single lines
        from appearing at page boundaries.
      </Text>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>Text</h1>
    <p>
      The <code>&lt;Text&gt;</code> component renders text content. It supports rich styling, paragraph
      layout, and inline segments using <code>&lt;Tspan&gt;</code>.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'style', type: 'Style', description: 'Standard style object. Supports all typography and layout properties.' },
        { name: 'fixed', type: 'boolean', description: 'When true, the element is fixed and repeated on every page.' },
        { name: 'render', type: '(props: { pageNumber: number, subPageNumber: number }) => string', description: 'Render prop for conditional text per-page.' },
        { name: 'debug', type: 'boolean', description: 'Show debug borders for this element.' },
        { name: 'hyphens', type: 'boolean', default: 'true', description: 'Enable/disable hyphenation for this text block.' },
        { name: 'minPresenceAhead', type: 'number', default: '0', description: 'Prevents page breaks when fewer than N points remain.' },
        { name: 'wrap', type: 'boolean', default: 'true', description: 'Whether text can wrap.' },
        { name: 'maxLines', type: 'number', description: 'Maximum number of lines to render. Extra text is truncated.' },
      ]"
    />

    <h2>Usage</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Text Truncation</h2>
    <p>Use <code>maxLines</code> to limit text and add an ellipsis:</p>

    <DocsCodeBlock
      lang="vue" :code="codeExample2"
    />

    <h2>Inline Styling with Tspan</h2>
    <p>Use <code>&lt;Tspan&gt;</code> for styled inline text segments:</p>

    <DocsCodeBlock
      lang="vue" :code="codeExample3"
    />

    <h2>Text Decoration</h2>
    <DocsPropsTable
      :rows="[
        { name: 'textDecoration', type: '\'underline\' | \'line-through\' | \'underline line-through\'', description: 'Add lines to text.' },
        { name: 'textDecorationColor', type: 'string', description: 'Color of decoration lines.' },
        { name: 'textDecorationStyle', type: '\'solid\' | \'dashed\' | \'dotted\' | \'wavy\'', default: '\'solid\'', description: 'Style of decoration lines.' },
      ]"
    />

    <DocsCodeBlock
      lang="vue" :code="codeExample4"
    />

    <h2>Advanced Typography</h2>
    <p>
      vue-pdf includes a sophisticated text layout engine (<code>@vue-pdf/textkit</code>) that handles:
    </p>

    <ul>
      <li>Line breaking (Knuth-Plass, best-fit)</li>
      <li>Hyphenation (with configurable callbacks)</li>
      <li>Text justification and alignment</li>
      <li>Right-to-left (RTL) and bidirectional text</li>
      <li>Script itemization (Latin, Arabic, CJK, etc.)</li>
      <li>Orphans and widows control</li>
    </ul>

    <DocsCodeBlock
      lang="vue" :code="codeExample5"
    />

    <div class="callout callout-info">
      The text layout engine processes text paragraph-by-paragraph. Each <code>&lt;Text&gt;</code> component
      represents a single paragraph. Use multiple <code>&lt;Text&gt;</code> components for separate paragraphs.
    </div>
  </div>
</template>
