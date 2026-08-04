<script setup lang="ts">
usePageSeo(
  "Styling",
  "Learn how to style vue-pdf components with CSS-like style objects. Flexbox layout, colors, typography, borders, and more.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <View :style="{ padding: 40, backgroundColor: '#f5f5f5' }">
        <Text :style="{ fontSize: 24, color: '#333', fontWeight: 'bold' }">
          Styled Text
        </Text>
      </View>
    </Page>
  </Document>
</template>`

const mediaQueryExample = `<script setup lang="ts">
import { StyleSheet } from '@vuepdf/renderer'

const styles = StyleSheet.create({
  container: {
    padding: 40,
    flexDirection: 'row',

    // Applied when the page is narrower than 400pt
    '@media max-width: 400': {
      padding: 16,
      flexDirection: 'column',
    },

    // Applied on landscape pages
    '@media orientation: landscape': {
      padding: 60,
    },
  },
})
<\/script>

<template>
  <Document>
    <!-- Same styles, different result per page size -->
    <Page size="A4" :style="styles.container">
      <Text>Roomy</Text>
    </Page>

    <Page :size="[300, 500]" :style="styles.container">
      <Text>Compact</Text>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <!-- Row layout -->
      <View :style="{ flexDirection: 'row', gap: 20, padding: 40 }">
        <View :style="{ flex: 1, padding: 20, backgroundColor: '#e8f5e9' }">
          <Text>Column 1</Text>
        </View>
        <View :style="{ flex: 2, padding: 20, backgroundColor: '#fff3e0' }">
          <Text>Column 2 (wider)</Text>
        </View>
      </View>
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4">
      <View :style="{ position: 'relative', height: 200 }">
        <View :style="{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 100,
          height: 100,
          backgroundColor: '#ff0000'
        }">
          <Text>Absolute</Text>
        </View>
      </View>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Core Concepts</div>
    <h1>Styling</h1>
    <p>
      vue-pdf uses a CSS-like styling API based on the react-pdf style system. Styles are defined as JavaScript
      objects using camelCase property names.
    </p>

    <h2>Basic Styling</h2>
    <p>Pass a style object to the <code>style</code> prop of any component:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Flexbox Layout</h2>
    <p>
      Every <code>&lt;View&gt;</code> is a flex container by default (with <code>flex-direction: column</code>).
      vue-pdf uses Yoga Layout — the same engine as React Native — for precise flexbox calculations.
    </p>

    <h3>Supported Flex Properties</h3>
    <DocsPropsTable
      :rows="[
        { name: 'display', type: '\'flex\' | \'none\'', default: '\'flex\'', description: 'Set display mode.' },
        { name: 'flexDirection', type: '\'row\' | \'column\' | \'row-reverse\' | \'column-reverse\'', default: '\'column\'', description: 'Main axis direction.' },
        { name: 'flexWrap', type: '\'wrap\' | \'nowrap\' | \'wrap-reverse\'', default: '\'nowrap\'', description: 'Whether items can wrap.' },
        { name: 'justifyContent', type: '\'flex-start\' | \'center\' | \'flex-end\' | \'space-between\' | \'space-around\' | \'space-evenly\'', description: 'Alignment along main axis.' },
        { name: 'alignItems', type: '\'flex-start\' | \'center\' | \'flex-end\' | \'stretch\' | \'baseline\'', description: 'Alignment along cross axis.' },
        { name: 'alignSelf', type: '\'auto\' | \'flex-start\' | \'center\' | \'flex-end\' | \'stretch\' | \'baseline\'', description: 'Override align-items for a single child.' },
        { name: 'flex', type: 'number', description: 'Flex grow factor.' },
        { name: 'flexGrow', type: 'number', description: 'Flex grow factor (individual).' },
        { name: 'flexShrink', type: 'number', description: 'Flex shrink factor.' },
        { name: 'flexBasis', type: 'number | string', description: 'Initial size before flex distribution.' },
        { name: 'gap', type: 'number', description: 'Gap between flex items (in points).' },
        { name: 'rowGap', type: 'number', description: 'Row gap between flex items.' },
        { name: 'columnGap', type: 'number', description: 'Column gap between flex items.' },
      ]"
    />

    <h3>Flex Example</h3>
    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>Box Model &amp; Dimensions</h2>
    <DocsPropsTable
      :rows="[
        { name: 'width', type: 'number | string', description: 'Element width. Numbers are in points.' },
        { name: 'height', type: 'number | string', description: 'Element height. Numbers are in points.' },
        { name: 'minWidth', type: 'number', description: 'Minimum width.' },
        { name: 'maxWidth', type: 'number', description: 'Maximum width.' },
        { name: 'minHeight', type: 'number', description: 'Minimum height.' },
        { name: 'maxHeight', type: 'number', description: 'Maximum height.' },
        { name: 'margin', type: 'number', description: 'Shorthand margin. Use marginTop/Right/Bottom/Left for sides.' },
        { name: 'padding', type: 'number', description: 'Shorthand padding. Use paddingTop/Right/Bottom/Left for sides.' },
        { name: 'border', type: 'number | string', description: 'Border width or shorthand (e.g. \'1px solid red\').' },
        { name: 'borderRadius', type: 'number', description: 'Border radius for View components.' },
      ]"
    />

    <h2>Typography</h2>
    <DocsPropsTable
      :rows="[
        { name: 'fontSize', type: 'number', description: 'Font size in points. Default is 12.' },
        { name: 'fontFamily', type: 'string', description: 'Font family name. Options: Helvetica, Times-Roman, Courier, or custom registered fonts.' },
        { name: 'fontWeight', type: 'number | string', description: 'Font weight. 100-900 or \'bold\'.' },
        { name: 'fontStyle', type: '\'normal\' | \'italic\'', description: 'Font style.' },
        { name: 'lineHeight', type: 'number', description: 'Line height multiplier or fixed value in points.' },
        { name: 'letterSpacing', type: 'number', description: 'Letter spacing in points.' },
        { name: 'textAlign', type: '\'left\' | \'center\' | \'right\' | \'justify\'', description: 'Text alignment.' },
        { name: 'textDecoration', type: '\'underline\' | \'line-through\' | \'underline line-through\'', description: 'Text decoration lines.' },
        { name: 'textTransform', type: '\'uppercase\' | \'lowercase\' | \'capitalize\'', description: 'Text transformation.' },
        { name: 'textIndent', type: 'number', description: 'First-line indentation for paragraphs.' },
        { name: 'wordSpacing', type: 'number', description: 'Word spacing in points.' },
        { name: 'hyphens', type: '\'none\' | \'auto\'', description: 'Controls hyphenation. Uses the hyphenation engine.', default: '\'auto\'' },
        { name: 'orphans', type: 'number', description: 'Minimum lines to keep at the bottom of a page.', default: '2' },
        { name: 'widows', type: 'number', description: 'Minimum lines to keep at the top of a page.', default: '2' },
      ]"
    />

    <h2>Colors &amp; Backgrounds</h2>
    <DocsPropsTable
      :rows="[
        { name: 'color', type: 'string', description: 'Text color. Supports hex, rgb(), rgba(), and named CSS colors.' },
        { name: 'backgroundColor', type: 'string', description: 'Background color of the element.' },
        { name: 'opacity', type: 'number', description: 'Opacity from 0 to 1.' },
      ]"
    />

    <h2>Positioning</h2>
    <p>Use absolute positioning within a parent with <code>position: 'relative'</code>:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <div class="callout callout-warn">
      Absolute positioning in PDF layouts works differently than in browser CSS. The parent must have a defined
      <code>height</code> and <code>position: 'relative'</code>.
    </div>

    <h2>Media Queries</h2>
    <p>
      Styles can adapt to the page they render on. A key beginning with <code>@media</code> is matched against
      the page's dimensions and orientation, and its properties are merged in when it matches:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="mediaQueryExample"
    />

    <h3>Supported Features</h3>
    <DocsPropsTable
      :rows="[
        { name: 'min-width', type: 'number', description: 'Matches when the page is at least this wide.' },
        { name: 'max-width', type: 'number', description: 'Matches when the page is at most this wide.' },
        { name: 'min-height', type: 'number', description: 'Matches when the page is at least this tall.' },
        { name: 'max-height', type: 'number', description: 'Matches when the page is at most this tall.' },
        { name: 'orientation', type: '\'portrait\' | \'landscape\'', description: 'Matches the page orientation.' },
      ]"
    />

    <div class="callout callout-info">
      Queries resolve against the <strong>page</strong>, not the viewport or the parent element — there is no
      container-query equivalent. Values are in points, and the syntax is
      <code>'@media &lt;feature&gt;: &lt;value&gt;'</code> without parentheses. Combine features by separating
      them with <code>and</code>.
    </div>
  </div>
</template>
