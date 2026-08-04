<script setup lang="ts">
usePageSeo(
  "Styling with Tailwind",
  "Use Tailwind CSS utility classes to style vue-pdf components. Fast, familiar, and zero-runtime — classes are converted to vue-pdf Style objects at render time.",
)

const codeBasic = `<template>
  <Document>
    <Page size="A4" tw="p-10">
      <View tw="flex flex-row gap-4">
        <View tw="flex-1 p-4 bg-blue-100 rounded-lg">
          <Text tw="text-blue-500 font-medium">Card 1</Text>
        </View>
        <View tw="flex-1 p-4 bg-green-100 rounded-lg">
          <Text tw="text-green-500 font-medium">Card 2</Text>
        </View>
      </View>
    </Page>
  </Document>
</template>`

const codeMixed = `<template>
  <Document>
    <Page size="A4">
      <!-- tw sets base styles; :style overrides individual properties -->
      <View tw="p-4 bg-blue-100 rounded-md" :style="{ paddingTop: 40 }">
        <Text tw="text-lg font-semibold text-blue-800">
          Padding top is 40pt, other sides are 12pt
        </Text>
      </View>
    </Page>
  </Document>
</template>`

const codeCustom = `<script setup>
// Override theme defaults — use in app setup or nuxt.config
configureTw({
  colors: { brand: { 500: '#7c3aed', 700: '#6d28d9' } },
  extend: { spacing: { 18: '4.5rem' } },
})
<\/script>

<template>
  <Document>
    <Page size="A4">
      <View tw="p-18 bg-brand-500">
        <Text tw="text-white">Custom theme colors & spacing</Text>
      </View>
    </Page>
  </Document>
</template>`

