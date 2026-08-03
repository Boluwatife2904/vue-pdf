<script setup lang="ts">
usePageSeo(
  "Text Styling Example",
  "Text styling examples for vue-pdf — fonts, colors, decoration, truncation, and inline styling.",
)

const tspanExample = `<template>
  <Document>
    <Page size="A4">
      <Text :style="{ fontSize: 14, lineHeight: 1.8 }">
        This is normal text with{' '}
        <Tspan :style="{ fontWeight: 'bold', color: '#dc2626' }">
          bold red
        </Tspan>{' '}
        and{' '}
        <Tspan :style="{ fontStyle: 'italic', color: '#2563eb' }">
          italic blue
        </Tspan>{' '}
        inline segments. You can also add{' '}
        <Tspan :style="{
          textDecoration: 'underline',
          textDecorationColor: '#059669',
          textDecorationStyle: 'wavy',
        }">
          wavy underlines
        </Tspan>
        {' '}for emphasis.
      </Text>
    </Page>
  </Document>
</template>`

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <!-- Basic typography -->
      <Text :style="{
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
        marginBottom: 12,
      }">
        Typography Demo
      </Text>

      <!-- Underlined text -->
      <Text :style="{
        fontSize: 14,
        textDecoration: 'underline',
        textDecorationColor: '#2563eb',
        marginBottom: 8,
      }">
        This text has a blue underline.
      </Text>

      <!-- Line-through -->
      <Text :style="{
        fontSize: 14,
        textDecoration: 'line-through',
        textDecorationColor: '#dc2626',
        marginBottom: 8,
      }">
        This text is struck through.
      </Text>

      <!-- Text transform -->
      <Text :style="{
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
      }">
        Uppercase with letter spacing
      </Text>

      <!-- Justified text -->
      <Text :style="{
        fontSize: 11,
        textAlign: 'justify',
        lineHeight: 1.8,
        marginBottom: 16,
      }">
        This paragraph uses justified text alignment. The text
        engine distributes spacing between words to align both
        the left and right edges, creating a clean, professional
        appearance suitable for formal documents and publications.
      </Text>

      <!-- Truncated text -->
      <Text :style="{
        fontSize: 12,
        width: 300,
      }" :maxLines="2">
        This long text will be truncated after two lines with an
        ellipsis. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Vestibulum nec odio at nisi vehicula.
      </Text>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Examples</div>
    <h1>Text Styling</h1>
    <p>Examples of various text styling capabilities in vue-pdf.</p>

    <h2>Text Decoration &amp; Styling</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Inline Styling with Tspan</h2>

    <DocsCodeBlock
      lang="vue"
      :code="tspanExample"
    />
  </div>
</template>
