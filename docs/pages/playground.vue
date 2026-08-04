<script setup lang="ts">
import * as Vue from 'vue'
import * as pdfComponents from '@vuepdf/renderer/components'
import { Font } from '@vuepdf/renderer'
import type * as Monaco from 'monaco-editor'
import {
  openBlock,
  createBlock,
  createElementBlock,
  createVNode,
  createElementVNode,
  createCommentVNode,
  createTextVNode,
  resolveComponent,
  resolveDirective,
  resolveDynamicComponent,
  renderList,
  renderSlot,
  createSlots,
  toDisplayString,
  withCtx,
  withDirectives,
  Fragment,
  mergeProps,
  normalizeClass,
  normalizeStyle,
  normalizeProps,
  guardReactiveProps,
  toHandlers,
  vModelText,
  vShow,
  camelize,
  capitalize,
  toHandlerKey,
  setBlockTracking,
  withMemo,
  isMemoSame,
} from 'vue'

// Prevent tree-shaking
const _force = {
  openBlock, createBlock, createElementBlock,
  createVNode, createElementVNode, createCommentVNode, createTextVNode,
  resolveComponent, resolveDirective, resolveDynamicComponent,
  renderList, renderSlot, createSlots, toDisplayString,
  withCtx, withDirectives, Fragment,
  mergeProps, normalizeClass, normalizeStyle, normalizeProps,
  guardReactiveProps, toHandlers,
  vModelText, vShow,
  camelize, capitalize, toHandlerKey, setBlockTracking,
  withMemo, isMemoSame,
}
void _force

/* ── SFC compiler (browser only) ────────────────────────── */
// Lazy, not a module-scope import: @vue/compiler-sfc pulls in `consolidate`,
// whose optional engines aren't installed, so SSR 500s on 'velocityjs'.
type SfcCompiler = {
  compileTemplate: (typeof import('@vue/compiler-dom'))['compile']
  parseSFC: (typeof import('@vue/compiler-sfc'))['parse']
  compileScript: (typeof import('@vue/compiler-sfc'))['compileScript']
}

let compilerPromise: Promise<SfcCompiler> | null = null
let compiler: SfcCompiler | null = null

const loadCompiler = () => {
  if (!compilerPromise) {
    compilerPromise = Promise.all([
      import('@vue/compiler-dom'),
      import('@vue/compiler-sfc'),
    ]).then(([dom, sfc]) => {
      compiler = {
        compileTemplate: dom.compile,
        parseSFC: sfc.parse,
        compileScript: sfc.compileScript,
      }
      return compiler
    })
  }
  return compilerPromise
}

usePageSeo(
  'Playground',
  'Live vue-pdf playground — write Vue template code and preview the generated PDF in real time.',
)

const defaultCode = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Text :style="{
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
        marginBottom: 8,
      }">
        Hello, vue-pdf!
      </Text>

      <View :style="{
        borderBottomWidth: 2,
        borderBottomColor: '#dc2626',
        marginBottom: 24,
        width: 60,
      }" />

      <View :style="{
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
      }">
        <View :style="{
          flex: 1,
          padding: 16,
          backgroundColor: '#f0f4ff',
          borderRadius: 4,
        }">
          <Text :style="{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }">
            Flexbox Layout
          </Text>
          <Text :style="{ fontSize: 11, color: '#555', lineHeight: 1.6 }">
            Every View is a flex container by default — powered by Yoga Layout.
          </Text>
        </View>
        <View :style="{
          flex: 1,
          padding: 16,
          backgroundColor: '#fff4f0',
          borderRadius: 4,
        }">
          <Text :style="{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }">
            Vue Components
          </Text>
          <Text :style="{ fontSize: 11, color: '#555', lineHeight: 1.6 }">
            Compose PDFs with Document, Page, View, Text, Image, and more.
          </Text>
        </View>
      </View>

      <Text :style="{
        fontSize: 12,
        lineHeight: 1.8,
        marginBottom: 16,
      }">
        vue-pdf is a Vue 3 port of react-pdf. Use familiar Vue SFCs to create
        PDF documents on the browser and server.
      </Text>

      <Text :style="{
        fontSize: 10,
        color: '#999',
        textAlign: 'center',
        marginTop: 24,
      }">
        Edit the code on the left to see changes in real time
      </Text>
    </Page>
  </Document>
