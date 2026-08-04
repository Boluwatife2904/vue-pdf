<script setup lang="ts">
usePageSeo(
  "Advanced",
  "Page wrapping, bookmarks, named destinations, dynamic content, orphan and widow protection, debugging, and rendering large documents in vue-pdf.",
)

const wrapPage = `<template>
  <Document>
    <!-- Disable the wrapping engine for this page -->
    <Page :wrap="false">
      <Text>Everything stays on one page, even if it overflows.</Text>
    </Page>
  </Document>
</template>`

const wrapView = `<template>
  <Document>
    <Page wrap>
      <!-- Pushed whole onto the next page if it doesn't fit here -->
      <View :wrap="false" :style="{ padding: 12 }">
        <Text>This block is never split across pages.</Text>
      </View>
    </Page>
  </Document>
</template>`

const breakExample = `<template>
  <Document>
    <Page wrap>
      <Text>End of section one.</Text>

      <!-- Forces a new page before rendering -->
      <Text break>Section two starts on a fresh page.</Text>
    </Page>
  </Document>
</template>`

const fixedExample = `<template>
  <Document>
    <Page wrap :style="{ paddingTop: 50, paddingBottom: 40 }">
      <!-- Repeated on every page -->
      <View
        fixed
        :style="{ position: 'absolute', top: 16, left: 40, right: 40 }"
      >
        <Text :style="{ fontSize: 9, color: '#888' }">Quarterly Report</Text>
      </View>

      <Text
        fixed
        :style="{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', fontSize: 9 }"
        :render="({ pageNumber, totalPages }) => \`\${pageNumber} / \${totalPages}\`"
      />

      <Text>Body content...</Text>
    </Page>
  </Document>
</template>`

const destinationExample = `<template>
  <Document>
    <Page>
      <Link href="#footnote">Jump to the footnote</Link>

      <View id="footnote" break>
        <Text>You are here because you clicked the link above.</Text>
      </View>
    </Page>
  </Document>
</template>`

const bookmarkExample = `<template>
  <Document>
    <Page bookmark="Harry Potter and the Philosopher's Stone">
      <Text :bookmark="{ title: 'Chapter 1: The Boy Who Lived', fit: true }">
        Mr and Mrs Dursley, of number four, Privet Drive...
      </Text>

      <Text
        break
        :bookmark="{ title: 'Chapter 2: The Vanishing Glass', expanded: true }"
      >
        Nearly ten years had passed...
      </Text>
    </Page>
  </Document>
</template>`

const dynamicExample = `<template>
  <Document>
    <Page wrap>
      <!-- Page numbers in a footer -->
      <Text
        fixed
        :render="({ pageNumber, totalPages }) => \`\${pageNumber} / \${totalPages}\`"
      />

      <!-- Conditional content per page -->
      <View :render="({ pageNumber }) => renderOddPageBanner(pageNumber)" />
    </Page>
  </Document>
</template>`

const dynamicScript = `<script setup lang="ts">
// A View render function returns plain element objects — NOT Vue vnodes.
// \`type\` is the primitive's string name, and children nest the same way.
const renderOddPageBanner = (pageNumber: number) =>
  pageNumber % 2 === 1
    ? {
        type: 'VIEW',
        props: {},
        style: { backgroundColor: '#fee', padding: 8 },
        children: [
          {
            type: 'TEXT',
            props: {},
            style: { fontSize: 10 },
            children: "I'm only visible on odd pages!",
          },
        ],
      }
    : null
<\/script>`

const dynamicPrimitives = `<script setup lang="ts">
import * as P from '@vuepdf/renderer/primitives'

// P.View === 'VIEW', P.Text === 'TEXT' — the same strings, but checked
const renderBanner = (pageNumber: number) => ({
  type: P.View,
  props: {},
  style: { backgroundColor: '#fee', padding: 8 },
  children: [
    { type: P.Text, props: {}, children: \`Page \${pageNumber}\` },
  ],
})
<\/script>`

const orphansExample = `<template>
  <Document>
    <Page wrap>
      <!-- Never leave this heading stranded at the foot of a page -->
      <Text :min-presence-ahead="60" :style="{ fontSize: 16 }">
        Results
      </Text>

      <Text :orphans="3" :widows="3">
        A long body of text that will be split across pages...
      </Text>
    </Page>
  </Document>
</template>`

const debugExample = `<template>
  <Document>
    <Page size="A4" debug>
      <View debug :style="{ padding: 20, margin: 10 }">
        <Text debug>Content, padding and margin are outlined.</Text>
      </View>
    </Page>
  </Document>
</template>`

const hyphenExample = `<script setup lang="ts">
import { Font } from '@vuepdf/renderer'
import { hyphenateSync as hyphenateDE } from 'hyphen/de'

// Return the syllables of a word as an array
Font.registerHyphenationCallback((word) =>
  hyphenateDE(word).split('\\u00AD'),
)

// Or disable hyphenation entirely
// Font.registerHyphenationCallback((word) => [word])
<\/script>`

