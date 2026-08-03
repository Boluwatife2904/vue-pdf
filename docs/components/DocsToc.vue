<script setup lang="ts">
const route = useRoute()

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

const headings = ref<TocItem[]>([])
const activeId = ref("")

let scrollLocked = false
let unlockTimer: ReturnType<typeof setTimeout> | null = null
/** Cancels a pending scroll lock without running its settle callback. */
let releaseLock: (() => void) | null = null

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")

const scanHeadings = (): void => {
  const prose = document.querySelector(".prose")
  if (!prose) {
    headings.value = []
    return
  }
  const els = Array.from(prose.querySelectorAll("h2, h3"))
  headings.value = els.map((el) => {
    if (!el.id) el.id = slugify(el.textContent || "")
    return {
      id: el.id,
      text: el.textContent?.trim() || "",
      level: el.tagName === "H3" ? 3 : 2,
    } as TocItem
  })
  if (headings.value.length) updateActive()
}

const TRIGGER = 56

/** Distance from the top of the document to a heading, independent of current scroll. */
const offsetOf = (id: string): number => {
  const el = document.getElementById(id)
  return el ? el.getBoundingClientRect().top + window.scrollY : Infinity
}

/** Which heading is active when the page sits at scroll position `y`. */
const activeAt = (y: number): string => {
  if (!headings.value.length) return ""

  if (y + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    return headings.value.at(-1)?.id ?? ""
  }

  let current = ""
  for (const { id } of headings.value) {
    if (offsetOf(id) - y <= TRIGGER) current = id
  }
  if (current) return current

  const firstId = headings.value[0]?.id ?? ""
  return offsetOf(firstId) - y < window.innerHeight ? firstId : ""
}

const updateActive = (): void => {
  if (scrollLocked) return
  activeId.value = activeAt(window.scrollY)
}

/**
 * Freeze scroll-driven updates until the page stops moving. Without this, an
 * animated scroll (`html { scroll-behavior: smooth }`) fires the scroll handler
 * on every frame and drags the indicator through every heading it passes.
 */
const lockUntilSettled = (onSettle?: () => void): void => {
  releaseLock?.()
  scrollLocked = true

  const unlock = (settled = true): void => {
    if (unlockTimer) clearTimeout(unlockTimer)
    unlockTimer = null
    releaseLock = null
    window.removeEventListener("scrollend", onScrollEnd)
    scrollLocked = false
    if (settled) onSettle?.()
  }

  // `scrollend` never fires when the scroll is a no-op (already at the target),
  // so the timer is the fallback that always releases the lock.
  const onScrollEnd = (): void => unlock()
  releaseLock = () => unlock(false)

  window.addEventListener("scrollend", onScrollEnd)
  unlockTimer = setTimeout(onScrollEnd, 1000)
}

const scrollTo = (id: string): void => {
  const el = document.getElementById(id)
  if (!el) return

  // Hold the clicked heading active — no settle callback. The scroll lands it 72px
  // from the top, past the 56px TRIGGER, so recomputing would pick the heading above it.
  activeId.value = id
  lockUntilSettled()

  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" })
}

const refresh = async (): Promise<void> => {
  headings.value = []
  activeId.value = ""

  // A route change resets scroll to the top, so ignore that scroll until it lands.
  // Recompute on settle rather than trusting the prediction below — back/forward
  // navigation restores the previous offset instead of going to the top.
  lockUntilSettled(updateActive)

  await nextTick()
  await nextTick()
  scanHeadings()

  // Highlight where the page is about to be, not where it currently is.
  activeId.value = activeAt(0)
}

onMounted(() => {
  scanHeadings()
  window.addEventListener("scroll", updateActive, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener("scroll", updateActive)
  releaseLock?.()
})

watch(() => route.path, refresh)
</script>

<template>
  <nav v-if="headings.length" class="toc" aria-label="On this page">
    <p class="toc-title">On this page</p>
    <ul class="toc-list">
      <li v-for="h in headings" :key="h.id">
        <a
          :href="`#${h.id}`"
          :class="['toc-link', h.level === 3 && 'toc-h3', activeId === h.id && 'active']"
          @click.prevent="scrollTo(h.id)"
        >{{ h.text }}</a>
      </li>
    </ul>
  </nav>
</template>