</template>`

/* ── Editor ─────────────────────────────────────────────── */
const code = ref(defaultCode)
const error = ref<string | null>(null)
const tab = ref<'code' | 'preview'>('code')
const editorContainerRef = ref<HTMLElement | null>(null)
const editorRef = shallowRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
const editorReady = ref(false)

const isLightTheme = () => document.documentElement.classList.contains('light')

function getMonacoTheme(): string {
  return isLightTheme() ? 'vs' : 'vs-dark'
}

let monacoPromise: Promise<typeof Monaco> | null = null

function getMonaco(): Promise<typeof Monaco> {
  if (!monacoPromise) {
    monacoPromise = (async () => {
      // MonacoEnvironment must be set before creating an editor, and the `html`
      // language needs its own worker — the generic one throws on HTML requests.
      const [{ default: EditorWorker }, { default: HtmlWorker }, monaco] =
        await Promise.all([
          import('monaco-editor/esm/vs/editor/editor.worker?worker'),
          import('monaco-editor/esm/vs/language/html/html.worker?worker'),
          import('monaco-editor'),
        ])

      ;(self as any).MonacoEnvironment = {
        getWorker: (_id: string, label: string) =>
          label === 'html' ? new HtmlWorker() : new EditorWorker(),
      }

      return monaco
    })()
  }
  return monacoPromise
}

onMounted(async () => {
  if (!editorContainerRef.value) return

  const monaco = await getMonaco()

  const editor = monaco.editor.create(editorContainerRef.value, {
    value: code.value,
    language: 'html',
    theme: getMonacoTheme(),
    fontSize: 13,
    lineHeight: 1.7,
    fontFamily: 'var(--font-code), monospace',
    tabSize: 2,
    insertSpaces: true,
    minimap: { enabled: false },
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    wrappingIndent: 'same',
    automaticLayout: true,
    padding: { top: 20, bottom: 20 },
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    scrollbar: {
      verticalScrollbarSize: 0,
      horizontalScrollbarSize: 0,
    },
  })

  editor.onDidChangeModelContent(() => {
    code.value = editor.getValue()
  })

  editorRef.value = editor

  // Two frames so the tokenizer has colorized before reveal. The timer is a
  // fallback: rAF never fires in a background tab, which would leave it blank.
  const reveal = () => {
    editorReady.value = true
  }

  requestAnimationFrame(() => requestAnimationFrame(reveal))
  setTimeout(reveal, 300)

  const observer = new MutationObserver(() => {
    monaco.editor.setTheme(getMonacoTheme())
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})

onBeforeUnmount(() => {
  editorRef.value?.dispose()
})

watch(code, (val) => {
  const editor = editorRef.value
  if (!editor) return
  if (editor.getValue() !== val) {
    editor.setValue(val)
  }
})

/* ── Compilation ────────────────────────────────────────── */
const compiledComponent = shallowRef<any>(null)
const key = ref(0)

// Both plain and `VuePdf`-prefixed names, so either style resolves at runtime.
const playgroundComponents: Record<string, unknown> = {}
for (const [name, comp] of Object.entries(pdfComponents)) {
  playgroundComponents[name] = comp
  playgroundComponents[`VuePdf${name}`] = comp
}

const vuePdfGlobals: Record<string, unknown> = {
  ...playgroundComponents,
  StyleSheet: { create: (s: any) => s },
  Font,
}

const vueGlobals: Record<string, unknown> = {
  // reactivity
  ref,
  computed,
  reactive,
  shallowRef,
  toRef,
  toRefs,
  watch,
  watchEffect,
  readonly,
  // composition
  defineComponent,
  h,
  onMounted,
  onBeforeUnmount,
  onUpdated,
  onUnmounted,
  // template helpers
  resolveComponent,
  resolveDirective,
  resolveDynamicComponent,
  withDirectives,
  Fragment,
  openBlock,
  createBlock,
  createElementBlock,
  createVNode,
  createElementVNode,
  createCommentVNode,
  createTextVNode,
  renderList,
  renderSlot,
  createSlots,
  toDisplayString,
  withCtx,
  mergeProps,
  normalizeClass,
  normalizeStyle,
  normalizeProps,
  guardReactiveProps,
  toHandlers,
  vModelText,
  vShow,
  // misc
  isRef,
  unref,
  nextTick,
  markRaw,
}

function transformScriptImports(code: string): string {
  const specifiers = (raw: string) =>
    raw
      .split(',')
      .map((n) => n.trim().replace(/\s+as\s+/g, ': '))
      .filter(Boolean)
      .join(', ')

  return code
    .replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]vue['"];?/g,
      (_, names: string) =>
        `const { ${specifiers(names)} } = __vue__;`,
    )
    .replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]@vue-pdf\/renderer['"];?/g,
      (_, names: string) =>
        `const { ${specifiers(names)} } = __vuePdfRenderer__;`,
    )
    .replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]@vue-pdf\/renderer\/components['"];?/g,
      (_, names: string) =>
        `const { ${specifiers(names)} } = __vuePdfRenderer__;`,
    )

    .replace(
      /import\s+\*\s+as\s+(\w+)\s+from\s+['"](@vue-pdf\/\S+)['"];?/g,
      (_, name: string, mod: string) => {
        if (mod === '@vuepdf/renderer' || mod === '@vuepdf/renderer/components')
          return `const ${name} = __vuePdfRenderer__;`
        return ''
      },
    )
    .replace(/import\s+type\s+\{.*?\}\s+from\s+['"][^'"]+['"];?/g, '')
    .replace(/import\s+\{.*?\}\s+from\s+['"][^'"]+['"];?/g, '')
    .replace(/import\s+\S+\s+from\s+['"][^'"]+['"];?/g, '')
    .replace(/export\s+default\s+/, 'return ')
    .trim()
}

function compileSFC(raw: string) {
  const { parseSFC, compileScript } = compiler!
  const { descriptor, errors } = parseSFC(raw, { filename: 'Playground.vue' })
  if (errors.length) throw errors[0]

  if (!descriptor.scriptSetup && !descriptor.script) {
    return parseTemplateOnly(raw)
  }

  const compiled = compileScript(descriptor, {
    id: 'playground',
    isProd: false,
    inlineTemplate: true,
    hoistStatic: false,
    propsDestructure: false,
  })

  const code = transformScriptImports(compiled.content)

  try {
    const fn = new Function('__vue__', '__vuePdfRenderer__', code)
    const component = fn(vueGlobals, vuePdfGlobals)
    if (!component || typeof component !== 'object') {
      throw new Error('Script must export a component via default export')
    }
    return component
  } catch (e: any) {
    const preview = code.length > 300 ? code.slice(0, 300) + '\u2026' : code
    throw new Error(`${e.message}\n\n--- compiled code ---\n${preview}`)
  }
}

function parseTemplateOnly(raw: string) {
  let template = raw.trim()
  const match = template.match(/<template[^>]*>([\s\S]*?)<\/template>/i)
  template = match ? match[1].trim() : template

  const { code } = compiler!.compileTemplate(template, { mode: 'function' } as any)
  const patched = code.replace(/^(const _Vue = )Vue/m, '$1__vue')
  const render = new Function('__vue', patched)(Vue) as any

  if (typeof render !== 'function') {
    throw new Error(`Compilation failed: expected render function, got ${typeof render}`)
  }

  // The template is compiled at runtime, so `resolveComponent("Document")` etc.
  // can't rely on Nuxt's build-time component auto-import. Register the real
  // vue-pdf components locally so the compiled render resolves them.
  return defineComponent({ components: playgroundComponents, render })
}

function parseTemplate(raw: string) {
  if (/<script\b[^>]*>/i.test(raw)) {
    // Strip lang="ts" / lang="typescript" since the browser build of
    // @vue/compiler-sfc doesn't have a TS compiler registered.
    const sanitized = raw.replace(
      /(<script\b[^>]*)\slang=(['"])(?:ts|typescript)\2/i,
      '$1',
    )
    return compileSFC(sanitized)
  }
  return parseTemplateOnly(raw)
}

// Raw source of the component currently on screen; lets us skip redundant
// recompiles and keep the last good render when new code fails to compile.
let lastCompiled = ''

const compile = async () => {
  const raw = code.value
  try {
    // No-op after the first call; the compiler is cached module-side.
    await loadCompiler()
    const next = parseTemplate(raw)
    compiledComponent.value = next
    lastCompiled = raw
    error.value = null
    key.value++
  } catch (e: any) {
    error.value = e.message || String(e)
  }
}

onMounted(compile)

let timer: ReturnType<typeof setTimeout>
watch(code, (raw) => {
  clearTimeout(timer)
  if (raw === lastCompiled) {
    error.value = null
    return
  }
  timer = setTimeout(compile, 400)
})

/* ── Preview ────────────────────────────────────────────── */
// Double-buffered iframes: PDFViewer (hidden) rebuilds the document and hands
// us each new blob via @render. We load it into the off-screen buffer and only
// crossfade to it once it has finished loading, so edits never flash a blank
// frame the way swapping a single iframe's src does.
const pdfBlob = shallowRef<Blob | null>(null)
const frames = reactive([
  { src: '', url: '' },
  { src: '', url: '' },
])
const active = ref(-1)
let pendingFrame = -1
let swapTimer: ReturnType<typeof setTimeout>

const activate = (i: number) => {
  if (!frames[i].src) return
  active.value = i
  pendingFrame = -1
}

const onRender = ({ blob }: { blob: Blob }) => {
  if (!blob) return
  pdfBlob.value = blob
  const target = active.value === 0 ? 1 : 0
  if (frames[target].url) URL.revokeObjectURL(frames[target].url)
  const url = URL.createObjectURL(blob)
  frames[target].url = url
  frames[target].src = `${url}#toolbar=0&navpanes=0&statusbar=0&view=FitH`
  pendingFrame = target
  clearTimeout(swapTimer)
  // Fallback in case the PDF viewer's load event doesn't fire.
  swapTimer = setTimeout(() => activate(target), 800)
}

