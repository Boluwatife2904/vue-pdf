<script setup lang="ts">
usePageSeo(
  "Images Example",
  "Images and layout examples for vue-pdf — embedding images, image backgrounds, and flex layouts.",
)

const imageGridCode = `<View :style="{
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
}">
  <Image
    v-for="i in 6" :key="i"
    :src="\`/photos/photo-\\$\${i}.jpg\`"
    :style="{
      width: 'calc(33% - 8px)',
      height: 100,
      objectFit: 'cover',
      borderRadius: 4,
    }"
  />
</View>`

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Text :style="{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
      }">
        Image Examples
      </Text>

      <!-- Inline image -->
      <Image
        src="path/to/photo.jpg"
        :style="{ width: 200, height: 150, marginBottom: 16, borderRadius: 4 }"
      />

      <Text :style="{ fontSize: 11, color: '#666' }">
        Figure 1: A sample image with rounded corners.
      </Text>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <View :style="{
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
      }">
        <!-- Cover image -->
        <View :style="{ flex: 1 }">
          <Image
            src="path/to/photo.jpg"
            :style="{
              width: '100%',
              height: 120,
              objectFit: 'cover',
              borderRadius: 4,
            }"
          />
          <Text :style="{ fontSize: 10, marginTop: 4, textAlign: 'center' }">
            Cover
          </Text>
        </View>

        <!-- Contain image -->
        <View :style="{ flex: 1 }">
          <Image
            src="path/to/photo.jpg"
            :style="{
              width: '100%',
              height: 120,
              objectFit: 'contain',
              backgroundColor: '#f5f5f5',
              borderRadius: 4,
            }"
          />
          <Text :style="{ fontSize: 10, marginTop: 4, textAlign: 'center' }">
            Contain
          </Text>
        </View>
      </View>
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4">
      <ImageBackground
        src="path/to/cover.jpg"
        :style="{ width: '100%', height: 200, marginBottom: 24 }"
      >
        <View :style="{
          flex: 1,
          justifyContent: 'flex-end',
          padding: 24,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }">
          <Text :style="{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 4,
          }">
            Report Title
          </Text>
          <Text :style="{
            fontSize: 14,
            color: '#d0d0d0',
          }">
            Subtitle or date information
          </Text>
        </View>
      </ImageBackground>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Examples</div>
    <h1>Images</h1>
    <p>Examples of embedding and laying out images in PDF documents.</p>

    <h2>Basic Image</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Image With Object Fit</h2>

    <DocsCodeBlock
      lang="vue" :code="codeExample2"
    />

    <h2>Image Grid Layout</h2>

    <DocsCodeBlock
      lang="vue"
      :code="imageGridCode"
    />

    <h2>Hero Section with ImageBackground</h2>

    <DocsCodeBlock
      lang="vue" :code="codeExample3"
    />
  </div>
</template>
