<script setup lang="ts">
usePageSeo(
  "Basic Document Example",
  "A basic vue-pdf example — creating a simple PDF document with Vue components.",
)

const codeExample1 = `<template>
  <Document
      title="Basic Document"
      author="Your Name"
    >
      <Page size="A4" :style="{ padding: 40 }">
        <Text :style="{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 20,
          fontFamily: 'Helvetica',
        }">
          My First PDF Document
        </Text>

        <View :style="{
          borderBottomWidth: 2,
          borderBottomColor: '#dc2626',
          marginBottom: 20,
        }" />

        <Text :style="{
          fontSize: 12,
          lineHeight: 1.8,
          textAlign: 'justify',
          marginBottom: 16,
        }">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </Text>

        <Text :style="{
          fontSize: 12,
          lineHeight: 1.8,
          textAlign: 'justify',
        }">
          Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt
          in culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </Page>
    </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Examples</div>
    <h1>Basic Document</h1>
    <p>A minimal PDF document with a title, paragraph, and simple layout.</p>

    <DocsCodeBlock
      lang="vue"
      filename="BasicDocument.vue"
      :code="codeExample1"
    />
  </div>
</template>