const onFrameLoad = (i: number) => {
  if (i === pendingFrame) {
    clearTimeout(swapTimer)
    activate(i)
  }
}

onBeforeUnmount(() => {
  clearTimeout(swapTimer)
  for (const f of frames) if (f.url) URL.revokeObjectURL(f.url)
})

const download = () => {
  const blob = pdfBlob.value
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'vue-pdf-playground.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const reset = () => {
  code.value = defaultCode
}
</script>

<template>
  <div class="playground pg-fullbleed" :class="`pg-show-${tab}`">
    <div class="pg-tabs">
      <button type="button" :class="{ active: tab === 'code' }" @click="tab = 'code'">Code</button>
      <button type="button" :class="{ active: tab === 'preview' }" @click="tab = 'preview'">Preview</button>
    </div>

    <div class="pg-panels">
      <div class="pg-editor">
        <div class="pg-editor-head">
          <span class="pg-editor-title">Editor</span>
          <button class="pg-reset-btn" @click="reset">Reset</button>
        </div>
        <div class="pg-editor-body">
          <div v-if="!editorReady" class="pg-placeholder pg-placeholder-editor">
            <span>Loading editor…</span>
          </div>
          <div ref="editorContainerRef" class="pg-monaco" :class="{ ready: editorReady }" />
        </div>
        <div v-if="error" class="pg-error">
          <strong>Compilation Error:</strong>
          <pre>{{ error }}</pre>
        </div>
      </div>

      <div class="pg-preview">
        <div class="pg-preview-head">
          <span class="pg-preview-title">Preview</span>
          <button class="pg-download-btn" :disabled="!pdfBlob" @click="download">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v8m0 0L4 6m3 3l3-3M2 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Download
          </button>
        </div>
        <div class="pg-preview-body">
          <div v-if="active < 0" class="pg-placeholder">
            <span>{{ compiledComponent ? 'Rendering…' : 'Preparing preview…' }}</span>
          </div>
          <ClientOnly>
            <PDFViewer
              v-if="compiledComponent"
              class="pg-builder"
              :show-toolbar="false"
              @render="onRender"
            >
              <component :is="compiledComponent" :key="key" />
            </PDFViewer>
            <iframe
              v-for="(f, i) in frames"
              :key="i"
              :src="f.src || undefined"
              class="pg-frame"
              :class="{ active: active === i }"
              title="PDF preview"
              @load="onFrameLoad(i)"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/css/main.css";

