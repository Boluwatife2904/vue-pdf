<script setup lang="ts">
usePageSeo(
  "View API",
  "Full API reference for the View component — the fundamental layout container in vue-pdf.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <View :style="{
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 16,
      }">
        <Text :style="{ fontSize: 16, fontWeight: 'bold' }">
          Section Title
        </Text>
        <Text :style="{ fontSize: 12, marginTop: 8 }">
          Section content goes here.
        </Text>
      </View>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <!-- Fixed header -->
      <View :fixed="true" :style="{
        position: 'absolute',
        top: 20,
        left: 40,
        right: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 8,
      }">
        <Text :style="{ fontSize: 10 }">Company Name — Report Title</Text>
      </View>

      <!-- Fixed footer -->
      <View :fixed="true" :style="{
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 8,
      }">
        <Text :style="{ fontSize: 10, textAlign: 'center' }">
          Page <Text render="{(props) => props.pageNumber}" />
        </Text>
      </View>

      <!-- Main content -->
      <View :style="{ padding: 80, paddingTop: 50 }">
        <Text>Body content that spans multiple pages...</Text>
      </View>
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4">
      <Text
        :render="({ pageNumber, subPageNumber }) => \`Page \${pageNumber}\`&quot;
        :style=&quot;{ fontSize: 10 }&quot;
      />
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>View</h1>
    <p>
      The <code>&lt;View&gt;</code> component is the fundamental layout building block — analogous to a
      <code>&lt;div&gt;</code> in HTML. Every View is a flex container by default.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'style', type: 'Style', description: 'Standard style object. Supports all layout, box model, and appearance properties.' },
        { name: 'fixed', type: 'boolean', description: 'When true, the element is fixed to the page and repeated on every page.' },
        { name: 'render', type: '(props: { pageNumber: number, subPageNumber: number }) => Element | Element[] | null', description: 'Render prop for conditional rendering per-page. Must return plain element objects whose type is a primitive string (e.g. \'VIEW\'), not Vue vnodes.' },
        { name: 'wrap', type: 'boolean', default: 'true', description: 'Whether children can wrap to the next page.' },
        { name: 'debug', type: 'boolean', description: 'Show debug borders for this element.' },
      ]"
    />

    <h2>Usage</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Fixed Elements</h2>
    <p>
      A View with <code>fixed</code> is rendered on every page at the same position. Useful for headers
      and footers:
    </p>

    <DocsCodeBlock
      lang="vue" :code="codeExample2"
    />

    <h2>Render Prop</h2>
    <p>
      The <code>render</code> prop on <code>&lt;Text&gt;</code> provides access to page numbering and
      sub-page data:
    </p>

    <DocsCodeBlock
      lang="vue" :code="codeExample3"
    />
  </div>
</template>
