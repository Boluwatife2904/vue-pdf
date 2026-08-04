<p align="center">
  <img src="https://res.cloudinary.com/juwon-tech/image/upload/v1785793593/Screenshot_2026-08-03_at_22.44.17_m86fly.png" alt="vue-pdf" width="100%" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@vuepdf/renderer">
    <img src="https://img.shields.io/npm/v/@vuepdf/renderer?color=dc2626&label=npm&logo=npm&logoColor=white" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@vuepdf/renderer">
    <img src="https://img.shields.io/npm/dm/@vuepdf/renderer?color=dc2626&logo=npm&logoColor=white" alt="npm downloads" />
  </a>
  <a href="https://github.com/Boluwatife2904/vue-pdf/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@vuepdf/renderer?color=dc2626" alt="license" />
  </a>
  <a href="https://nuxt.com">
    <img src="https://img.shields.io/badge/Nuxt-3%20%2F%204-dc2626?logo=nuxt.js&logoColor=white" alt="Nuxt 3 / 4" />
  </a>
  <a href="https://vuejs.org">
    <img src="https://img.shields.io/badge/Vue-3.5%2B-dc2626?logo=vue.js&logoColor=white" alt="Vue 3.5+" />
  </a>
</p>

<p align="center">
  Create PDF documents using Vue components — a Vue renderer for the browser and the server.<br />
  Flexbox layout, a full text engine, SVG, images, fillable forms, and Tailwind-style utilities.
</p>

<p align="center">
  <a href="https://vue-pdf.sanusi.dev">Documentation</a> ·
  <a href="https://vue-pdf.sanusi.dev/playground">Playground</a> ·
  <a href="https://github.com/Boluwatife2904/vue-pdf/issues">Report Bug</a> ·
  <a href="https://github.com/Boluwatife2904/vue-pdf/discussions">Request Feature</a>
</p>

---

## ✦ Features

- **30+ Vue primitives** — `Document`, `Page`, `View`, `Text`, `Image`, `Canvas`, `Link`, `Note`, SVG shapes, and form fields
- **Flexbox layout** — powered by Yoga, the same layout engine React Native uses; every `<View>` is a flex container
- **Browser + server** — preview with `usePDF` / `<PDFViewer>`, or write files with `renderToFile`, `renderToBuffer`, `renderToStream`
- **Rich text engine** — hyphenation, justification, RTL / bidi, word-wrapping, and custom font registration
- **SVG & Canvas** — vector graphics with `Path`, `Rect`, `Circle`, gradients and markers, plus imperative `<Canvas>` drawing
- **Fillable forms** — AcroForm fields via `TextInput`, `Checkbox`, `Select`, `List`, and `FieldSet`
- **Tailwind-style utilities** — `tw()` / `createTw()` for utility-class styling inside documents
- **Nuxt auto-imports** — `@vuepdf/nuxt` registers every component and composable with zero config, client and server
- **TypeScript first** — fully typed components, composables, and public API

---

## Installation

```bash
# pnpm
pnpm add @vuepdf/renderer

# npm
npm install @vuepdf/renderer

# yarn
yarn add @vuepdf/renderer

# bun
bun add @vuepdf/renderer
```

---

## Usage

### Nuxt module

Register the module in your `nuxt.config.ts` — every component and composable is auto-imported everywhere:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vuepdf/nuxt'],
})
```

```vue
<template>
  <Document>
    <Page size="A4" style="padding: 40px">
      <Text style="font-size: 18px">Hello, PDF!</Text>
    </Page>
  </Document>
</template>
```

> The module also registers a Vue SFC plugin with Nitro, so `server/` routes can import a document `.vue`
> file and render it on the server. Wiring `build.transpile` by hand works client-side only.

### Vue (without Nuxt)

```vue
<script setup lang="ts">
import { Document, Page, Text, View } from '@vuepdf/renderer'
</script>

<template>
  <Document>
    <Page size="A4">
      <View style="padding: 40px">
        <Text style="font-size: 18px">Hello, PDF!</Text>
      </View>
    </Page>
  </Document>
</template>
```

---

## Examples

### Preview in the browser

Slot your document into `<PDFViewer>` and it renders itself into an iframe:

```vue
<script setup lang="ts">
import { PDFViewer } from '@vuepdf/renderer'
import MyDocument from './MyDocument.vue'
</script>

<template>
  <PDFViewer :style="{ width: '100%', height: '600px' }">
    <MyDocument />
  </PDFViewer>
</template>
```

### Download link

`<PDFDownloadLink>` renders an `<a>` and passes the render state to its default slot:

```vue
<script setup lang="ts">
import { PDFDownloadLink } from '@vuepdf/renderer'
import MyDocument from './MyDocument.vue'
</script>