.playground {
  @apply flex flex-col overflow-hidden m-0;
  height: calc(100vh - 52px);
}

.pg-tabs {
  @apply hidden shrink-0 border-b border-[var(--color-border)];
  background: var(--color-code-bg);
}

.pg-tabs button {
  @apply flex-1 p-3 font-ui text-xs font-semibold tracking-[0.05em] uppercase cursor-pointer bg-transparent border-none border-b-2 border-transparent;
  color: var(--color-muted);
  transition: color 0.15s, border-color 0.15s;
}

.pg-tabs button.active {
  color: var(--color-text);
  border-bottom-color: var(--color-accent);
}

.pg-panels {
  @apply flex flex-1 min-h-0;
}

.pg-editor {
  @apply w-1/2 flex flex-col border-r border-[var(--color-border)] min-w-[360px];
}

.pg-editor-head,
.pg-preview-head {
  @apply flex items-center justify-between px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase shrink-0 border-b border-[var(--color-border)];
  background: var(--color-code-bg);
  color: var(--color-muted);
}

.pg-editor-title {
  @apply flex items-center gap-1.5;
}

.pg-editor-title::before {
  content: "";
  @apply inline-block w-2 h-2 rounded-full;
  background: var(--color-accent);
}

.pg-reset-btn {
  @apply font-ui text-[11.5px] font-medium bg-transparent border border-[var(--color-border)] rounded px-3 py-1 cursor-pointer transition-colors;
  color: var(--color-muted);
}

