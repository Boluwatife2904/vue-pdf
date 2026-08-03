<script setup lang="ts">
useSeoMeta({
  ogType: "website",
  twitterCard: "summary_large_image",
})
useHead({
  htmlAttrs: { lang: "en" },
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
