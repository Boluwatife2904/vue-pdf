<script setup lang="ts">
import hljs from "highlight.js/lib/core"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"
import bash from "highlight.js/lib/languages/bash"

hljs.registerLanguage("ts", typescript)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("vue", xml)
hljs.registerLanguage("bash", bash)
hljs.registerLanguage("sh", bash)

interface Props {
  code: string
  lang?: string
  filename?: string
}

const props = defineProps<Props>()

const copied = ref(false)

const copy = async () => {
  await navigator.clipboard.writeText(props.code.trim())
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const escHtml = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const highlighted = computed(() => {
  const raw = props.code.trim()
  const lang = props.lang || "ts"
  const supported = ["ts", "typescript", "vue", "bash", "sh"]
  if (!supported.includes(lang)) return escHtml(raw)
  return hljs.highlight(raw, { language: lang }).value
})
</script>

<template>
  <div class="cb">
    <div class="cb-head">
      <span class="cb-lang">{{ filename || lang || "code" }}</span>
      <button class="cb-copy" :class="{ done: copied }" @click="copy">
        <svg v-if="!copied" width="13" height="13" viewBox="0 0 13 13" fill="none">
          <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.2" />
          <path d="M1 8.5V2a1 1 0 011-1h6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>
        <svg v-else width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 6.5l3 3 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ copied ? "Copied" : "Copy" }}
      </button>
    </div>
    <pre class="cb-pre"><code class="hljs" v-html="highlighted" /></pre>
  </div>
</template>

<style scoped>
/* Make the @theme tokens (font-ui, color-*, …) resolvable to @apply here. */
@reference "../assets/css/main.css";

.cb {
  @apply my-5 text-[13.5px] border border-border rounded-md overflow-hidden;
  background: var(--color-code-bg);
}

.cb-head {
  @apply flex items-center justify-between px-4 py-2 border-b border-border;
  background: rgba(255, 255, 255, 0.03);
}

.cb-lang {
  @apply font-mono text-[11px] font-medium tracking-[0.03em];
  color: var(--color-muted);
}

.cb-copy {
  @apply flex items-center gap-1.25 font-ui text-[11.5px] font-medium bg-transparent border-none cursor-pointer px-2 py-0.75 rounded transition-[color,background];
  color: var(--color-muted);
}

.cb-copy:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.07);
}

.cb-copy.done {
  color: var(--color-accent);
}

.cb-pre {
  @apply p-5 overflow-x-auto m-0 leading-[1.7];
}

code {
  @apply font-mono text-[13.5px] block bg-transparent! p-0!;
}
</style>
