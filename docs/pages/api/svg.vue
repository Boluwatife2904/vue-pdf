<script setup lang="ts">
usePageSeo(
  "SVG Components API",
  "API reference for SVG components — Svg, G, Path, Rect, Line, Circle, Ellipse, Polygon, Polyline, and gradients.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <Svg :width="200" :height="200" viewBox="0 0 200 200">
        <Rect
          :x="10" :y="10" :width="180" :height="180"
          fill="#f0f0f0" stroke="#333" :strokeWidth="2"
          :rx="8"
        />
        <Circle
          :cx="100" :cy="100" :r="50"
          fill="#2563eb" :fillOpacity="0.8"
        />
        <Line
          :x1="20" :y1="20" :x2="180" :y2="180"
          stroke="#dc2626" :strokeWidth="3"
        />
      </Svg>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <Svg :width="100" :height="100" viewBox="0 0 24 24">
        <Path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="#eab308" stroke="#ca8a04" :strokeWidth="0.5"
        />
      </Svg>
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4">
      <Svg :width="200" :height="100" viewBox="0 0 200 100">
        <Defs>
          <LinearGradient id="myGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#dc2626" />
            <Stop offset="50%" stopColor="#f97316" />
            <Stop offset="100%" stopColor="#eab308" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="200" height="100" fill="url(#myGrad)" :rx="8" />
      </Svg>
    </Page>
  </Document>
</template>`

const codeExample4 = `<template>
  <Document>
    <Page size="A4">
      <Svg :width="100" :height="100" viewBox="0 0 100 100">
        <Polygon
          points="50,5 95,30 95,70 50,95 5,70 5,30"
          fill="#2563eb" stroke="#1e3a5f" :strokeWidth="2"
        />
      </Svg>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>SVG Components</h1>
    <p>
      vue-pdf provides full SVG support through a set of native SVG components. These render as vector
      graphics in the PDF — infinitely scalable and precise.
    </p>

    <h2>Available SVG Components</h2>
    <ul>
      <li><code>&lt;Svg&gt;</code> — SVG container with width/height and viewBox</li>
      <li><code>&lt;G&gt;</code> — Group element for organizing and transforming children</li>
      <li><code>&lt;Path&gt;</code> — Draw paths using SVG path data</li>
      <li><code>&lt;Rect&gt;</code> — Rectangle with optional rounded corners (rx, ry)</li>
      <li><code>&lt;Line&gt;</code> — Straight line between two points</li>
      <li><code>&lt;Circle&gt;</code> — Circle with center (cx, cy) and radius</li>
      <li><code>&lt;Ellipse&gt;</code> — Ellipse with center (cx, cy) and radii (rx, ry)</li>
      <li><code>&lt;Polygon&gt;</code> — Closed shape from a list of points</li>
      <li><code>&lt;Polyline&gt;</code> — Open shape from a list of points</li>
      <li><code>&lt;Tspan&gt;</code> — Inline text spans inside SVG text</li>
      <li><code>&lt;Defs&gt;</code> — Definitions container for gradients and clips</li>
      <li><code>&lt;ClipPath&gt;</code> — Clipping path definition</li>
      <li><code>&lt;LinearGradient&gt;</code> — Linear gradient definition</li>
      <li><code>&lt;RadialGradient&gt;</code> — Radial gradient definition</li>
      <li><code>&lt;Stop&gt;</code> — Gradient color stop</li>
      <li><code>&lt;Marker&gt;</code> — Arrowhead/end marker for lines</li>
    </ul>

    <h2>Common SVG Component Props</h2>
    <p>All shape components (<code>Path</code>, <code>Rect</code>, <code>Circle</code>, etc.) support:</p>

    <DocsPropsTable
      :rows="[
        { name: 'style', type: 'Style', description: 'Styles including fill, stroke, strokeWidth, and opacity.' },
        { name: 'fill', type: 'string', description: 'Fill color or gradient reference.' },
        { name: 'stroke', type: 'string', description: 'Stroke color.' },
        { name: 'strokeWidth', type: 'number', description: 'Stroke width in points.' },
        { name: 'strokeLinecap', type: '\'butt\' | \'round\' | \'square\'', description: 'Line cap style.' },
        { name: 'strokeLinejoin', type: '\'miter\' | \'round\' | \'bevel\'', description: 'Line join style.' },
        { name: 'strokeDasharray', type: 'string', description: 'Dash pattern (e.g. \'5,5\').' },
        { name: 'opacity', type: 'number', description: 'Element opacity (0-1).' },
        { name: 'fillOpacity', type: 'number', description: 'Fill opacity (0-1).' },
        { name: 'strokeOpacity', type: 'number', description: 'Stroke opacity (0-1).' },
      ]"
    />

    <h2>Basic SVG Example</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Path Component</h2>

    <DocsCodeBlock
      lang="vue" :code="codeExample2"
    />

    <h2>Gradients</h2>

    <DocsCodeBlock
      lang="vue" :code="codeExample3"
    />

    <h2>Polygon</h2>

    <DocsCodeBlock
      lang="vue" :code="codeExample4"
    />
  </div>
</template>
