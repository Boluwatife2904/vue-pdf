<script setup lang="ts">
usePageSeo(
  "SVG Graphics Example",
  "Vue-pdf SVG graphics examples — shapes, paths, gradients, and custom markers.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Text :style="{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }">
        Simple Bar Chart
      </Text>

      <Svg :width="400" :height="200" viewBox="0 0 400 200">
        <!-- Axes -->
        <Line x1="40" y1="10" x2="40" y2="180"
              stroke="#333" :strokeWidth="1.5" />
        <Line x1="40" y1="180" x2="390" y2="180"
              stroke="#333" :strokeWidth="1.5" />

        <!-- Bars -->
        <Rect x="60"  y="120" width="50" height="60"
              fill="#2563eb" :rx="2" />
        <Rect x="130" y="80"  width="50" height="100"
              fill="#7c3aed" :rx="2" />
        <Rect x="200" y="40"  width="50" height="140"
              fill="#dc2626" :rx="2" />
        <Rect x="270" y="60"  width="50" height="120"
              fill="#059669" :rx="2" />
        <Rect x="340" y="100" width="50" height="80"
              fill="#d97706" :rx="2" />

        <!-- Labels -->
        <Text x="75"  y="195" :style="{ fontSize: 8 }">Q1</Text>
        <Text x="145" y="195" :style="{ fontSize: 8 }">Q2</Text>
        <Text x="215" y="195" :style="{ fontSize: 8 }">Q3</Text>
        <Text x="285" y="195" :style="{ fontSize: 8 }">Q4</Text>
        <Text x="355" y="195" :style="{ fontSize: 8 }">Q5</Text>
      </Svg>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <Svg :width="80" :height="80" viewBox="0 0 80 80">
        <Defs>
          <LinearGradient id="iconGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#dc2626" />
            <Stop offset="100%" stopColor="#f97316" />
          </LinearGradient>
        </Defs>
        <Circle cx="40" cy="40" r="35"
                fill="url(#iconGrad)" />
        <Path d="M40 20L50 35H30Z"
              fill="#ffffff" />
      </Svg>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Examples</div>
    <h1>SVG Graphics</h1>
    <p>Examples of SVG graphics rendered natively in the PDF.</p>

    <h2>Chart Example</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Icon With Gradient</h2>

    <DocsCodeBlock
      lang="vue" :code="codeExample2"
    />
  </div>
</template>
