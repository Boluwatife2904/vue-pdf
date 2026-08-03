import { defineNuxtConfig } from "nuxt/config"
import monacoEditorPlugin from "vite-plugin-monaco-editor"
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: "2026-07-19",
  modules: ["@vue-pdf/nuxt", "nuxt-og-image"],

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://vue-pdf.vercel.app",
      version: "1.0.0",
    },
  },
  devtools: { enabled: true },
  vue: {
    runtimeCompiler: true,
  },
  ignore: ["../dist/**", "../node_modules/**", "../.git/**"],
  css: ["~/assets/css/main.css", "~/assets/css/docs.css"],
  ogImage: {
    zeroRuntime: false,
    // Matches the DocsCover canvas — the module default is 1200x600, which crops it.
    defaults: { width: 1200, height: 630 },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      titleTemplate: "%s | vue-pdf",
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('vue-pdf-theme');if(t==='light')document.documentElement.classList.add('light')}catch(e){}})()`,
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap",
        },
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      monacoEditorPlugin({ languageWorkers: ["editorWorkerService"] }),
    ],
    server: {
      watch: {
        ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
      },
    },
  },
})
