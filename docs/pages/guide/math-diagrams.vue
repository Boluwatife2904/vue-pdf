<script setup lang="ts">
usePageSeo(
  "Math & Diagrams",
  "Render LaTeX math expressions and Mermaid diagrams in vue-pdf with the @vue-pdf/math and @vue-pdf/mermaid packages.",
)

const installMath = `npm install @vue-pdf/math`

const mathBasic = `<script setup lang="ts">
import { Math } from '@vue-pdf/math'
<\/script>

<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Math :height="40">x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}</Math>
    </Page>
  </Document>
</template>`

const mathInline = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <View :style="{ flexDirection: 'row', alignItems: 'center' }">
        <Text>The equation </Text>
        <Math inline :height="12">E = mc^2</Math>
        <Text> is famous.</Text>
      </View>
    </Page>
  </Document>
</template>`

const mathBraces = `<template>
  <!-- Vue reads {{ }} as interpolation, so bind the source as a string -->
  <Math :height="40">{{ expression }}</Math>
</template>

<script setup lang="ts">
const expression = '\\\\sqrt{{a+b}^2}'
<\/script>`

const installMermaid = `npm install @vue-pdf/mermaid`

const mermaidBasic = `<script setup lang="ts">
import { Mermaid } from '@vue-pdf/mermaid'

const diagram = \`graph TD
  A[Start] --> B{Is it valid?}
  B -->|Yes| C[Process]
  B -->|No| D[Reject]
  C --> E[Done]\`
<\/script>

<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Mermaid :width="400" :height="300">{{ diagram }}</Mermaid>
    </Page>
  </Document>
</template>`

const mermaidTheme = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40, backgroundColor: '#1a1b26' }">
      <!-- Built-in theme -->
      <Mermaid theme="tokyo-night" :width="400" :height="260">
        {{ diagram }}
      </Mermaid>

      <!-- Or drive the palette directly -->
      <Mermaid
        transparent
        color="#e6e6e6"
        line="#7aa2f7"
        accent="#bb9af7"
        surface="#24283b"
        border="#414868"
        :width="400"
        :height="260"
      >
        {{ diagram }}
      </Mermaid>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Core Concepts</div>
    <h1>Math &amp; Diagrams</h1>
    <p>
      Two optional packages extend vue-pdf beyond its core primitives. Both convert their source into vector
      paths using vue-pdf's own <NuxtLink to="/api/svg">SVG primitives</NuxtLink> — no external fonts, no
      raster images, so output stays sharp at any zoom.
    </p>

    <h2>Math Expressions</h2>
    <p>
      <code>@vue-pdf/math</code> renders LaTeX with MathJax and maps the result onto SVG paths.
    </p>

    <DocsCodeBlock lang="bash" :code="installMath" />

    <p>The expression goes in the default slot:</p>

    <DocsCodeBlock lang="vue" :code="mathBasic" />

    <h3>Props</h3>
    <DocsPropsTable
      :rows="[
        { name: 'inline', type: 'boolean', default: 'false', description: 'Compact inline mode instead of centered display mode.' },
        { name: 'width', type: 'number | string', description: 'Width of the expression. Derived from the aspect ratio if omitted.' },
        { name: 'height', type: 'number | string', description: 'Height of the expression. Derived from the aspect ratio if omitted.' },
        { name: 'color', type: 'string', default: '\'black\'', description: 'Colour of the rendered expression.' },
        { name: 'debug', type: 'boolean', default: 'false', description: 'Draw a border around the expression to debug layout.' },
      ]"
    />

    <h3>Inline Mode</h3>
    <p>
      Set <code>inline</code> and place it in a row alongside <code>&lt;Text&gt;</code>:
    </p>

    <DocsCodeBlock lang="vue" :code="mathInline" />

    <div class="callout callout-warn">
      Vue templates treat <code>{{ '{{' }}</code> as interpolation. A LaTeX source containing double braces
      breaks the template parser, so bind it from script instead of inlining it:
    </div>

    <DocsCodeBlock lang="vue" :code="mathBraces" />

    <p>
      Standard MathJax coverage applies: fractions, roots, operators, Greek letters, summations, products,
      integrals, limits, derivatives, matrices, binomial coefficients, trigonometric functions, accents,
      piecewise functions, and aligned equations.
    </p>

    <h2>Mermaid Diagrams</h2>
    <p>
      <code>@vue-pdf/mermaid</code> renders Mermaid definitions — flowcharts, sequence diagrams, class
      diagrams, state charts, and the rest of Mermaid's grammar.
    </p>

    <DocsCodeBlock lang="bash" :code="installMermaid" />

    <DocsCodeBlock lang="vue" :code="mermaidBasic" />

    <h3>Props</h3>
    <DocsPropsTable
      :rows="[
        { name: 'width', type: 'number | string', description: 'Width of the diagram. Derived from the viewBox aspect ratio if omitted.' },
        { name: 'height', type: 'number | string', description: 'Height of the diagram. Derived from the viewBox aspect ratio if omitted.' },
        { name: 'theme', type: 'string', description: 'Built-in palette. See the list below.' },
        { name: 'color', type: 'string', description: 'Foreground and text colour.' },
        { name: 'bg', type: 'string', description: 'Background colour of the diagram.' },
        { name: 'transparent', type: 'boolean', description: 'Render with no background fill.' },
        { name: 'accent', type: 'string', description: 'Accent colour for arrowheads and highlights.' },
        { name: 'line', type: 'string', description: 'Stroke colour for edges and connectors.' },
        { name: 'muted', type: 'string', description: 'Colour for secondary text and labels.' },
        { name: 'surface', type: 'string', description: 'Node fill tint.' },
        { name: 'border', type: 'string', description: 'Node stroke colour.' },
        { name: 'debug', type: 'boolean', default: 'false', description: 'Draw a border around the diagram to debug layout.' },
      ]"
    />

    <h3>Theming</h3>
    <p>
      Pass a <code>theme</code> name, or override any individual colour. Explicit colours win over the theme,
      so you can pick a theme and adjust one part of it:
    </p>

    <DocsCodeBlock lang="vue" :code="mermaidTheme" />

    <p>Available themes:</p>

    <ul>
      <li><code>tokyo-night</code>, <code>tokyo-night-storm</code>, <code>tokyo-night-light</code></li>
      <li><code>catppuccin-mocha</code>, <code>catppuccin-latte</code></li>
      <li><code>nord</code>, <code>nord-light</code></li>
      <li><code>dracula</code></li>
      <li><code>github-dark</code>, <code>github-light</code></li>
      <li><code>solarized-dark</code>, <code>solarized-light</code></li>
      <li><code>one-dark</code></li>
      <li><code>zinc-dark</code>, <code>zinc-light</code></li>
    </ul>

    <div class="callout callout-tip">
      Both components accept their source through the default slot, so a definition held in a
      <code>ref</code> re-renders the document when it changes — handy in the
      <NuxtLink to="/playground">Playground</NuxtLink>.
    </div>
  </div>
</template>