.pg-reset-btn:hover {
  color: var(--color-text);
  border-color: var(--color-subtle);
}

.pg-download-btn {
  @apply inline-flex items-center gap-1.5 font-ui text-[11.5px] font-medium bg-transparent border border-[var(--color-border)] rounded px-3 py-1 cursor-pointer transition-[color,border-color,opacity];
  color: var(--color-muted);
}

.pg-download-btn:hover:not(:disabled) {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.pg-download-btn:disabled {
  @apply opacity-45 cursor-not-allowed;
}

.pg-download-btn svg {
  @apply shrink-0;
}

/* Holds the editor and its loading placeholder in the same box, so the
   placeholder can sit over the editor's area rather than shifting it. */
.pg-editor-body {
  @apply relative flex-1 flex flex-col min-h-0;
}

.pg-placeholder-editor {
  @apply absolute inset-0 flex items-center justify-center;
}

.pg-monaco {
  @apply flex-1 min-h-0 overflow-hidden;
  /* Monaco paints its text one frame before the tokenizer colorizes it, which
     reads as a flash of unstyled code on load. Hold the editor hidden until it
     has had a frame to colorize, then fade it in. */
  opacity: 0;
  transition: opacity 120ms ease-out;
}

.pg-monaco.ready {
  opacity: 1;
}

.pg-error {
  @apply px-5 py-3.5 shrink-0 text-xs overflow-auto;
  background: rgba(220, 38, 38, 0.08);
  border-top: 1px solid rgba(220, 38, 38, 0.2);
  color: #f87171;
  max-height: 30%;
}

.pg-error strong {
  @apply block mb-1;
}

.pg-error pre {
  @apply font-mono text-[11px] whitespace-pre-wrap m-0;
}

.pg-preview {
  @apply flex-1 flex flex-col min-w-0;
  background: var(--color-code-bg);
}

.pg-preview-body {
  @apply relative flex-1 flex items-center justify-center min-h-0;
}

/* The builder is only used to produce the PDF blob; the visible output is the
   .pg-frame iframes below. It must be hidden via :deep() — <PDFViewer> renders
   its iframe from inside its own component and returns a multi-root Fragment,
   so Vue cannot put this file's scope id on it and a plain `.pg-builder` rule
   never matches. Unscoped, it stayed a default 300x150 iframe that displaced
   the placeholder for a beat on load. */
.pg-preview-body :deep(.pg-builder) {
  display: none !important;
}

.pg-frame {
  @apply absolute inset-0 w-full h-full border-0 opacity-0 pointer-events-none;
  transition: opacity 0.18s ease;
}

.pg-frame.active {
  @apply opacity-100 pointer-events-auto;
}

.pg-placeholder {
  @apply flex flex-col items-center gap-2 p-10 text-[13px] text-center;
  color: var(--color-muted);
}

@media (max-width: 768px) {
  .playground {
    height: calc(100vh - 52px);
  }

  .pg-tabs {
    @apply flex;
  }

  .pg-panels {
    @apply flex-col;
  }

  .pg-editor,
  .pg-preview {
    @apply w-full flex-1 min-w-0;
  }

  .pg-editor {
    @apply border-r-0;
  }

  .pg-show-code .pg-preview {
    @apply hidden;
  }

  .pg-show-preview .pg-editor {
    @apply hidden;
  }
}
</style>
