<script setup lang="ts">
usePageSeo(
  "Image API",
  "API reference for the Image and ImageBackground components — embed images in PDF documents.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <!-- Local path -->
      <Image src="/assets/logo.png" />

      <!-- Remote URL -->
      <Image src="https://example.com/photo.jpg" />

      <!-- Base64 Data URI -->
      <Image src="data:image/svg+xml;base64,PHN2ZyB..." />
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <Image
        src="/photo.jpg"
        :style="{
          width: 200,
          height: 200,
          objectFit: 'cover',
          objectPositionX: 0.5,
          objectPositionY: 0.3,
          borderRadius: 8,
        }"
      />
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>Image</h1>
    <p>
      The <code>&lt;Image&gt;</code> component renders an image from a file path, URL, or data source.
      Supports PNG, JPEG, and SVG formats.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'src', type: 'string | Buffer', required: true, description: 'Image source. Path, URL, base64 data URI, or Buffer.' },
        { name: 'style', type: 'Style', description: 'Standard style object. Common: width, height, objectFit, borderRadius.' },
        { name: 'fixed', type: 'boolean', description: 'Repeat on every page.' },
        { name: 'debug', type: 'boolean', description: 'Show debug borders.' },
        { name: 'cache', type: 'boolean', default: 'true', description: 'Whether to cache the decoded image.' },
      ]"
    />

    <h2>Source Types</h2>
    <DocsCodeBlock
      lang="vue" :code="codeExample1"
    />

    <h2>Object Fit</h2>
    <DocsCodeBlock
      lang="vue" :code="codeExample2"
    />
  </div>
</template>
