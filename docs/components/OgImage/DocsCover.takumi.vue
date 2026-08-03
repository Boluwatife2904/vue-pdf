<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: "vue-pdf",
  description: "Create PDF documents with Vue components — on the browser and the server",
})

// Decorative "text lines" for the paper preview on the right.
// [width %, is a heading line]
const lines: [number, boolean][] = [
  [70, true],
  [100, false],
  [92, false],
  [96, false],
  [58, false],
  [46, true],
  [100, false],
  [88, false],
  [97, false],
  [64, false],
]
</script>

<template>
  <div
    :style="{
      display: 'flex',
      width: '1200px',
      height: '630px',
      backgroundColor: '#09090c',
      overflow: 'hidden',
      position: 'relative',
    }"
  >
    <!-- Accent glow behind the paper -->
    <div
      :style="{
        position: 'absolute',
        top: '105px',
        right: '30px',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        backgroundColor: 'rgba(220,38,38,0.055)',
      }"
    />

    <!-- Bottom-left decorative arcs -->
    <div
      :style="{
        position: 'absolute',
        bottom: '-130px',
        left: '-130px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        border: '1.5px solid rgba(220,38,38,0.15)',
      }"
    />
    <div
      :style="{
        position: 'absolute',
        bottom: '-85px',
        left: '-85px',
        width: '290px',
        height: '290px',
        borderRadius: '50%',
        border: '1.5px solid rgba(220,38,38,0.10)',
      }"
    />

    <!-- Left: copy -->
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 72px 80px 88px',
        flex: 1,
      }"
    >
      <!-- Badge -->
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '28px',
        }"
      >
        <div
          :style="{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#dc2626',
          }"
        />
        <span
          :style="{
            color: '#dc2626',
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontFamily: 'Inter',
          }"
        >
          vue-pdf
        </span>
      </div>

      <!-- Title -->
      <div
        :style="{
          fontSize: title === 'vue-pdf' ? '84px' : '56px',
          fontWeight: '800',
          color: '#ffffff',
          lineHeight: '1.05',
          letterSpacing: '0em',
          fontFamily: 'Inter',
          marginBottom: '24px',
        }"
      >
        {{ title }}
      </div>

      <!-- Description -->
      <div
        :style="{
          fontSize: '24px',
          color: '#7a8a9e',
          fontWeight: '400',
          lineHeight: '1.55',
          maxWidth: '600px',
          fontFamily: 'Inter',
          marginBottom: '44px',
        }"
      >
        {{ description }}
      </div>

      <!-- Tags row -->
      <div :style="{ display: 'flex', gap: '10px' }">
        <div
          v-for="tag in ['Vue 3', 'Flexbox Layout', 'Browser + Server', 'TypeScript']"
          :key="tag"
          :style="{
            backgroundColor: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.25)',
            color: '#fca5a5',
            fontSize: '13px',
            fontWeight: '600',
            padding: '7px 16px',
            borderRadius: '6px',
            fontFamily: 'Inter',
          }"
        >
          {{ tag }}
        </div>
      </div>
    </div>

    <!-- Right: PDF page preview -->
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '360px',
        flexShrink: 0,
        marginRight: '64px',
      }"
    >
      <div
        :style="{
          display: 'flex',
          flexDirection: 'column',
          width: '250px',
          height: '340px',
          backgroundColor: '#12131a',
          border: '1px solid #23252f',
          borderRadius: '10px',
          padding: '26px 24px',
          position: 'relative',
        }"
      >
        <!-- PDF file-type chip, sitting on the page corner -->
        <div
          :style="{
            position: 'absolute',
            top: '-16px',
            right: '-14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '58px',
            height: '32px',
            backgroundColor: '#dc2626',
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '800',
            letterSpacing: '1px',
            fontFamily: 'Inter',
          }"
        >
          PDF
        </div>

        <!-- Document body lines -->
        <div
          v-for="([width, heading], i) in lines"
          :key="i"
          :style="{
            width: `${width}%`,
            height: heading ? '13px' : '8px',
            borderRadius: '3px',
            marginBottom: heading ? '18px' : '13px',
            backgroundColor: heading ? 'rgba(220,38,38,0.55)' : 'rgba(168,179,192,0.22)',
          }"
        />

        <!-- Footer block, stands in for an embedded View -->
        <div
          :style="{
            display: 'flex',
            marginTop: 'auto',
            width: '100%',
            height: '44px',
            borderRadius: '6px',
            border: '1px solid rgba(220,38,38,0.22)',
            backgroundColor: 'rgba(220,38,38,0.06)',
          }"
        />
      </div>
    </div>
  </div>
</template>
