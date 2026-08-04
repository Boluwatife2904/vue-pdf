<script setup lang="ts">
useSeoMeta({
  ogType: "website",
  twitterCard: "summary_large_image",
})
// Icons live in nuxt.config's app.head — declaring one here too emitted a
// second, duplicate <link rel="icon">.
useHead({
  htmlAttrs: { lang: "en" },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
