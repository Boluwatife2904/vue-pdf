<script setup lang="ts">
usePageSeo(
  "Images",
  "Learn how to embed and style images in vue-pdf documents. Supported formats: PNG, JPEG, and SVG.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <Image
        src="/logo.png"
        :style="{ width: 150, height: 50, marginBottom: 20 }"
      />
      <Text>Your content here...</Text>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <!-- Fixed dimensions -->
      <Image
        src="/photo.jpg"
        :style="{ width: 200, height: 150 }"
      />

      <!-- Auto height (preserves aspect ratio) -->
      <Image
        src="/photo.jpg"
        :style="{ width: 200 }"
      />

      <!-- Auto width (preserves aspect ratio) -->
      <Image
        src="/photo.jpg"
        :style="{ height: 150 }"
      />
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4">
      <ImageBackground
        src="/background.jpg"
        :style="{ width: '100%', height: '100%' }"
      >
        <View :style="{ padding: 40 }">
          <Text :style="{ color: '#fff', fontSize: 24 }">
            Overlay text on image
          </Text>
        </View>
      </ImageBackground>
    </Page>
  </Document>
</template>`

const codeExample4 = `<template>
  <Document>
    <Page size="A4">
      <Image
        src="/icon.svg"
        :style="{ width: 64, height: 64 }"
      />
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Core Concepts</div>
    <h1>Images</h1>
    <p>
      Use the <code>&lt;Image&gt;</code> component to embed images in your PDF documents. It supports PNG,
      JPEG, and SVG formats.
    </p>

    <h2>Basic Usage</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Image Sources</h2>
    <p>The <code>src</code> prop accepts various source types:</p>

    <ul>
      <li><strong>File path</strong> — Relative or absolute path to an image file</li>
      <li><strong>URL</strong> — Remote image URL (must be CORS-enabled in browser)</li>
      <li><strong>Base64 Data URI</strong> — Inline base64-encoded image data</li>
      <li><strong>Buffer</strong> — Node.js Buffer containing image data</li>
    </ul>

    <DocsCodeBlock
      lang="ts"
      :code="codeExample1"
    />

    <h2>Image Sizing</h2>
    <p>
      By default, images render at their natural size. Control dimensions with standard style properties:
    </p>

    <DocsPropsTable
      :rows="[
        { name: 'src', type: 'string | Buffer', required: true, description: 'Image source. Supports path, URL, data URI, or Buffer.' },
        { name: 'style.width', type: 'number | string', description: 'Image width. If set without height, aspect ratio is preserved.' },
        { name: 'style.height', type: 'number | string', description: 'Image height. If set without width, aspect ratio is preserved.' },
        { name: 'style.objectFit', type: '\'contain\' | \'cover\' | \'fill\' | \'none\' | \'scale-down\'', description: 'How the image scales to fit its container.' },
        { name: 'style.objectPositionX', type: 'number', description: 'Horizontal position of the image within its container.' },
        { name: 'style.objectPositionY', type: 'number', description: 'Vertical position of the image within its container.' },
        { name: 'style.borderRadius', type: 'number', description: 'Border radius for rounded corners.' },
        { name: 'style.opacity', type: 'number', description: 'Opacity from 0 to 1.' },
      ]"
    />

    <h2>Fixed vs Auto Dimensions</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>ImageBackground</h2>
    <p>Use <code>&lt;ImageBackground&gt;</code> to place content over an image:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <h2>SVG Images</h2>
    <p>SVG files are rendered natively — they scale infinitely without quality loss:</p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample4"
    />

    <div class="callout callout-tip">
      For complex SVG graphics, consider using the built-in
      <NuxtLink to="/api/svg">SVG components</NuxtLink> which give you direct control over every element.
    </div>

    <h2>Image Caching</h2>
    <p>
      vue-pdf caches decoded images for performance. On the browser, images are fetched once and reused across
      document renders. On the server, images are cached in memory for the lifetime of the process.
    </p>
  </div>
</template>