const expressExample = `import express from 'express'
import { renderToStream } from '@vuepdf/renderer'
import MyDocument from './MyDocument.vue'

const app = express()

app.get('/report.pdf', async (req, res) => {
  const stream = await renderToStream(MyDocument)

  res.setHeader('Content-Type', 'application/pdf')
  stream.pipe(res)
  stream.on('end', () => console.log('Done streaming, response sent.'))
})

app.listen(3000)`

const workerExample = `// pdf.worker.ts
import { pdf } from '@vuepdf/renderer'
import MyDocument from './MyDocument.vue'

self.onmessage = async (event) => {
  const blob = await pdf(MyDocument, event.data.props).toBlob()
  self.postMessage(blob)
}`

const workerUsage = `<script setup lang="ts">
const url = ref<string>()

onMounted(() => {
  const worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), {
    type: 'module',
  })

  worker.onmessage = (event) => {
    url.value = URL.createObjectURL(event.data)
  }

  worker.postMessage({ props: { title: 'Big report' } })
})
<\/script>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Core Concepts</div>
    <h1>Advanced</h1>
    <p>
      Everything beyond laying out a static page: controlling how content flows across pages, making documents
      navigable, generating content that depends on the page it lands on, and keeping large renders off the
      main thread.
    </p>

    <h2>Page Wrapping</h2>
    <p>
      vue-pdf ships a wrapping engine that is <strong>enabled by default</strong>. When content exceeds the
      page, it breaks onto a new one automatically. Turn it off per page with <code>:wrap="false"</code>:
    </p>

    <DocsCodeBlock lang="vue" :code="wrapPage" />

    <h3>Breakable and Unbreakable Components</h3>
    <p>
      <code>&lt;View&gt;</code>, <code>&lt;Text&gt;</code>, and <code>&lt;Link&gt;</code> are
      <strong>breakable</strong> — they fill the remaining space and continue on the next page.
      <code>&lt;Image&gt;</code> is <strong>unbreakable</strong> — if it does not fit, the whole thing moves to
      the next page.
    </p>
    <p>
      Set <code>:wrap="false"</code> on a breakable element to make it behave the same way:
    </p>

    <DocsCodeBlock lang="vue" :code="wrapView" />

    <h3>Page Breaks</h3>
    <p>The <code>break</code> prop on any primitive forces a new page before it renders:</p>

    <DocsCodeBlock lang="vue" :code="breakExample" />

    <h3>Fixed Components</h3>
    <p>
      The <code>fixed</code> prop repeats an element on every page — the basis for headers, footers, and page
      numbers:
    </p>

    <DocsCodeBlock lang="vue" :code="fixedExample" />

    <h2>Document Navigation</h2>

    <h3>Named Destinations</h3>
    <p>
      Give an element an <code>id</code>, then point a <code>&lt;Link&gt;</code> at it with a
      <code>#</code> prefix. The reader jumps to that element, across pages:
    </p>

    <DocsCodeBlock lang="vue" :code="destinationExample" />

    <h3>Bookmarks</h3>
    <p>
      The <code>bookmark</code> prop builds the outline tree readers show in their sidebar. It accepts either a
      string or a bookmark object, and nesting follows your component tree — a bookmark on a
      <code>&lt;Text&gt;</code> inside a bookmarked <code>&lt;Page&gt;</code> becomes its child:
    </p>

    <DocsCodeBlock lang="vue" :code="bookmarkExample" />

    <DocsPropsTable
      :rows="[
        { name: 'title', type: 'string', required: true, description: 'The label shown in the reader\'s outline.' },
        { name: 'top', type: 'number', default: '0', description: 'Y coordinate the reader scrolls to.' },
        { name: 'left', type: 'number', default: '0', description: 'X coordinate the reader scrolls to.' },
        { name: 'zoom', type: 'number', description: 'Zoom level applied when the bookmark is followed.' },
        { name: 'fit', type: 'boolean', description: 'Jump to the start of the page rather than a coordinate.' },
        { name: 'expanded', type: 'boolean', description: 'Show this node already expanded in the outline tree.' },
      ]"
    />

    <div class="callout callout-info">
      Some older PDF readers ignore bookmarks. Treat the outline as navigation convenience, not as the only
      way to reach a section.
    </div>

    <h2>Dynamic Content</h2>
    <p>
      Pass a function to the <code>render</code> prop of <code>&lt;Text&gt;</code> or
      <code>&lt;View&gt;</code> to generate content that depends on where it lands:
    </p>

    <DocsCodeBlock lang="vue" :code="dynamicExample" />

    <p>
      A <code>&lt;Text&gt;</code> render function returns a <strong>string</strong>. A
      <code>&lt;View&gt;</code> render function returns <strong>plain element objects</strong>:
    </p>

    <DocsCodeBlock lang="vue" :code="dynamicScript" />

    <div class="callout callout-warn">
      A <code>&lt;View&gt;</code> render function must <strong>not</strong> return Vue vnodes. Anything built
      with <code>h()</code> has a component object as its <code>type</code> and is
      <strong>silently dropped</strong> — no error, just missing content. Return objects whose
      <code>type</code> is the primitive's string name instead.
    </div>

    <p>
      To avoid hardcoding those strings, import the primitive constants:
    </p>

    <DocsCodeBlock lang="vue" :code="dynamicPrimitives" />

    <DocsPropsTable
      :rows="[
        { name: 'pageNumber', type: 'number', description: 'The current page number.' },
        { name: 'totalPages', type: 'number', description: 'Total pages in the document. Text only.' },
        { name: 'subPageNumber', type: 'number', description: 'The current subpage within its Page component.' },
        { name: 'subPageTotalPages', type: 'number', description: 'Total subpages of the Page component. Text only.' },
      ]"
    />

    <div class="callout callout-warn">
      For <code>&lt;Text&gt;</code>, the render function runs <strong>twice</strong> — once during the wrapping
      pass, and again once the page count is known. On the first pass only <code>pageNumber</code> is
      available; <code>totalPages</code>, <code>subPageNumber</code>, and <code>subPageTotalPages</code> are
      <code>undefined</code>. Keep render functions pure and guard against the missing values.
    </div>

    <h2>Orphan &amp; Widow Protection</h2>
    <p>
      vue-pdf avoids stranding single lines at a page boundary. Tune it with these props on any primitive:
    </p>

    <DocsPropsTable
      :rows="[
        { name: 'minPresenceAhead', type: 'number', default: '0', description: 'Prevents a page break between this element and its next sibling within n points.' },
        { name: 'orphans', type: 'number', default: '2', description: 'Minimum lines left at the bottom of a page. Text only.' },
        { name: 'widows', type: 'number', default: '2', description: 'Minimum lines carried to the top of the next page. Text only.' },
      ]"
    />

    <DocsCodeBlock lang="vue" :code="orphansExample" />

    <div class="callout callout-tip">
      <code>minPresenceAhead</code> is the fix for a heading rendering alone at the foot of a page. Set it to
      roughly the height of the content that must stay with it.
    </div>

    <h2>Debugging</h2>
    <p>
      Add <code>debug</code> to any primitive except <code>&lt;Document&gt;</code> to outline its content box,
      padding, and margin:
    </p>

    <DocsCodeBlock lang="vue" :code="debugExample" />

    <h2>Hyphenation</h2>
    <p>
      Line breaking uses the Knuth–Plass algorithm with English hyphenation patterns by default. Override the
      pattern set with <code>Font.registerHyphenationCallback</code> — it receives a word and returns its
      syllables:
    </p>

    <DocsCodeBlock lang="ts" :code="hyphenExample" />

    <p>
      See the <NuxtLink to="/guide/fonts">Fonts guide</NuxtLink> for registration details and
      <code>registerEmojiSource</code>.
    </p>

    <h2>Usage With Express</h2>
    <p>
      On the server, <NuxtLink to="/api/render-to-stream">renderToStream</NuxtLink> pipes straight into the
      response — no temporary file, no buffering the whole document:
    </p>

    <DocsCodeBlock lang="ts" :code="expressExample" />

    <p>
      If you need the bytes rather than a stream, use
      <NuxtLink to="/api/render-to-buffer">renderToBuffer</NuxtLink>.
    </p>

    <div class="callout callout-warn">
      Node cannot <code>import</code> a <code>.vue</code> file on its own. Outside Nuxt, run the server through
      a build step that compiles SFCs (Vite, tsup, or similar), or skip components entirely and build the
      document from <code>@vuepdf/renderer/primitives</code> — see
      <NuxtLink to="#dynamic-content">Dynamic Content</NuxtLink> for that element shape. vue-pdf's own packages
      ship precompiled, so they need no plugin either way.
    </div>

    <h2>Rendering Large Documents in the Browser</h2>
    <p>
      Rendering is synchronous work on the main thread. Past roughly 30 pages that becomes a visible freeze, so
      move it into a web worker and keep the UI responsive:
    </p>

    <DocsCodeBlock lang="ts" filename="pdf.worker.ts" :code="workerExample" />

    <DocsCodeBlock lang="vue" filename="DownloadButton.vue" :code="workerUsage" />

    <div class="callout callout-tip">
      Remember to <code>URL.revokeObjectURL()</code> the blob URL when you are done with it, and terminate the
      worker on unmount.
    </div>

    <h2>Math &amp; Diagrams</h2>
    <p>
      Two optional packages extend vue-pdf: <code>@vuepdf/math</code> renders LaTeX expressions as vector
      paths, and <code>@vuepdf/mermaid</code> renders Mermaid diagrams. See
      <NuxtLink to="/guide/math-diagrams">Math &amp; Diagrams</NuxtLink>.
    </p>
  </div>
</template>
