<script setup lang="ts">
usePageSeo(
  "Installation",
  "Get up and running with vue-pdf — install via npm, pnpm, or yarn and configure the Nuxt module for auto-imports.",
)
const managers = [
  { name: "pnpm", cmd: "pnpm add @vuepdf/renderer" },
  { name: "npm", cmd: "npm i @vuepdf/renderer" },
  { name: "yarn", cmd: "yarn add @vuepdf/renderer" },
  { name: "bun", cmd: "bun add @vuepdf/renderer" },
]

const codeExample1 = `<script setup lang="ts">
import { Document, Page, Text, View } from '@vuepdf/renderer'
<\/script>

<template>
  <Document>
    <Page size="A4">
      <View style="padding: 40px">
        <Text style="font-size: 18px">Hello, PDF!</Text>
      </View>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Getting Started</div>
    <h1>Installation</h1>
    <p>Install the core <code>@vuepdf/renderer</code> package using your preferred package manager:</p>

    <div v-for="pm in managers" :key="pm.name">
      <DocsCodeBlock :code="pm.cmd" lang="bash" :filename="pm.name" />
    </div>

    <h2>Nuxt Setup</h2>
    <p>For Nuxt projects, add <code>@vuepdf/nuxt</code> to the <code>modules</code> array in your <code>nuxt.config.ts</code>:</p>

    <DocsCodeBlock
      lang="ts"
      filename="nuxt.config.ts"
      :code="`export default defineNuxtConfig({
  modules: ['@vuepdf/nuxt'],
})`"
    />

    <p>
      That's it. The module auto-registers all 30+ components (<code>&lt;Document&gt;</code>, <code>&lt;Page&gt;</code>,
      <code>&lt;Text&gt;</code>, <code>&lt;View&gt;</code>, <code>&lt;Image&gt;</code>, SVG primitives, form
      components, and more) plus the <code>usePDF</code>, <code>pdf()</code>, <code>Font</code>, and
      <code>StyleSheet</code> utilities — no explicit imports needed.
    </p>

    <p>It also configures the parts you would otherwise have to wire by hand:</p>

    <ul>
      <li>Transpiles the vue-pdf packages for Vite.</li>
      <li>
        Registers a Vue SFC plugin with Nitro, so a
        <NuxtLink to="/api/render-to-stream">server route</NuxtLink> can import your document
        <code>.vue</code> file and render a PDF on the server.
      </li>
      <li>
        Resolves every component through a single copy of the renderer. Loading two copies gives you two
        injection contexts, which silently produces a blank PDF.
      </li>
    </ul>

    <div class="callout callout-tip">
      Server-side PDF rendering in Nuxt needs this module. If you configure components and
      <code>build.transpile</code> manually instead, client-side rendering works but
      <code>server/</code> routes that import a <code>.vue</code> document will fail to build.
    </div>

    <div class="callout callout-info">
      Both the <code>@vuepdf/nuxt</code> module and the <code>@vuepdf/renderer</code> package have
      <strong>Vue 3</strong> and <strong>Nuxt 3</strong> as peer dependencies. Make sure your project has them
      installed.
    </div>

    <h2>Vue (Without Nuxt)</h2>
    <p>Import components directly from the renderer package:</p>

    <DocsCodeBlock
      lang="vue"
      filename="App.vue"
      :code="codeExample1"
    />

    <h2>Optional Extension Packages</h2>
    <p>vue-pdf ships with optional extension packages for specialized content:</p>

    <div class="pkg-grid">
      <div class="pkg-card">
        <code>@vuepdf/math</code>
        <p>Render LaTeX math expressions as inline SVG.</p>
        <DocsCodeBlock :code="'pnpm add @vuepdf/math'" lang="bash" />
      </div>
      <div class="pkg-card">
        <code>@vuepdf/mermaid</code>
        <p>Render Mermaid diagrams embedded in your PDF.</p>
        <DocsCodeBlock :code="'pnpm add @vuepdf/mermaid'" lang="bash" />
      </div>
    </div>

    <h2>Peer Dependencies</h2>
    <p><code>@vuepdf/renderer</code> requires Vue as a peer dependency:</p>

    <DocsCodeBlock
      lang="bash"
      :code="`vue    >= 3.5.0`"
    />

    <h2>Next Steps</h2>
    <ul>
      <li><NuxtLink to="/quick-start">Follow the Quick Start guide →</NuxtLink></li>
      <li><NuxtLink to="/guide/document-pages">Learn about Document &amp; Pages →</NuxtLink></li>
      <li><NuxtLink to="/api/document">Browse the full component API →</NuxtLink></li>
    </ul>
  </div>
</template>

<style scoped>
@reference "../assets/css/main.css";

.pkg-grid {
  @apply grid grid-cols-2 gap-5 my-4;
}

.pkg-card {
  @apply p-5 border border-[var(--color-border)] rounded-md;
}

.pkg-card code {
  @apply text-sm font-bold block mb-2;
}

.pkg-card p {
  @apply text-[13.5px] mb-3;
  color: var(--color-muted);
}

.pkg-card :deep(.cb) {
  @apply m-0 text-xs;
}

@media (max-width: 600px) {
  .pkg-grid {
    @apply grid-cols-1;
  }
}
</style>
