<script setup lang="ts">
const { public: { siteUrl } } = useRuntimeConfig()
const description = "Create PDF files using Vue — a Vue renderer for building PDF documents on the browser and server. Port of react-pdf to the Vue ecosystem."

// Swap this for a hosted screenshot of the docs to use a hand-made cover on the
// home page instead of the generated one — set it to "" to fall back to DocsCover.
const ogImage: string = "https://res.cloudinary.com/juwon-tech/image/upload/v1785794124/og-image_nitb0v.png"

useHead({ titleTemplate: null })
useSeoMeta({
  title: "vue-pdf",
  description,
  ogTitle: "vue-pdf",
  ogDescription: description,
  ogUrl: siteUrl,
  ogType: "website",
  ...(ogImage ? { ogImage, twitterImage: ogImage } : {}),
  twitterCard: "summary_large_image",
  twitterTitle: "vue-pdf",
  twitterDescription: description,
})

if (!ogImage) {
  defineOgImage("DocsCover", { title: "vue-pdf", description })
}

const codeExample1 = `<template>
  <Document>
    <Page size="A4" style="padding: 40px">
      <View style="margin-bottom: 20px">
        <Text style="font-size: 24px; font-weight: bold">
          Hello, vue-pdf!
        </Text>
      </View>
      <View>
        <Text style="font-size: 12px; color: #666">
          Generate PDFs with Vue components — in the browser or on the server.
        </Text>
      </View>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-label">VUE-PDF</div>
      <h1 class="hero-title">
        Create PDF documents<br />with <span class="grad">Vue components</span>
      </h1>
      <p class="hero-sub">
        A Vue 3 port of <code>react-pdf</code>. Compose PDF documents using familiar Vue SFCs — write
        <code>&lt;Document&gt;</code>, <code>&lt;Page&gt;</code>, <code>&lt;Text&gt;</code>, and
        <code>&lt;View&gt;</code> just like you would build any Vue app. Works on the browser and server.
      </p>

      <div class="hero-actions">
        <NuxtLink to="/installation" class="btn btn-primary">Get Started</NuxtLink>
        <NuxtLink to="/quick-start" class="btn btn-ghost">Quick Start</NuxtLink>
      </div>

      <div class="hero-install">
        <DocsCodeBlock code="pnpm add @vuepdf/renderer" lang="bash" />
      </div>
    </div>

    <!-- Features -->
    <div class="features">
      <div class="feature">
        <div class="feature-icon">&lt;/&gt;</div>
        <h3>Vue Component Model</h3>
        <p>Declare PDF documents using 30+ Vue primitives — Document, Page, View, Text, Image, Canvas, SVG, forms, and more.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">◈</div>
        <h3>Flexbox Layout</h3>
        <p>Powered by Yoga Layout (same engine as React Native). Every <code>&lt;View&gt;</code> is a flex container.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⬡</div>
        <h3>Browser + Server</h3>
        <p>Dual platform support. Use <code>usePDF</code> and <code>&lt;PDFViewer&gt;</code> in the browser, or <code>renderToFile</code> on the server.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⬡</div>
        <h3>Nuxt Auto-Imports</h3>
        <p>With <code>@vuepdf/nuxt</code>, all 30+ components and composables are auto-imported with zero config.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">◎</div>
        <h3>Rich Text Engine</h3>
        <p>Advanced text layout with hyphenation, justification, RTL/bidi support, and custom font handling.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">✦</div>
        <h3>TypeScript First</h3>
        <p>Fully typed components, composables, and public API. Intellisense coverage across the entire package.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⬡</div>
        <h3>SVG &amp; Canvas</h3>
        <p>Embed vector graphics with full SVG support (Path, Rect, Circle, gradients, markers) and <code>&lt;Canvas&gt;</code> drawing.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⬡</div>
        <h3>Forms &amp; Annotations</h3>
        <p>Create fillable <NuxtLink to="/guide/forms">AcroForm PDFs</NuxtLink> — TextInput, Checkbox, Select, List, FieldSet — plus Note annotations.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">✦</div>
        <h3>Extensions</h3>
        <p>Optional packages for LaTeX math (<code>@vuepdf/math</code>) and Mermaid diagrams (<code>@vuepdf/mermaid</code>).</p>
      </div>
    </div>

    <!-- Quick example -->
    <div class="prose" style="margin-top: 64px">
      <h2>Quick Example</h2>
      <p>Create your first PDF document in seconds:</p>
      <DocsCodeBlock
        lang="vue"
        filename="app.vue"
        :code="codeExample1"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/css/main.css";

.home {
  @apply pb-20;
}

.hero {
  @apply pb-14 mb-16 border-b border-[var(--color-border)];
}

.hero-label {
  @apply text-[11.5px] font-bold tracking-[0.1em] uppercase mb-4;
  color: var(--color-accent);
}

.hero-title {
  font-size: clamp(28px, 5vw, 44px);
  @apply font-extrabold tracking-[-0.035em] leading-[1.12] mb-5;
  color: var(--color-heading);
}

.grad {
  background: linear-gradient(135deg, #dc2626, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  @apply text-base leading-[1.7] mb-8;
  max-width: 560px;
  color: var(--color-hero-sub);
}

.hero-sub code {
  @apply font-mono text-[0.85em] border border-[var(--color-border)] rounded-[3px] px-[5px] py-px;
  color: var(--color-link);
  background: var(--color-inline);
}

.hero-actions {
  @apply flex gap-3 flex-wrap mb-8;
}

.btn {
  @apply inline-flex items-center gap-2 px-[22px] py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer border border-transparent;
}

.btn-primary {
  background: var(--color-accent);
  color: #fff;
}

.btn-primary:hover {
  filter: brightness(1.1);
}

.btn-ghost {
  @apply bg-transparent;
  border-color: var(--color-border);
  color: var(--color-text);
}

.btn-ghost:hover {
  border-color: var(--color-subtle);
  background: rgba(128, 128, 128, 0.08);
}

.hero-install :deep(.cb) {
  @apply m-0;
}

@media (min-width: 640px) {
  .hero-install {
    max-width: 380px;
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  @apply gap-px border border-[var(--color-border)] rounded-lg overflow-hidden;
  background: var(--color-border);
}

.feature {
  @apply px-6 py-7 transition-colors;
  background: var(--color-bg);
}

.feature:hover {
  background: rgba(255, 255, 255, 0.02);
}

.feature-icon {
  @apply text-lg mb-3 opacity-70;
  color: var(--color-accent);
}

.feature h3 {
  @apply text-[15px] font-bold mb-2;
  color: var(--color-heading);
}

.feature p {
  @apply text-[13.5px] leading-[1.65];
  color: var(--color-muted);
}

.feature p code {
  @apply font-mono text-[0.85em] border border-[var(--color-border)] rounded-[3px] px-1 py-px;
  color: var(--color-link);
  background: var(--color-inline);
}
</style>
