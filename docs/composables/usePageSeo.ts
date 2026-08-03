export const usePageSeo = (title: string, description: string) => {
  const { public: { siteUrl } } = useRuntimeConfig()
  const route = useRoute()

  useSeoMeta({
    title,
    description,
    ogTitle: `${title} | vue-pdf`,
    ogDescription: description,
    ogUrl: `${siteUrl}${route.path}`,
    twitterTitle: `${title} | vue-pdf`,
    twitterDescription: description,
  })

  defineOgImage('DocsCover', { title, description })
}
