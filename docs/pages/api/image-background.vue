<script setup lang="ts">
usePageSeo(
  "ImageBackground API",
  "API reference for the ImageBackground component — place content over a background image.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <ImageBackground
        src="/cover.jpg"
        :style="{ width: '100%', height: 300 }"
      >
        <View :style="{
          padding: 40,
          flex: 1,
          justifyContent: 'flex-end',
        }">
          <Text :style="{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#fff',
          }">
            Overlay Title
          </Text>
        </View>
      </ImageBackground>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>ImageBackground</h1>
    <p>
      Renders children over a background image. The image fills the component's area, and child
      components are positioned on top.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'src', type: 'string | Buffer', required: true, description: 'Background image source.' },
        { name: 'style', type: 'Style', description: 'Dimensions and layout for the container.' },
      ]"
    />

    <h2>Usage</h2>
    <DocsCodeBlock
      lang="vue" :code="codeExample1"
    />
  </div>
</template>
