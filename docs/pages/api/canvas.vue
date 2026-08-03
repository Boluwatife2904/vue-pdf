<script setup lang="ts">
usePageSeo(
  "Canvas API",
  "API reference for the Canvas component — drawing graphics on PDF pages.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4">
      <Canvas
        :style="{ width: 200, height: 200 }"
        :paint="(p) => {
          // Draw a red rectangle
          p.fillColor = '#dc2626'
          p.rect(20, 20, 160, 80)
          p.fill()

          // Draw a circle with stroke
          p.fillColor = '#2563eb'
          p.strokeColor = '#1e3a5f'
          p.lineWidth = 3
          p.circle(100, 140, 40)
          p.fill()
          p.stroke()

          // Draw a line
          p.strokeColor = '#059669'
          p.lineWidth = 2
          p.moveTo(0, 0)
          p.lineTo(200, 200)
          p.stroke()
        }"
      />
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4">
      <Canvas
        :style="{ width: 200, height: 100 }"
        :paint="(p) => {
          const grad = p.linearGradient(0, 0, 200, 0)
          grad.stop(0, '#dc2626')
          grad.stop(0.5, '#f97316')
          grad.stop(1, '#eab308')
          p.fillColor = grad
          p.rect(0, 0, 200, 100)
          p.fill()
        }"
      />
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Components</div>
    <h1>Canvas</h1>
    <p>
      The <code>&lt;Canvas&gt;</code> component provides a drawing surface where you can paint graphics
      using a Canvas-like API. It supports paths, shapes, strokes, fills, and gradients.
    </p>

    <h2>Props</h2>
    <DocsPropsTable
      :rows="[
        { name: 'style', type: 'Style', description: 'Dimensions and position of the canvas.' },
        { name: 'paint', type: '(painter: CanvasPainter) => void', required: true, description: 'Callback that receives a painter object for drawing.' },
        { name: 'fixed', type: 'boolean', description: 'Repeat on every page.' },
      ]"
    />

    <h2>Paint API</h2>
    <p>The painter object supports these methods:</p>

    <DocsPropsTable
      :rows="[
        { name: 'moveTo(x, y)', type: 'void', description: 'Move the current point without drawing.' },
        { name: 'lineTo(x, y)', type: 'void', description: 'Draw a line from the current point.' },
        { name: 'quadraticCurveTo(cpx, cpy, x, y)', type: 'void', description: 'Draw a quadratic Bezier curve.' },
        { name: 'bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)', type: 'void', description: 'Draw a cubic Bezier curve.' },
        { name: 'arc(x, y, radius, startAngle, endAngle)', type: 'void', description: 'Draw an arc.' },
        { name: 'rect(x, y, w, h)', type: 'void', description: 'Draw a rectangle path.' },
        { name: 'circle(x, y, radius)', type: 'void', description: 'Draw a circle path.' },
        { name: 'ellipse(x, y, rx, ry)', type: 'void', description: 'Draw an ellipse path.' },
        { name: 'lineWidth', type: 'number', description: 'Stroke width in points.' },
        { name: 'strokeColor', type: 'string', description: 'Stroke color (hex, rgb, name).' },
        { name: 'fillColor', type: 'string', description: 'Fill color (hex, rgb, name).' },
        { name: 'strokeOpacity', type: 'number', description: 'Stroke opacity (0-1).' },
        { name: 'fillOpacity', type: 'number', description: 'Fill opacity (0-1).' },
        { name: 'dash', type: '(length: number, options: { space: number }) => void', description: 'Dash the stroke.' },
        { name: 'undash', type: '() => void', description: 'Disable dash mode.' },
        { name: 'clip', type: '() => void', description: 'Clip the drawing area.' },
        { name: 'save', type: '() => void', description: 'Save the current graphics state.' },
        { name: 'restore', type: '() => void', description: 'Restore the previously saved state.' },
        { name: 'linearGradient(x1, y1, x2, y2)', type: 'Gradient', description: 'Create a linear gradient.' },
        { name: 'radialGradient(x1, y1, r1, x2, y2, r2)', type: 'Gradient', description: 'Create a radial gradient.' },
        { name: 'lineCap', type: 'string', description: 'Line cap style (\'butt\', \'round\', \'square\').' },
        { name: 'lineJoin', type: 'string', description: 'Line join style (\'miter\', \'round\', \'bevel\').' },
        { name: 'opacity', type: 'number', description: 'Global opacity for all operations.' },
      ]"
    />

    <h2>Usage</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Canvas With Gradient</h2>

    <DocsCodeBlock
      lang="vue" :code="codeExample2"
    />
  </div>
</template>
