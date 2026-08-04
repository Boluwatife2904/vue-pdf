<script setup lang="ts">
usePageSeo(
  "Fonts",
  "Learn how to register and use custom fonts in vue-pdf documents. Font families, weights, and styles.",
)

const codeExample1 = `<template>
  <Document>
    <Page>
      <Text :style="{ fontFamily: 'Helvetica', fontSize: 18 }">Helvetica Regular</Text>
      <Text :style="{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 18 }">Helvetica Bold</Text>
      <Text :style="{ fontFamily: 'Times-Roman', fontSize: 18 }">Times-Roman</Text>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Core Concepts</div>
    <h1>Fonts</h1>
    <p>
      vue-pdf includes built-in support for standard PDF fonts (Helvetica, Times-Roman, Courier). You can also register
      custom fonts using the <code>Font</code> utility.
    </p>

    <h2>Built-in Fonts</h2>
    <p>These fonts are always available without registration:</p>

    <ul>
      <li><code>Helvetica</code> — Regular, Bold, Oblique, BoldOblique</li>
      <li><code>Times-Roman</code> — Regular, Bold, Italic, BoldItalic</li>
      <li><code>Courier</code> — Regular, Bold, Oblique, BoldOblique</li>
    </ul>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <h2>Registering Custom Fonts</h2>
    <p>Use <code>Font.register()</code> to add custom fonts. Call this before rendering any documents:</p>

    <DocsCodeBlock
      lang="ts"
      filename="fonts.ts"
      :code="`import { Font } from '@vuepdf/renderer'

// Single font
Font.register({
  family: 'Inter',
  src: '/fonts/Inter-Regular.ttf',
})

// Multiple weights
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
    { src: '/fonts/Inter-Italic.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})`"
    />

    <h3>Font Options</h3>
    <DocsPropsTable
      :rows="[
        { name: 'family', type: 'string', required: true, description: 'Font family name used in style.fontFamily.' },
        { name: 'src', type: 'string', description: 'Path or URL to the font file (TTF or OTF).' },
        { name: 'fonts', type: '{ src: string; fontWeight?: number; fontStyle?: string }[]', description: 'Array of font files with weight/style metadata.' },
        { name: 'fontWeight', type: 'number', description: 'Font weight for this specific file.' },
        { name: 'fontStyle', type: '\'normal\' | \'italic\'', description: 'Font style for this specific file.' },
        { name: 'hyphenationCallback', type: '(word: string) => string[]', description: 'Custom hyphenation function.' },
      ]"
    />

    <h2>Emoji &amp; Fallback Fonts</h2>
    <p>Register emoji sources for rendering emoji characters:</p>

    <DocsCodeBlock
      lang="ts"
      :code="`Font.register({
  family: 'Inter',
  src: '/fonts/Inter-Regular.ttf',
})

// Register emoji source
Font.registerEmojiSource({
  url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/{code}.png',
  format: 'png',
})`"
    />

    <h2>Font Loading (Server)</h2>
    <p>On the server, fonts can be loaded from the filesystem or a URL. Use <code>Font.registerHyphenationCallback</code>
    to customize the hyphenation behavior:</p>

    <DocsCodeBlock
      lang="ts"
      :code="`Font.registerHyphenationCallback((word) => {
  // Custom hyphenation logic
  const parts = word.split('')
  const result = []
  for (let i = 1; i < parts.length; i++) {
    result.push(parts.slice(0, i).join('') + '-')
  }
  return result
})`"
    />

    <div class="callout callout-info">
      Font files must be in <strong>TTF</strong> or <strong>OTF</strong> format. WOFF/WOFF2 are not supported.
      On the browser, fonts must be loaded from a CORS-enabled URL.
    </div>
  </div>
</template>