<template>
  <PDFDownloadLink file-name="report.pdf">
    <template #document>
      <MyDocument />
    </template>
    <template #default="{ loading }">
      {{ loading ? 'Preparing…' : 'Download PDF' }}
    </template>
  </PDFDownloadLink>
</template>
```

### Driving the render yourself

`usePDF` returns a `[state, update]` tuple — the Vue analog of react-pdf's hook:

```vue
<script setup lang="ts">
import { usePDF } from '@vuepdf/renderer'

const [instance, update] = usePDF()
// call update(tree) whenever the document changes;
// instance.value is { url, blob, error, loading }
</script>

<template>
  <div v-if="instance.loading">Loading…</div>
  <iframe v-else :src="instance.url" width="100%" height="600px" />
</template>
```

### Stream from a server route

```ts
// server/api/report.get.ts
import { renderToStream } from '@vuepdf/renderer'
import ReportDocument from '../../components/pdf/ReportDocument.vue'

export default defineEventHandler(async (event) => {
  const { title = 'Report' } = getQuery(event) as { title?: string }

  setHeader(event, 'content-type', 'application/pdf')
  setHeader(event, 'content-disposition', 'inline; filename="report.pdf"')

  return sendStream(event, await renderToStream(ReportDocument, { title }))
})
```

### Flexbox layout

```vue
<template>
  <Document>
    <Page size="A4">
      <View style="display: flex; flex-direction: row; padding: 40px">
        <View style="flex: 1; padding: 20px; background-color: #f0f0f0">
          <Text style="font-size: 16px">Left Column</Text>
        </View>
        <View style="flex: 1; padding: 20px; background-color: #e0e0e0">
          <Text style="font-size: 16px">Right Column</Text>
        </View>
      </View>
    </Page>
  </Document>
</template>
```

### Fillable form

```vue
<template>
  <Document>
    <Page size="A4" style="padding: 40px">
      <FieldSet name="application">
        <TextInput name="fullName" style="height: 24px; border: 1px solid #999" />
        <Checkbox name="subscribe" :checked="true" style="width: 14px; height: 14px" />
      </FieldSet>
    </Page>
  </Document>
</template>
```

---

## Components

| Group | Components |
| --- | --- |
| **Structure** | `Document` · `Page` · `View` |
| **Content** | `Text` · `Link` · `Note` · `Image` · `ImageBackground` · `Canvas` |
| **SVG** | `Svg` · `G` · `Path` · `Rect` · `Line` · `Circle` · `Ellipse` · `Polygon` · `Polyline` · `Tspan` · `Defs` · `Stop` · `ClipPath` · `Marker` · `LinearGradient` · `RadialGradient` |
| **Forms** | `FieldSet` · `TextInput` · `Checkbox` · `Select` · `List` |
| **Browser** | `PDFViewer` · `PDFDownloadLink` · `BlobProvider` |

---

## API

| Export | Type | Description |
| --- | --- | --- |
| `usePDF` | composable | Returns a `[state, update]` tuple; `state.value` holds `{ url, blob, error, loading }`. |
| `pdf` | function | Low-level instance for generating a PDF blob, buffer, or string. |
| `renderToFile` | function | Renders a document and writes it to a file path (Node). |
| `renderToBuffer` | function | Renders a document and resolves with a `Buffer` (Node). |
| `renderToStream` | function | Renders a document and resolves with a readable stream (Node). |
| `Font` | object | Registers custom fonts, hyphenation callbacks, and emoji sources. |
| `StyleSheet` | object | `create()` and `resolve()` helpers for reusable style objects. |
| `tw` / `createTw` / `configureTw` | function | Tailwind-style utility classes inside PDF documents. |

---

## Packages

| Package | Description |
| --- | --- |
| `@vuepdf/renderer` | The core renderer — components, composables, and Node APIs. |
| `@vuepdf/nuxt` | Nuxt module: auto-imports, Vite transpilation, and Nitro SFC support. |
| `@vuepdf/math` | Optional — renders LaTeX math expressions as inline SVG. |
| `@vuepdf/mermaid` | Optional — renders Mermaid diagrams inside a document. |

---

## Peer dependencies

```bash
vue     >= 3.5.0
nuxt    >= 3.0.0   # only for @vuepdf/nuxt
```

---

## Development

```bash
# Install dependencies
pnpm install

# Start the docs dev server
pnpm dev

# Build every package
pnpm build

# Run the test suite
pnpm test
```

---

## Credits

vue-pdf is a port of [react-pdf](https://github.com/diegomura/react-pdf) by Diego Muracciole to the Vue
ecosystem, and builds on the same foundations — [PDFKit](https://github.com/foliojs/pdfkit) for PDF output and
[Yoga](https://github.com/facebook/yoga) for flexbox layout.

---

## License

[MIT](./LICENSE)