const codePtPerRem = `<script setup>
import { createTw } from '@vuepdf/tailwind'

const myTw = createTw({}, { ptPerRem: 14 }) // 1rem = 14pt
<\/script>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Core Concepts</div>
    <h1>Styling (Tailwind)</h1>
    <p>
      vue-pdf supports Tailwind CSS utility classes via the <code>tw</code> prop.
      Class strings are converted to vue-pdf <code>Style</code> objects using a
      pure-JS converter — no CSS engine, no runtime overhead.
    </p>

    <div class="callout callout-info">
      <strong>Built-in</strong> — The <code>tw</code> prop works out of the box with
      <code>@vuepdf/renderer</code>. No extra install or import needed.
      Both <code>tw</code> and <code>:style</code> can be used together, and
      <code>:style</code> always wins when there's a conflict.
    </div>

    <h2>Quick Start</h2>
    <p>
      Use the <code>tw</code> prop on any vue-pdf component:
    </p>

    <DocsCodeBlock lang="vue" :code="codeBasic" />

    <h2>How It Works</h2>
    <p>
      The <code>tw</code> prop accepts a space-separated string of Tailwind utility
      classes. At render time, the converter:
    </p>
    <ol>
      <li>Splits the class string into individual utilities</li>
      <li>Looks up each class against a vendored Tailwind theme (spacing, colors, fonts...)</li>
      <li>Converts CSS units to PDF points (<code>1rem = 12pt</code> by default)</li>
      <li>Emits a vue-pdf <code>Style</code> object merged under any inline <code>:style</code></li>
    </ol>

    <h2>Units</h2>
    <p>
      All spacing/sizing utilities produce <strong>point values</strong>, not CSS
      units. The default conversion is <code>1rem = 12pt</code> (matching
      <code>1rem = 16px</code> at 72 DPI). This is configurable:
    </p>

    <DocsCodeBlock lang="vue" :code="codePtPerRem" />

    <table>
      <thead>
        <tr>
          <th>Utility</th>
          <th>Resolves To</th>
          <th>Example</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>p-4</code></td><td><code>{ padding: 12 }</code> (points)</td><td>4 &times; 12pt / 4 = 12pt</td></tr>
        <tr><td><code>w-1/2</code></td><td><code>{ width: '50%' }</code></td><td>Fraction to percent</td></tr>
        <tr><td><code>w-full</code></td><td><code>{ width: '100%' }</code></td><td>Full width</td></tr>
        <tr><td><code>p-px</code></td><td><code>{ padding: 1 }</code> (1 point)</td><td>1px &asymp; 0.75pt, rounded to 1pt</td></tr>
        <tr><td><code>-mt-4</code></td><td><code>{ marginTop: -12 }</code></td><td>Negative margin</td></tr>
        <tr><td><code>p-[10px]</code></td><td><code>{ padding: 10 }</code></td><td>Arbitrary value</td></tr>
      </tbody>
    </table>

    <h2>Supported Utilities</h2>

    <h3>Layout &amp; Flexbox</h3>
    <DocsCodeBlock lang="text" code="flex hidden
flex-row flex-col flex-row-reverse flex-col-reverse
flex-wrap flex-nowrap flex-wrap-reverse
flex-1 flex-auto flex-none
grow grow-0 shrink shrink-0
basis-1/2 basis-1/3 basis-1/4 basis-full
gap-4 gap-x-4 gap-y-2" />

    <h3>Alignment</h3>
    <DocsCodeBlock lang="text" code="items-start items-center items-end items-stretch items-baseline
justify-start justify-center justify-end justify-between justify-around justify-evenly
content-start content-center content-end content-between content-around
self-auto self-start self-center self-end self-stretch self-baseline" />

    <h3>Spacing</h3>
    <DocsCodeBlock lang="text" code="p-4 px-6 py-3 pt-4 pr-3 pb-2 pl-5
m-4 mx-6 my-3 mt-4 mr-3 mb-2 ml-5
-mt-2 -ml-4" />

    <h3>Sizing</h3>
    <DocsCodeBlock lang="text" code="w-64 w-1/2 w-full w-auto w-screen w-min w-max w-fit
h-64 h-full h-auto h-screen h-min h-max h-fit
min-w-0 max-w-xl min-h-0 max-h-64" />

    <h3>Positioning</h3>
    <DocsCodeBlock lang="text" code="absolute relative static
inset-0 inset-x-0 inset-y-0
top-0 right-0 bottom-0 left-0
z-10 z-50" />

    <h3>Colors</h3>
    <DocsCodeBlock lang="text" code="bg-blue-500 bg-red-100 bg-green-700
text-white text-gray-900 text-slate-600
border-blue-300 border-red-500
decoration-green-500
fill-blue-400 stroke-red-500" />

    <DocsPropsTable
      :rows="[
        { name: 'Color format', type: 'HEX', description: 'All colors are vendored as hex values (Tailwind v3 palette). oklch/hsl color spaces from Tailwind v4 are not supported.' },
        { name: 'Custom colors', type: 'configureTw({ colors: {...} })', description: 'Extend or override colors via theme configuration.' },
        { name: 'Arbitrary', type: 'bg-[#bada55]', description: 'Use bracket syntax for arbitrary color values.' },
      ]"
    />

    <h3>Borders &amp; Radius</h3>
    <DocsCodeBlock lang="text" code="border border-0 border-2 border-4 border-8
border-t border-r border-b border-l
border-solid border-dashed border-dotted
rounded rounded-md rounded-lg rounded-xl rounded-2xl rounded-3xl rounded-full
rounded-t-lg rounded-b-lg rounded-l-lg rounded-r-lg
rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg" />

    <h3>Typography</h3>
    <DocsCodeBlock lang="text" code="text-xs text-sm text-base text-lg text-xl text-2xl text-3xl text-4xl
font-thin font-light font-normal font-medium font-semibold font-bold font-extrabold font-black
italic not-italic
leading-3 leading-4 leading-5 leading-6 leading-7 leading-8 leading-9 leading-10
leading-none leading-tight leading-snug leading-normal leading-relaxed leading-loose
tracking-tighter tracking-tight tracking-normal tracking-wide tracking-wider tracking-widest
text-left text-center text-right text-justify
underline line-through no-underline
uppercase lowercase capitalize normal-case" />

    <h3>Object Fit &amp; Overflow</h3>
    <DocsCodeBlock lang="text" code="object-contain object-cover object-fill object-none object-scale-down
object-center object-top object-bottom object-left object-right
overflow-hidden" />

    <h2>Combining tw and :style</h2>
    <p>
      The <code>tw</code> prop is the base layer and <code>:style</code> is the override layer.
      When a property appears in both, <code>:style</code> wins:
    </p>

    <DocsCodeBlock lang="vue" :code="codeMixed" />

    <h2>Custom Theme</h2>
    <p>
      Call <code>configureTw()</code> in your app entry point to extend or override
      the default theme:
    </p>

    <DocsCodeBlock lang="vue" :code="codeCustom" />

    <h2>Limitations</h2>
    <ul>
      <li>
        <strong>Font families</strong> — <code>font-sans</code>, <code>font-serif</code>,
        <code>font-mono</code> map to generic families. Custom fonts must be registered
        with <code>Font.register()</code> first.
      </li>
      <li>
        <strong>CSS Grid</strong> — Not supported. vue-pdf uses Yoga Layout (flexbox only).
      </li>
      <li>
        <strong>Shadows &amp; Transforms</strong> — Not supported in PDF.
        <code>scale-*</code>, <code>rotate-*</code>, and <code>translate-*</code>
        are on the roadmap (Phase 3).
      </li>
      <li>
        <strong>Pseudo-classes</strong> — <code>hover:</code>, <code>focus:</code>,
        and <code>dark:</code> are not applicable. Responsive prefixes
        (<code>sm:</code>, <code>md:</code>, etc.) are in Phase 2.
      </li>
      <li>
        <strong>Alpha / opacity</strong> — <code>bg-blue-500/50</code> is not yet
        supported.
      </li>
    </ul>

    <h2>API Reference</h2>

    <DocsPropsTable
      :rows="[
        { name: 'tw()', type: '(classes: string) => Style', description: 'Convert a Tailwind class string to a vue-pdf Style object (default instance).' },
        { name: 'createTw(theme?, options?)', type: '(classes: string) => Style', description: 'Create a custom converter with optional theme overrides and ptPerRem.' },
        { name: 'configureTw(theme?, options?)', type: 'void', description: 'Replace the global converter (used by the tw prop on all components).' },
      ]"
    />

    <DocsPropsTable
      :rows="[
        { name: 'TwTheme', type: 'object', description: 'Theme overrides. Keys: colors, spacing, fontFamily, fontSize, fontWeight, borderRadius, borderWidth, opacity, zIndex, letterSpacing, lineHeight, maxWidth, extend.' },
        { name: 'TwOptions', type: '{ ptPerRem?: number }', description: 'Converter options. ptPerRem defaults to 12.' },
      ]"
    />
  </div>
</template>
